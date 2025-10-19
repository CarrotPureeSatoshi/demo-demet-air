// Repository Interface - Project (Domain Layer)

import { Project } from '../entities/Project.js';

export interface IProjectRepository {
  create(project: Project): Promise<Project>;
  findById(id: string): Promise<Project | null>;
  findByEmail(email: string): Promise<Project[]>;
  update(project: Project): Promise<Project>;
  delete(id: string): Promise<void>;
  findAll(limit?: number, offset?: number): Promise<Project[]>;
  countByStatus(status: string): Promise<number>;
}
