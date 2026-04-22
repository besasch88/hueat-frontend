import {
  ListMenuItemInputDto,
  ListMenuItemOutputDto,
  CreateMenuItemInputDto,
  CreateMenuItemOutputDto,
  DeleteMenuItemInputDto,
  DeleteMenuItemOutputDto,
  UpdateMenuItemInputDto,
  UpdateMenuItemOutputDto,
  GetMenuItemInputDto,
  GetMenuItemOutputDto,
  CreateMenuCustomItemInputDto,
} from '@dtos/menuItemDto';
import { Method } from './api.type';
import { callAuthApi } from './authApi';

export const menuItemService = {
  async listMenuItems(input: ListMenuItemInputDto): Promise<ListMenuItemOutputDto> {
    const response = await callAuthApi(`/api/v1/menu/categories/${input.menuCategoryId}/items`, Method.GET);
    if (!response) {
      throw new Error('menu-item-list-failed');
    }
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors[0]);
    }
    const data = await response.json();
    return data;
  },

  async getMenuItem(input: GetMenuItemInputDto): Promise<GetMenuItemOutputDto> {
    const response = await callAuthApi(`/api/v1/menu/items/${input.id}`, Method.GET);
    if (!response) {
      throw new Error('menu-item-get-failed');
    }
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors[0]);
    }
    const data = await response.json();
    return data;
  },

  async createMenuItem(input: CreateMenuItemInputDto): Promise<CreateMenuItemOutputDto> {
    const response = await callAuthApi(`/api/v1/menu/categories/${input.menuCategoryId}/items`, Method.POST, input);
    if (!response) {
      throw new Error('menu-item-create-failed');
    }
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors[0]);
    }
    const data = await response.json();
    return data;
  },

  async createMenuCustomItem(input: CreateMenuCustomItemInputDto): Promise<CreateMenuItemOutputDto> {
    const response = await callAuthApi(
      `/api/v1/menu/tables/${input.tableId}/categories/${input.menuCategoryId}/items`,
      Method.POST,
      input
    );
    if (!response) {
      throw new Error('menu-custom-item-create-failed');
    }
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors[0]);
    }
    const data = await response.json();
    return data;
  },

  async deleteMenuItem(input: DeleteMenuItemInputDto): Promise<DeleteMenuItemOutputDto> {
    const response = await callAuthApi(`/api/v1/menu/items/${input.id}`, Method.DELETE);
    if (!response) {
      throw new Error('menu-item-delete-failed');
    }
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors[0]);
    }
    return { success: true };
  },

  async updateMenuItem(input: UpdateMenuItemInputDto): Promise<UpdateMenuItemOutputDto> {
    const { id, ...rest } = input;
    const response = await callAuthApi(`/api/v1/menu/items/${id}`, Method.PUT, {
      ...rest,
    });
    if (!response) {
      throw new Error('menu-item-update-failed');
    }
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors[0]);
    }
    const data = await response.json();
    return data;
  },
};
