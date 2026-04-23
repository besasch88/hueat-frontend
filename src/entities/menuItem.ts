import { MenuOption } from './menuOption';

export type MenuItem = {
  id: string;
  menuCategoryId: string;
  title: string;
  titleDisplay: string;
  position: number;
  active: boolean;
  inside: boolean;
  outside: boolean;
  mandatoryForInside: boolean;
  mandatoryForOutside: boolean;
  price: number;
  createdAt: string;
  updatedAt: string;
  options: MenuOption[];
};
