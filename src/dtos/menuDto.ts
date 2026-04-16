import { Menu } from '@entities/menu';

export type GetMenuInputDto = {
  tableID: string;
};

export type GetMenuOutputDto = {
  item: Menu;
};
