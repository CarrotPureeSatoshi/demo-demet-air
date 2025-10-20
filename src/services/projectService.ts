// Frontend Service - API calls pour les projets

import apiClient from '../api/client';

export interface ProjectCreateResponse {
  id: string;
  status: string;
  originalImageUrl: string;
}

export interface ProjectGenerateResponse {
  id: string;
  status: string;
  analysisData: any;
  estimation: any;
  generatedImageUrl: string;
}

export interface ProjectGetResponse {
  id: string;
  status: string;
  originalImageUrl?: string;
  generatedImageUrl?: string;
  analysisData?: any;
  estimation: any;
  isUnlocked: boolean;
  leadEmail?: string;
}

export interface ProjectUnlockResponse {
  success: boolean;
  project: ProjectGetResponse;
}

export const projectService = {
  /**
   * Upload une image et créer un projet
   */
  async create(file: File, userDescription?: string): Promise<ProjectCreateResponse> {
    const formData = new FormData();
    formData.append('file', file);
    if (userDescription) {
      formData.append('description', userDescription);
    }

    const response = await apiClient.post('/projects', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  /**
   * Générer la visualisation végétalisée
   */
  async generate(projectId: string, location: string = 'France'): Promise<ProjectGenerateResponse> {
    const response = await apiClient.post(`/projects/${projectId}/generate`, {
      location,
    });

    return response.data;
  },

  /**
   * Récupérer un projet par ID
   */
  async get(projectId: string): Promise<ProjectGetResponse> {
    const response = await apiClient.get(`/projects/${projectId}`);
    return response.data;
  },

  /**
   * Débloquer avec email
   */
  async unlock(projectId: string, email: string): Promise<ProjectUnlockResponse> {
    const response = await apiClient.post(`/projects/${projectId}/unlock`, {
      email,
    });

    return response.data;
  },

  /**
   * Tracker une action (calendly, pdf)
   */
  async track(projectId: string, action: 'calendly' | 'pdf'): Promise<void> {
    await apiClient.post(`/projects/${projectId}/track`, {
      action,
    });
  },
};
