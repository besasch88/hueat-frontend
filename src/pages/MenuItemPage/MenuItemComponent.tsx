import { MenuButton } from '@components/MenuButton/MenuButton';
import { SwitchOnOff } from '@components/SwitchOnOff/SwitchOnOff';
import { useAuth } from '@context/AuthContext';
import { MenuItem } from '@entities/menuItem';
import { ActionIcon, Badge, Group, Menu } from '@mantine/core';
import { IconArrowDown, IconArrowUp, IconDots, IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export interface MenuItemComponentProps {
  menuItem: MenuItem;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onClick: (id: string) => void;
  onMenuItemUp: (menuItem: MenuItem) => void;
  onMenuItemDown: (menuItem: MenuItem) => void;
  onMenuItemUpdate: (menuItem: MenuItem) => void;
  onMenuItemDelete: (menuItem: MenuItem) => void;
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
  const auth = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const onMenuAddOptionClickHandler = () => {
    navigate('/menu/items/' + menuItem.id, { state: { openNewModal: true } });
  };

  const isReadOnly = !auth.hasPermissionTo('write-menu');
  const price = (menuItem.price / 100).toFixed(2);
  const btnText = menuItem.price > 0 ? `${menuItem.title} (${price}€)` : menuItem.title;

  const channelBadges =
    menuItem.inside || menuItem.outside ? (
      <Group gap={4} wrap="nowrap">
        {menuItem.inside && (
          <Badge size="xs" variant="light" color="violet" circle>
            I
          </Badge>
        )}
        {menuItem.outside && (
          <Badge size="xs" variant="light" color="orange" circle>
            A
          </Badge>
        )}
      </Group>
    ) : undefined;

  return (
    <Group wrap="nowrap" gap={6}>
      <MenuButton
        reference={menuItem}
        rightSection={channelBadges}
        clickable={menuItem.price == 0}
        text={btnText}
        onClick={() => onClick(menuItem.id)}
      />
      <SwitchOnOff readOnly={isReadOnly} reference={menuItem} checked={menuItem.active} onChange={onSwitch} />
      {!isReadOnly && (
        <Menu shadow="lg" width={200} position="bottom-end" withArrow>
          <Menu.Target>
            <ActionIcon variant="outline">
              <IconDots stroke={1.5} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            {canMoveUp && (
              <Menu.Item leftSection={<IconArrowUp size={14} />} onClick={() => onMenuItemUp(menuItem)}>
                {t('menuMoveUp')}
              </Menu.Item>
            )}
            {canMoveDown && (
              <Menu.Item leftSection={<IconArrowDown size={14} />} onClick={() => onMenuItemDown(menuItem)}>
                {t('menuMoveDown')}
              </Menu.Item>
            )}
            <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => onMenuItemUpdate(menuItem)}>
              {t('menuEdit')}
            </Menu.Item>
            <Menu.Item leftSection={<IconPlus size={14} />} onClick={onMenuAddOptionClickHandler}>
              {t('menuAddOption')}
            </Menu.Item>
            <Menu.Item leftSection={<IconTrash size={14} color="red" />} onClick={() => onMenuItemDelete(menuItem)}>
              {t('menuDelete')}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      )}
    </Group>
  );
}
