import { MenuOption } from '@entities/menuOption';

export type ListMenuOptionInputDto = {
  menuItemId: string;
};

export type ListMenuOptionOutputDto = {
  totalCount: number;
  items: MenuOption[];
};

export type GetMenuOptionInputDto = {
  id: string;
};

export type GetMenuOptionOutputDto = {
  item: MenuOption;
};

export type CreateMenuOptionInputDto = {
  menuItemId: string;
  title: string;
  titleDisplay: string;
  price: number;
};

export type CreateMenuOptionOutputDto = {
  item: MenuOption;
};

export type DeleteMenuOptionInputDto = {
  id: string;
};

export type DeleteMenuOptionOutputDto = {
  success: boolean;
};

export type UpdateMenuOptionInputDto = {
  id: string;
  title?: string;
  titleDisplay?: string;
  active?: boolean;
  inside?: boolean;
  outside?: boolean;
  position?: number;
  price?: number;
};

export type UpdateMenuOptionOutputDto = {
  item: MenuOption;
};
