import apiService from './api';
import { IStatistics, IMatchQualityStatistics } from '../types/statistics';

interface IStatisticsResponse {
  success: boolean;
  statistics: IStatistics;
  message?: string;
}

interface IMatchQualityResponse {
  success: boolean;
  statistics: IMatchQualityStatistics;
  message?: string;
}

export class StatisticsService {
  public async getStatistics(): Promise<IStatisticsResponse> {
    try {
      const response = await apiService.get<IStatisticsResponse>('/statistics');
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get statistics');
    }
  }

  public async updateStatistics(): Promise<IStatisticsResponse> {
    try {
      const response = await apiService.post<IStatisticsResponse>('/statistics/update');
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update statistics');
    }
  }

  public async getMatchQualityStatistics(): Promise<IMatchQualityResponse> {
    try {
      const response = await apiService.get<IMatchQualityResponse>('/statistics/match-quality');
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get match quality statistics');
    }
  }
}

export default new StatisticsService();
