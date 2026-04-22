import { Table } from '@entities/table';
import { Target } from './targetDto';

export type ListTableInputDto = {
  target: Target;
  includeClosed?: boolean;
};

export type ListTableOutputDto = {
  totalCount: number;
  items: Table[];
};

export type GetTableInputDto = {
  id: string;
};

export type GetTableOutputDto = {
  item: Table;
};

export type CreateTableInputDto = {
  inside: boolean;
  name: string;
};

export type CreateTableOutputDto = {
  item: Table;
};

export type DeleteTableInputDto = {
  id: string;
};

export type DeleteTableOutputDto = {
  success: boolean;
};

export type UpdateTableInputDto = {
  id: string;
  name?: string;
  close?: boolean;
  paymentMethod?: string;
};

export type UpdateTableOutputDto = {
  item: Table;
};
