import { MenuCategory } from '@entities/menuCategory';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';

export function useModals() {
  const useNewMenuCategory = () => {
    const [isOpen, { open, close }] = useDisclosure(false);
    return { isOpen, open, close };
  };

  const useEditMenuCategory = () => {
    const [isOpen, { open, close }] = useDisclosure(false);
    const [menuCategory, setMenuCategory] = useState<MenuCategory | null>(null);
    const openWith = (item: MenuCategory) => {
      setMenuCategory(item);
      open();
    };
    const closeModal = () => {
      setMenuCategory(null);
      close();
    };
    return { isOpen, menuCategory, open: openWith, close: closeModal };
  };

  const useDeleteMenuCategory = () => {
    const [isOpen, { open, close }] = useDisclosure(false);
    const [menuCategory, setMenuCategory] = useState<MenuCategory | null>(null);
    const openWith = (item: MenuCategory) => {
      setMenuCategory(item);
      open();
    };
    const closeModal = () => {
      setMenuCategory(null);
      close();
    };
    return { isOpen, menuCategory, open: openWith, close: closeModal };
  };

  return {
    newMenuCategory: useNewMenuCategory(),
    editMenuCategory: useEditMenuCategory(),
    deleteMenuCategory: useDeleteMenuCategory(),
  };
}
