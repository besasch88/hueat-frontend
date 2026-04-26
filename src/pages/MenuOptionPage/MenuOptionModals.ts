import { MenuOption } from '@entities/menuOption';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';

export function useModals() {
  const useNewMenuOption = () => {
    const [isOpen, { open, close }] = useDisclosure(false);
    return { isOpen, open, close };
  };

  const useEditMenuOption = () => {
    const [isOpen, { open, close }] = useDisclosure(false);
    const [menuOption, setMenuOption] = useState<MenuOption | null>(null);
    const openWith = (item: MenuOption) => {
      setMenuOption(item);
      open();
    };
    const closeModal = () => {
      setMenuOption(null);
      close();
    };
    return { isOpen, menuOption, open: openWith, close: closeModal };
  };

  const useDeleteMenuOption = () => {
    const [isOpen, { open, close }] = useDisclosure(false);
    const [menuOption, setMenuOption] = useState<MenuOption | null>(null);
    const openWith = (item: MenuOption) => {
      setMenuOption(item);
      open();
    };
    const closeModal = () => {
      setMenuOption(null);
      close();
    };
    return { isOpen, menuOption, open: openWith, close: closeModal };
  };

  return {
    newMenuOption: useNewMenuOption(),
    editMenuOption: useEditMenuOption(),
    deleteMenuOption: useDeleteMenuOption(),
  };
}
