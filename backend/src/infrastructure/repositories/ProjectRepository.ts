// MongoDB Implementation of Project Repository

import { IProjectRepository } from '../../domain/repositories/IProjectRepository.js';
import { Project } from '../../domain/entities/Project.js';
import { ProjectModel } from '../mongodb/models/ProjectModel.js';

export class ProjectRepository implements IProjectRepository {
  async create(project: Project): Promise<Project> {
    const doc = new ProjectModel({
      _id: project.id,
      originalImageUrl: project.originalImageUrl,
      generatedImageUrl: project.generatedImageUrl,
      analysisData: project.analysisData,
      estimation: project.estimation,
      userDescription: project.userDescription,
      leadEmail: project.leadEmail,
      status: project.status,
      metadata: project.metadata,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      errorMessage: project.errorMessage,
    });

    await doc.save();
    return this.toDomain(doc);
  }

  async findById(id: string): Promise<Project | null> {
    const doc = await ProjectModel.findById(id);
    return doc ? this.toDomain(doc) : null;
  }

  async findByEmail(email: string): Promise<Project[]> {
    const docs = await ProjectModel.find({ leadEmail: email }).sort({ createdAt: -1 });
    return docs.map(doc => this.toDomain(doc));
  }

  async update(project: Project): Promise<Project> {
    const doc = await ProjectModel.findByIdAndUpdate(
      project.id,
      {
        originalImageUrl: project.originalImageUrl,
        generatedImageUrl: project.generatedImageUrl,
        analysisData: project.analysisData,
        estimation: project.estimation,
        userDescription: project.userDescription,
        leadEmail: project.leadEmail,
        status: project.status,
        metadata: project.metadata,
        updatedAt: project.updatedAt,
        errorMessage: project.errorMessage,
      },
      { new: true }
    );

    if (!doc) {
      throw new Error(`Project ${project.id} not found`);
    }

    return this.toDomain(doc);
  }

  async delete(id: string): Promise<void> {
    await ProjectModel.findByIdAndDelete(id);
  }

  async findAll(limit = 50, offset = 0): Promise<Project[]> {
    const docs = await ProjectModel.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset);
    return docs.map(doc => this.toDomain(doc));
  }

  async countByStatus(status: string): Promise<number> {
    return await ProjectModel.countDocuments({ status });
  }

  private toDomain(doc: any): Project {
    return new Project(
      doc._id.toString(),
      doc.originalImageUrl,
      doc.generatedImageUrl,
      doc.analysisData,
      doc.estimation,
      doc.userDescription,
      doc.leadEmail,
      doc.status,
      doc.metadata || {},
      doc.createdAt,
      doc.updatedAt,
      doc.errorMessage
    );
  }
}
