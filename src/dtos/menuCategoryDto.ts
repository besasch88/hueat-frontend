import { MenuCategory } from '@entities/menuCategory';

export type ListMenuCategoryOutputDto = {
  totalCount: number;
  items: MenuCategory[];
};

export type GetMenuCategoryInputDto = {
  id: string;
};

export type GetMenuCategoryOutputDto = {
  item: MenuCategory;
};

export type CreateMenuCategoryInputDto = {
  title: string;
  titleDisplay: string;
};

export type CreateMenuCategoryOutputDto = {
  item: MenuCategory;
};

export type DeleteMenuCategoryInputDto = {
  id: string;
};

export type DeleteMenuCategoryOutputDto = {
  success: boolean;
};

export type UpdateMenuCategoryInputDto = {
  id: string;
  title?: string;
  titleDisplay?: string;
  active?: boolean;
  inside?: boolean;
  outside?: boolean;
  position?: number;
  printerId?: string;
};

export type UpdateMenuCategoryOutputDto = {
  item: MenuCategory;
};
