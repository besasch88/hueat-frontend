import { MenuButton } from '@components/MenuButton/MenuButton';
import { SwitchOnOff } from '@components/SwitchOnOff/SwitchOnOff';
import { useAuth } from '@context/AuthContext';
import { MenuItem } from '@entities/menuItem';
import { ActionIcon, Group, Menu } from '@mantine/core';
import {
  IconArrowDown,
  IconArrowUp,
  IconDoorExit,
  IconDots,
  IconEdit,
  IconLayout2,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export interface MenuItemComponentProps {
  menuItem: MenuItem;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onClick: (id: string) => void;
  onMenuItemUp: (id: string) => void;
  onMenuItemDown: (id: string) => void;
  onMenuItemUpdate: (id: string, title: string, price: number) => void;
  onMenuItemDelete: (id: string) => void;
  onSwitch: (menuItem: MenuItem, checked: boolean) => void;
}

export function MenuItemComponent({
  menuItem,
  canMoveUp,
  canMoveDown,
  onClick,
  onMenuItemUp,
  onMenuItemDown,
  onMenuItemUpdate,
  onMenuItemDelete,
  onSwitch,
}: MenuItemComponentProps) {
  // Services
  const auth = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Handlers
  const onClickHandler = (menuItem: MenuItem) => {
    onClick(menuItem.id);
  };
  const onMenuAddOptionClickHandler = () => {
    navigate('/menu/items/' + menuItem.id);
  };

  // Content
  const isReadOnly = !auth.hasPermissionTo('write-menu');
  const price = (menuItem.price / 100).toFixed(2);
  const isOnlyOutside = menuItem.outside && !menuItem.inside;
  const isOnlyInside = !menuItem.outside && menuItem.inside;
  const btnText = menuItem.price > 0 ? `${menuItem.title} (${price}€)` : menuItem.title;

  let menuButtonIcon;
  if (isOnlyOutside) {
    menuButtonIcon = <IconDoorExit color="var(--mantine-primary-color-5)"></IconDoorExit>;
  } else if (isOnlyInside) {
    menuButtonIcon = <IconLayout2 color="var(--mantine-primary-color-5)"></IconLayout2>;
  }

  return (
    <Group wrap="nowrap" gap={6}>
      <MenuButton
        reference={menuItem}
        rightSection={menuButtonIcon}
        clickable={menuItem.price == 0}
        text={btnText}
        onClick={onClickHandler}
      ></MenuButton>
      <SwitchOnOff readOnly={isReadOnly} reference={menuItem} checked={menuItem.active} onChange={onSwitch} />
      {!isReadOnly && (
        <Menu>
          <Menu.Target>
            <ActionIcon variant="outline">
              <IconDots stroke={1.5} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            {canMoveUp && (
              <Menu.Item leftSection={<IconArrowUp size={14} />} onClick={() => onMenuItemUp(menuItem.id)}>
                {t('menuMoveUp')}
              </Menu.Item>
            )}
            {canMoveDown && (
              <Menu.Item leftSection={<IconArrowDown size={14} />} onClick={() => onMenuItemDown(menuItem.id)}>
                {t('menuMoveDown')}
              </Menu.Item>
            )}
            <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => onMenuItemUpdate(menuItem.id, '', 0)}>
              {t('menuEdit')}
            </Menu.Item>
            <Menu.Item leftSection={<IconPlus size={14} />} onClick={onMenuAddOptionClickHandler}>
              {t('menuAddOption')}
            </Menu.Item>
            <Menu.Item leftSection={<IconTrash size={14} color="red" />} onClick={() => onMenuItemDelete(menuItem.id)}>
              {t('menuDelete')}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      )}
    </Group>
  );
}
