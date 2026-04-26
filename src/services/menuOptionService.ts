import {
  ListMenuOptionInputDto,
  ListMenuOptionOutputDto,
  CreateMenuOptionInputDto,
  CreateMenuOptionOutputDto,
  DeleteMenuOptionInputDto,
  DeleteMenuOptionOutputDto,
  UpdateMenuOptionInputDto,
  UpdateMenuOptionOutputDto,
  GetMenuOptionInputDto,
  GetMenuOptionOutputDto,
} from '@dtos/menuOptionDto';
import { Method } from './api.type';
import { callAuthApi } from './authApi';

export const menuOptionService = {
  async listMenuOptions(input: ListMenuOptionInputDto): Promise<ListMenuOptionOutputDto> {
    const response = await callAuthApi(`/api/v1/menu/items/${input.menuItemId}/options`, Method.GET);
    if (!response) {
      throw new Error('menu-item-option-list-failed');
    }
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors[0]);
    }
    const data = await response.json();
    return data;
  },

  async getMenuOption(input: GetMenuOptionInputDto): Promise<GetMenuOptionOutputDto> {
    const response = await callAuthApi(`/api/v1/menu/options/${input.id}`, Method.GET);
    if (!response) {
      throw new Error('menu-item-option-get-failed');
    }
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors[0]);
    }
    const data = await response.json();
    return data;
  },

  async createMenuOption(input: CreateMenuOptionInputDto): Promise<CreateMenuOptionOutputDto> {
    const response = await callAuthApi(`/api/v1/menu/items/${input.menuItemId}/options`, Method.POST, input);
    if (!response) {
      throw new Error('menu-item-option-create-failed');
    }
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors[0]);
    }
    const data = await response.json();
    return data;
  },

  async deleteMenuOption(input: DeleteMenuOptionInputDto): Promise<DeleteMenuOptionOutputDto> {
    const response = await callAuthApi(`/api/v1/menu/options/${input.id}`, Method.DELETE);
    if (!response) {
      throw new Error('menu-item-option-delete-failed');
    }
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors[0]);
    }
    return { success: true };
  },

  async updateMenuOption(input: UpdateMenuOptionInputDto): Promise<UpdateMenuOptionOutputDto> {
    const { id, ...rest } = input;
    const response = await callAuthApi(`/api/v1/menu/options/${id}`, Method.PUT, {
      ...rest,
    });
    if (!response) {
      throw new Error('menu-item-option-update-failed');
    }
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors[0]);
    }
    const data = await response.json();
    return data;
  },
};
