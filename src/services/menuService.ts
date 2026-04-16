import { GetMenuInputDto, GetMenuOutputDto } from '@dtos/menuDto';
import { Method } from './api.type';
import { callAuthApi } from './authApi';

export const menuService = {
  async getMenu(input: GetMenuInputDto): Promise<GetMenuOutputDto> {
    const response = await callAuthApi(`/api/v1/tables/${input.tableID}/menu`, Method.GET);
    if (!response) {
      throw new Error('menu-get-failed');
    }
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors[0]);
    }
    const data = await response.json();
    return data;
  },
};
