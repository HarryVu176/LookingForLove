import apiService from './api';
import { IMatch, IMatchResult } from '../types/match';

interface IMatchesResponse {
  success: boolean;
  matches: IMatchResult[];
  message?: string;
}

interface IMatchResponse {
  success: boolean;
  match: IMatch;
  message?: string;
}

export class MatchService {
  public async getMatches(): Promise<IMatchesResponse> {
    try {
      const response = await apiService.get<IMatchesResponse>('/matches');
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get matches');
    }
  }

  public async exposeContactInfo(matchedUserId: string): Promise<IMatchResponse> {
    try {
      const response = await apiService.post<IMatchResponse>(`/matches/${matchedUserId}/contact`);
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to expose contact information');
    }
  }

  public async rateMatch(matchedUserId: string, rating: number): Promise<IMatchResponse> {
    try {
      const response = await apiService.post<IMatchResponse>(`/matches/${matchedUserId}/rate`, {
        rating
      });
      return response;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to rate match');
    }
  }
}

export default new MatchService();
