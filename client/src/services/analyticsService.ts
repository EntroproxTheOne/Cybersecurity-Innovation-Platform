import api from './authService';
import { DashboardStats } from '../types';

export const analyticsService = {
  async getDashboardStats(filters: { startDate?: string; endDate?: string } = {}): Promise<DashboardStats> {
    const response = await api.get('/analytics/dashboard', { params: filters });
    return response.data;
  },

  async getThreatTimeline(filters: {
    startDate?: string;
    endDate?: string;
    granularity?: 'hour' | 'day' | 'week' | 'month';
  } = {}): Promise<any> {
    const response = await api.get('/analytics/threats/timeline', { params: filters });
    return response.data;
  },

  async getGeographicData(filters: { startDate?: string; endDate?: string } = {}): Promise<any> {
    const response = await api.get('/analytics/geographic', { params: filters });
    return response.data;
  },

  async getPerformanceMetrics(filters: { startDate?: string; endDate?: string } = {}): Promise<any> {
    const response = await api.get('/analytics/performance', { params: filters });
    return response.data;
  },

  async getThreatTrends(days: number = 30): Promise<any> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const response = await api.get('/analytics/threats/timeline', {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        granularity: 'day',
      },
    });
    return response.data;
  },

  async getSeverityDistribution(filters: { startDate?: string; endDate?: string } = {}): Promise<any> {
    const response = await api.get('/analytics/dashboard', { params: filters });
    return response.data.trends.severityDistribution;
  },

  async getTypeDistribution(filters: { startDate?: string; endDate?: string } = {}): Promise<any> {
    const response = await api.get('/analytics/dashboard', { params: filters });
    return response.data.trends.typeDistribution;
  },

  async getTopSources(filters: { startDate?: string; endDate?: string } = {}): Promise<any> {
    const response = await api.get('/analytics/dashboard', { params: filters });
    return response.data.trends.topSources;
  },

  async getResponseTimeStats(filters: { startDate?: string; endDate?: string } = {}): Promise<any> {
    const response = await api.get('/analytics/performance', { params: filters });
    return response.data.responseTime;
  },

  async getResolutionRates(filters: { startDate?: string; endDate?: string } = {}): Promise<any> {
    const response = await api.get('/analytics/performance', { params: filters });
    return response.data.resolutionRates;
  },

  async getFalsePositiveRate(filters: { startDate?: string; endDate?: string } = {}): Promise<number> {
    const response = await api.get('/analytics/performance', { params: filters });
    return response.data.falsePositiveRate;
  },
};
