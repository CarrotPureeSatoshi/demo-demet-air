// Repository Interface - Lead (Domain Layer)

import { Lead } from '../entities/Lead.js';

export interface ILeadRepository {
  create(lead: Lead): Promise<Lead>;
  findById(id: string): Promise<Lead | null>;
  findByEmail(email: string): Promise<Lead[]>;
  findByProjectId(projectId: string): Promise<Lead | null>;
  update(lead: Lead): Promise<Lead>;
  findAll(limit?: number, offset?: number): Promise<Lead[]>;
  countTotal(): Promise<number>;
}
