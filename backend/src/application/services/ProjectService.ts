// Service Applicatif Principal - Orchestration du flow projet

import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import sharp from 'sharp';
import { IProjectRepository } from '../../domain/repositories/IProjectRepository.js';
import { ILeadRepository } from '../../domain/repositories/ILeadRepository.js';
import { Project, ProjectMetadata } from '../../domain/entities/Project.js';
import { Lead } from '../../domain/entities/Lead.js';
import { Email } from '../../domain/value-objects/Email.js';
import { GeminiService } from '../../infrastructure/ai/GeminiService.js';
import { EstimationService } from './EstimationService.js';
import { StorageService } from '../../infrastructure/storage/StorageService.js';

export interface CreateProjectInput {
  imageBuffer: Buffer;
  imageFilename: string;
  imageMimetype: string;
  userDescription?: string;
  metadata: ProjectMetadata;
}

export class ProjectService {
  constructor(
    private projectRepo: IProjectRepository,
    private leadRepo: ILeadRepository,
    private geminiService: GeminiService,
    private estimationService: EstimationService,
    private storageService: StorageService
  ) {}

  /**
   * Étape 1: Upload et création du projet
   */
  async createProject(input: CreateProjectInput): Promise<Project> {
    // Upload l'image originale
    const uploadResult = await this.storageService.upload(
      input.imageBuffer,
      input.imageFilename,
      input.imageMimetype
    );

    // Créer le projet
    const project = new Project(
      uuidv4(),
      uploadResult.url,
      null, // generatedImageUrl
      null, // analysisData
      null, // estimation
      input.userDescription || null,
      null, // leadEmail
      'uploaded',
      input.metadata,
      new Date(),
      new Date()
    );

    return await this.projectRepo.create(project);
  }

  /**
   * Étape 2: Analyser l'image et générer la version végétalisée
   */
  async generateVisualization(projectId: string, location: string = 'France'): Promise<Project> {
    let project = await this.projectRepo.findById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    try {
      // Marquer comme en cours d'analyse
      project.markAsAnalyzing();
      await this.projectRepo.update(project);

      // Étape 2a: Analyse de l'image
      const analysisData = await this.geminiService.analyzeImage(
        project.originalImageUrl,
        project.userDescription || undefined
      );

      project.completeAnalysis(analysisData);
      await this.projectRepo.update(project);

      // Étape 2b: Génération de l'image végétalisée
      project.markAsGenerating();
      await this.projectRepo.update(project);

      const generatedImageDataUrl = await this.geminiService.generateVegetalizedImage(
        project.originalImageUrl,
        analysisData,
        { userDescription: project.userDescription || undefined }
      );

      // Convertir le data URL base64 en Buffer pour sauvegarde
      const base64Data = generatedImageDataUrl.replace(/^data:image\/\w+;base64,/, '');
      let imageBuffer: Buffer = Buffer.from(base64Data, 'base64');

      // Redimensionner l'image générée pour qu'elle corresponde aux dimensions exactes de l'originale
      try {
        // Télécharger l'image originale pour obtenir ses dimensions
        const originalResponse = await axios.get(project.originalImageUrl, { responseType: 'arraybuffer' });
        const originalBuffer = Buffer.from(originalResponse.data);

        // Obtenir les dimensions de l'image originale
        const originalMetadata = await sharp(originalBuffer).metadata();
        const targetWidth = originalMetadata.width!;
        const targetHeight = originalMetadata.height!;

        console.log(`📐 Resizing generated image to match original: ${targetWidth}x${targetHeight}`);

        // Redimensionner l'image générée pour correspondre exactement
        imageBuffer = await sharp(imageBuffer)
          .resize(targetWidth, targetHeight, {
            fit: 'fill', // Force exact dimensions, may distort
          })
          .toBuffer() as Buffer;

        console.log(`✅ Image resized successfully`);
      } catch (resizeError) {
        console.error('⚠️  Failed to resize generated image, using original:', resizeError);
        // En cas d'erreur, continuer avec l'image non redimensionnée
      }

      // Déterminer l'extension depuis le data URL
      const mimeMatch = generatedImageDataUrl.match(/^data:image\/(\w+);base64,/);
      const extension = mimeMatch ? mimeMatch[1] : 'png';
      const mimetype = `image/${extension}`;

      // Sauvegarder l'image générée via StorageService
      const uploadResult = await this.storageService.upload(
        imageBuffer,
        `generated-${project.id}.${extension}`,
        mimetype
      );

      // Étape 2c: Calcul de l'estimation
      const estimation = this.estimationService.calculate(analysisData, location);

      project.completeGeneration(uploadResult.url, estimation);
      return await this.projectRepo.update(project);
    } catch (error) {
      // En cas d'erreur, marquer le projet
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      project.markAsError(errorMessage);
      await this.projectRepo.update(project);
      throw error;
    }
  }

  /**
   * Étape 3: Débloquer le résultat avec l'email (collecte uniquement, pas d'envoi)
   */
  async unlockProject(projectId: string, emailStr: string): Promise<{ project: Project; lead: Lead }> {
    const project = await this.projectRepo.findById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }

    if (!project.canBeUnlocked()) {
      throw new Error('Project cannot be unlocked yet');
    }

    // Valider l'email
    const email = Email.create(emailStr);

    // Créer le lead (collecte email)
    const lead = new Lead(
      uuidv4(),
      email.getValue(),
      projectId,
      project.metadata,
      new Date()
    );

    await this.leadRepo.create(lead);

    // Unlock le projet
    project.unlock(email.getValue());
    await this.projectRepo.update(project);

    // PAS d'envoi email - juste collecte via HubSpot
    return { project, lead };
  }

  /**
   * Récupérer un projet par ID
   */
  async getProject(projectId: string): Promise<Project> {
    const project = await this.projectRepo.findById(projectId);
    if (!project) {
      throw new Error('Project not found');
    }
    return project;
  }

  /**
   * Récupérer les projets d'un utilisateur
   */
  async getProjectsByEmail(email: string): Promise<Project[]> {
    return await this.projectRepo.findByEmail(email);
  }

  /**
   * Marquer une action lead (Calendly click seulement)
   */
  async trackLeadAction(projectId: string, action: 'calendly'): Promise<void> {
    const lead = await this.leadRepo.findByProjectId(projectId);
    if (!lead) {
      return;
    }

    if (action === 'calendly') {
      lead.markCalendlyClicked();
      await this.leadRepo.update(lead);
    }
  }
}
