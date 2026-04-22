import { Printer } from '@entities/printer';

export type ListPrinterOutputDto = {
  totalCount: number;
  items: Printer[];
};

export type GetPrinterInputDto = {
  id: string;
};

export type GetPrinterOutputDto = {
  item: Printer;
};

export type CreatePrinterInputDto = {
  title: string;
  url: string;
};

export type CreatePrinterOutputDto = {
  item: Printer;
};

export type DeletePrinterInputDto = {
  id: string;
};

export type DeletePrinterOutputDto = {
  success: boolean;
};

export type UpdatePrinterInputDto = {
  id: string;
  title?: string;
  url?: string;
  active?: boolean;
};

export type UpdatePrinterOutputDto = {
  item: Printer;
};
