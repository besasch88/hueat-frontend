import { MenuItem } from '@entities/menuItem';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';

export function useModals() {
  const useNewMenuItem = () => {
    const [isOpen, { open, close }] = useDisclosure(false);
    return { isOpen, open, close };
  };

  const useEditMenuItem = () => {
    const [isOpen, { open, close }] = useDisclosure(false);
    const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
    const openWith = (item: MenuItem) => {
      setMenuItem(item);
      open();
    };
    const closeModal = () => {
      setMenuItem(null);
      close();
    };
    return { isOpen, menuItem, open: openWith, close: closeModal };
  };

  const useDeleteMenuItem = () => {
    const [isOpen, { open, close }] = useDisclosure(false);
    const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
    const openWith = (item: MenuItem) => {
      setMenuItem(item);
      open();
    };
    const closeModal = () => {
      setMenuItem(null);
      close();
    };
    return { isOpen, menuItem, open: openWith, close: closeModal };
  };

  return {
    newMenuItem: useNewMenuItem(),
    editMenuItem: useEditMenuItem(),
    deleteMenuItem: useDeleteMenuItem(),
  };
}
