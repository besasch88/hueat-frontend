import { Printer } from '@entities/printer';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';

export function useModals() {
  const useNewPrinter = () => {
    const [isOpen, { open, close }] = useDisclosure(false);
    return { isOpen, open, close };
  };

  const useEditPrinter = () => {
    const [isOpen, { open, close }] = useDisclosure(false);
    const [printer, setPrinter] = useState<Printer | null>(null);
    const openWith = (p: Printer) => {
      setPrinter(p);
      open();
    };
    const closeModal = () => {
      setPrinter(null);
      close();
    };
    return { isOpen, printer, open: openWith, close: closeModal };
  };

  const useDeletePrinter = () => {
    const [isOpen, { open, close }] = useDisclosure(false);
    const [printer, setPrinter] = useState<Printer | null>(null);
    const openWith = (p: Printer) => {
      setPrinter(p);
      open();
    };
    const closeModal = () => {
      setPrinter(null);
      close();
    };
    return { isOpen, printer, open: openWith, close: closeModal };
  };

  return {
    newPrinter: useNewPrinter(),
    editPrinter: useEditPrinter(),
    deletePrinter: useDeletePrinter(),
  };
}
