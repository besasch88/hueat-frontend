import {
  ListMenuCategoryOutputDto,
  CreateMenuCategoryInputDto,
  CreateMenuCategoryOutputDto,
  DeleteMenuCategoryInputDto,
  DeleteMenuCategoryOutputDto,
  UpdateMenuCategoryInputDto,
  UpdateMenuCategoryOutputDto,
  GetMenuCategoryInputDto,
  GetMenuCategoryOutputDto,
} from '@dtos/menuCategoryDto';
import { Method } from './api.type';
import { callAuthApi } from './authApi';

export const menuCategoryService = {
  async listMenuCategories(): Promise<ListMenuCategoryOutputDto> {
    const response = await callAuthApi(`/api/v1/menu/categories`, Method.GET);
    if (!response) {
      throw new Error('menu-category-list-failed');
    }
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors[0]);
    }
    const data = await response.json();
    return data;
  },

  async getMenuCategory(input: GetMenuCategoryInputDto): Promise<GetMenuCategoryOutputDto> {
    const response = await callAuthApi(`/api/v1/menu/categories/${input.id}`, Method.GET);
    if (!response) {
      throw new Error('menu-category-get-failed');
    }
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors[0]);
    }
    const data = await response.json();
    return data;
  },

  async createMenuCategory(input: CreateMenuCategoryInputDto): Promise<CreateMenuCategoryOutputDto> {
    const response = await callAuthApi(`/api/v1/menu/categories`, Method.POST, input);
    if (!response) {
      throw new Error('menu-category-create-failed');
    }
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors[0]);
    }
    const data = await response.json();
    return data;
  },

  async deleteMenuCategory(input: DeleteMenuCategoryInputDto): Promise<DeleteMenuCategoryOutputDto> {
    const response = await callAuthApi(`/api/v1/menu/categories/${input.id}`, Method.DELETE);
    if (!response) {
      throw new Error('menu-category-delete-failed');
    }
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors[0]);
    }
    return { success: true };
  },

  async updateMenuCategory(input: UpdateMenuCategoryInputDto): Promise<UpdateMenuCategoryOutputDto> {
    const { id, ...rest } = input;
    const response = await callAuthApi(`/api/v1/menu/categories/${id}`, Method.PUT, {
      ...rest,
    });
    if (!response) {
      throw new Error('menu-category-update-failed');
    }
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors[0]);
    }
    const data = await response.json();
    return data;
  },
};
