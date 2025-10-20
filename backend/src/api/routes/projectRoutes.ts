// API Routes - Projects

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { ProjectService } from '../../application/services/ProjectService.js';
import { config } from '../../config/index.js';

export async function projectRoutes(
  fastify: FastifyInstance,
  projectService: ProjectService
) {
  /**
   * POST /projects
   * Upload image et créer un projet
   */
  fastify.post('/projects', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const data = await request.file();

      if (!data) {
        return reply.code(400).send({ error: 'No file uploaded' });
      }

      // Vérifier le type de fichier
      if (!config.ALLOWED_IMAGE_FORMATS.includes(data.mimetype)) {
        return reply.code(400).send({ error: 'Format non supporté. Utilisez JPG ou PNG.' });
      }

      // Vérifier la taille
      const buffer = await data.toBuffer();
      if (buffer.length > config.MAX_FILE_SIZE) {
        return reply.code(400).send({ error: 'Fichier trop volumineux. Maximum 10 MB.' });
      }

      // Extraire la description utilisateur et métadonnées
      const fields = data.fields as any;
      const userDescription = fields?.description?.value;
      const userAgent = request.headers['user-agent'] || '';
      const ip = request.ip;

      // Créer le projet
      const project = await projectService.createProject({
        imageBuffer: buffer,
        imageFilename: data.filename,
        imageMimetype: data.mimetype,
        userDescription,
        metadata: {
          userAgent,
          ip,
          source: fields?.source?.value,
          utm_source: fields?.utm_source?.value,
          utm_campaign: fields?.utm_campaign?.value,
        },
      });

      return reply.send({
        id: project.id,
        status: project.status,
        originalImageUrl: project.originalImageUrl,
      });
    } catch (error) {
      console.error('Error creating project:', error);
      return reply.code(500).send({ error: 'Erreur lors de l\'upload' });
    }
  });

  /**
   * POST /projects/:id/generate
   * Générer la visualisation végétalisée
   */
  fastify.post('/projects/:id/generate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const body = request.body as { location?: string };

      const project = await projectService.generateVisualization(id, body.location);

      return reply.send({
        id: project.id,
        status: project.status,
        analysisData: project.analysisData,
        estimation: project.estimation,
        generatedImageUrl: project.generatedImageUrl,
      });
    } catch (error) {
      console.error('Error generating visualization:', error);
      const message = error instanceof Error ? error.message : 'Erreur de génération';

      if (message.includes('timeout') || message.includes('Timeout')) {
        return reply.code(504).send({ error: 'Génération trop longue. Réessayez avec une autre photo.' });
      }

      return reply.code(500).send({ error: message });
    }
  });

  /**
   * GET /projects/:id
   * Récupérer un projet
   */
  fastify.get('/projects/:id', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const project = await projectService.getProject(id);

      // Si le projet n'est pas unlocked, flouter certaines infos
      if (!project.isUnlocked()) {
        return reply.send({
          id: project.id,
          status: project.status,
          estimation: project.estimation, // On envoie l'estimation pour le teasing
          analysisData: null, // Masqué
          generatedImageUrl: project.generatedImageUrl, // URL envoyée mais sera floutée côté front
          isUnlocked: false,
        });
      }

      return reply.send({
        id: project.id,
        status: project.status,
        originalImageUrl: project.originalImageUrl,
        generatedImageUrl: project.generatedImageUrl,
        analysisData: project.analysisData,
        estimation: project.estimation,
        userDescription: project.userDescription,
        isUnlocked: true,
        leadEmail: project.leadEmail,
      });
    } catch (error) {
      console.error('Error fetching project:', error);
      return reply.code(404).send({ error: 'Projet non trouvé' });
    }
  });

  /**
   * POST /projects/:id/unlock
   * Débloquer avec email (collecte uniquement)
   */
  fastify.post('/projects/:id/unlock', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const body = request.body as { email: string };

      if (!body.email) {
        return reply.code(400).send({ error: 'Email requis' });
      }

      const result = await projectService.unlockProject(id, body.email);

      return reply.send({
        success: true,
        project: {
          id: result.project.id,
          status: result.project.status,
          originalImageUrl: result.project.originalImageUrl,
          generatedImageUrl: result.project.generatedImageUrl,
          analysisData: result.project.analysisData,
          estimation: result.project.estimation,
          isUnlocked: true,
        },
      });
    } catch (error) {
      console.error('Error unlocking project:', error);
      const message = error instanceof Error ? error.message : 'Erreur';

      if (message.includes('email') || message.includes('Email')) {
        return reply.code(400).send({ error: message });
      }

      return reply.code(500).send({ error: 'Erreur lors du déblocage' });
    }
  });

  /**
   * POST /projects/:id/track
   * Tracker une action (calendly uniquement)
   */
  fastify.post('/projects/:id/track', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { id } = request.params as { id: string };
      const body = request.body as { action: 'calendly' };

      if (!body.action || body.action !== 'calendly') {
        return reply.code(400).send({ error: 'Action invalide' });
      }

      await projectService.trackLeadAction(id, body.action);

      return reply.send({ success: true });
    } catch (error) {
      console.error('Error tracking action:', error);
      return reply.code(500).send({ error: 'Erreur lors du tracking' });
    }
  });

  /**
   * GET /health
   * Health check
   */
  fastify.get('/health', async (_request, reply) => {
    return reply.send({ status: 'ok', service: 'demo-demet-air' });
  });
}
