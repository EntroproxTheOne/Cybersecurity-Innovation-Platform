import api from './authService';
import { Threat, ThreatFilters, PaginatedResponse, ThreatFormData } from '../types';

export const threatService = {
  async getThreats(filters: ThreatFilters = {}): Promise<PaginatedResponse<Threat>> {
    const response = await api.get('/threats', { params: filters });
    return response.data;
  },

  async getThreatById(id: string): Promise<Threat> {
    const response = await api.get(`/threats/${id}`);
    return response.data;
  },

  async createThreat(data: ThreatFormData): Promise<Threat> {
    const response = await api.post('/threats', data);
    return response.data.threat;
  },

  async updateThreat(id: string, data: Partial<ThreatFormData>): Promise<Threat> {
    const response = await api.put(`/threats/${id}`, data);
    return response.data.threat;
  },

  async deleteThreat(id: string): Promise<void> {
    await api.delete(`/threats/${id}`);
  },

  async getThreatStats(filters: { startDate?: string; endDate?: string } = {}): Promise<any> {
    const response = await api.get('/threats/stats/overview', { params: filters });
    return response.data;
  },

  async searchThreats(query: string): Promise<Threat[]> {
    const response = await api.get('/threats', { 
      params: { search: query, limit: 50 } 
    });
    return response.data.threats;
  },

  async getThreatsBySeverity(severity: string): Promise<Threat[]> {
    const response = await api.get('/threats', { 
      params: { severity, limit: 100 } 
    });
    return response.data.threats;
  },

  async getActiveThreats(): Promise<Threat[]> {
    const response = await api.get('/threats', { 
      params: { status: 'active', limit: 100 } 
    });
    return response.data.threats;
  },

  async resolveThreat(id: string, resolution: string): Promise<Threat> {
    const response = await api.put(`/threats/${id}`, {
      status: 'resolved',
      resolution,
    });
    return response.data.threat;
  },

  async escalateThreat(id: string, reason: string, escalatedTo: string): Promise<Threat> {
    const response = await api.put(`/threats/${id}`, {
      escalation: {
        escalated: true,
        escalatedAt: new Date().toISOString(),
        escalatedTo,
        reason,
      },
    });
    return response.data.threat;
  },

  async addThreatNote(id: string, note: string): Promise<Threat> {
    const response = await api.put(`/threats/${id}`, {
      notes: note,
    });
    return response.data.threat;
  },

  async addThreatTag(id: string, tag: string): Promise<Threat> {
    const response = await api.put(`/threats/${id}`, {
      $push: { tags: tag },
    });
    return response.data.threat;
  },

  async removeThreatTag(id: string, tag: string): Promise<Threat> {
    const response = await api.put(`/threats/${id}`, {
      $pull: { tags: tag },
    });
    return response.data.threat;
  },
};
