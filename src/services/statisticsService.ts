import { GetStatisticsOutputDto } from '@dtos/statisticsDto';
import { Method } from './api.type';
import { callAuthApi } from './authApi';

export const statisticsService = {
  async getStatistics(): Promise<GetStatisticsOutputDto> {
    const response = await callAuthApi(`/api/v1/statistics`, Method.GET);
    if (!response) {
      throw new Error('statistics-get-failed');
    }
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors[0]);
    }
    const data = await response.json();
    return data;
  },
  async deleteStatistics(): Promise<void> {
    const response = await callAuthApi(`/api/v1/statistics`, Method.DELETE);
    if (!response) {
      throw new Error('statistics-delete-failed');
    }
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors[0]);
    }
  },
};
