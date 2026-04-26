import { MenuItem } from '@entities/menuItem';

export type ListMenuItemInputDto = {
  menuCategoryId: string;
};

export type ListMenuItemOutputDto = {
  totalCount: number;
  items: MenuItem[];
};

export type GetMenuItemInputDto = {
  id: string;
};

export type GetMenuItemOutputDto = {
  item: MenuItem;
};

export type CreateMenuItemInputDto = {
  menuCategoryId: string;
  title: string;
  titleDisplay: string;
  price: number;
};

export type CreateMenuCustomItemInputDto = {
  tableId: string;
  menuCategoryId: string;
  title: string;
  titleDisplay: string;
  price: number;
  printerId: string;
};

export type CreateMenuItemOutputDto = {
  item: MenuItem;
};

export type DeleteMenuItemInputDto = {
  id: string;
};

export type DeleteMenuItemOutputDto = {
  success: boolean;
};

export type UpdateMenuItemInputDto = {
  id: string;
  title?: string;
  titleDisplay?: string;
  active?: boolean;
  inside?: boolean;
  outside?: boolean;
  printerInsideId?: string | null;
  printerOutsideId?: string | null;
  position?: number;
  price?: number;
};

export type UpdateMenuItemOutputDto = {
  item: MenuItem;
};
