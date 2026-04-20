import { MenuItem } from './menuItem';

export type MenuCategory = {
  id: string;
  title: string;
  titleDisplay: string;
  position: number;
  active: boolean;
  inside: boolean;
  outside: boolean;
  printerId: string | null;
  createdAt: string;
  updatedAt: string;
  items: MenuItem[];
};
