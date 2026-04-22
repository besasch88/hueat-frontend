import {
  ListPrinterOutputDto,
  CreatePrinterInputDto,
  CreatePrinterOutputDto,
  DeletePrinterInputDto,
  DeletePrinterOutputDto,
  UpdatePrinterInputDto,
  UpdatePrinterOutputDto,
  GetPrinterInputDto,
  GetPrinterOutputDto,
} from '@dtos/printerDto';
import { Method } from './api.type';
import { callAuthApi } from './authApi';

export const printerService = {
  async listPrinters(): Promise<ListPrinterOutputDto> {
    const response = await callAuthApi(`/api/v1/printers`, Method.GET);
    if (!response) {
      throw new Error('printer-list-failed');
    }
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors[0]);
    }
    const data = await response.json();
    return data;
  },

  async getPrinter(input: GetPrinterInputDto): Promise<GetPrinterOutputDto> {
    const response = await callAuthApi(`/api/v1/printers/${input.id}`, Method.GET);
    if (!response) {
      throw new Error('printer-get-failed');
    }
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors[0]);
    }
    const data = await response.json();
    return data;
  },

  async createPrinter(input: CreatePrinterInputDto): Promise<CreatePrinterOutputDto> {
    const response = await callAuthApi(`/api/v1/printers`, Method.POST, input);
    if (!response) {
      throw new Error('printer-create-failed');
    }
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors[0]);
    }
    const data = await response.json();
    return data;
  },

  async deletePrinter(input: DeletePrinterInputDto): Promise<DeletePrinterOutputDto> {
    const response = await callAuthApi(`/api/v1/printers/${input.id}`, Method.DELETE);
    if (!response) {
      throw new Error('printer-delete-failed');
    }
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors[0]);
    }
    return { success: true };
  },

  async updatePrinter(input: UpdatePrinterInputDto): Promise<UpdatePrinterOutputDto> {
    const { id, ...rest } = input;
    const response = await callAuthApi(`/api/v1/printers/${id}`, Method.PUT, {
      ...rest,
    });
    if (!response) {
      throw new Error('printer-update-failed');
    }
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors[0]);
    }
    const data = await response.json();
    return data;
  },
};
