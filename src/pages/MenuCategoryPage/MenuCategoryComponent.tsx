import { MenuButton } from '@components/MenuButton/MenuButton';
import { SwitchOnOff } from '@components/SwitchOnOff/SwitchOnOff';
import { useAuth } from '@context/AuthContext';
import { MenuCategory } from '@entities/menuCategory';
import { ActionIcon, Badge, Group, Menu } from '@mantine/core';
import { IconArrowDown, IconArrowUp, IconDots, IconEdit, IconTrash } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

export interface MenuCategoryComponentProps {
  menuCategory: MenuCategory;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onClick: (id: string) => void;
  onMenuCategoryUp: (menuCategory: MenuCategory) => void;
  onMenuCategoryDown: (menuCategory: MenuCategory) => void;
  onMenuCategoryUpdate: (menuCategory: MenuCategory) => void;
  onMenuCategoryDelete: (menuCategory: MenuCategory) => void;
  onSwitch: (menuCategory: MenuCategory, checked: boolean) => void;
}

export function MenuCategoryComponent({
  menuCategory,
  canMoveUp,
  canMoveDown,
  onClick,
  onMenuCategoryUp,
  onMenuCategoryDown,
  onMenuCategoryUpdate,
  onMenuCategoryDelete,
  onSwitch,
}: MenuCategoryComponentProps) {
  const auth = useAuth();
  const { t } = useTranslation();

  const isReadOnly = !auth.hasPermissionTo('write-menu');

  const channelBadges =
    menuCategory.inside || menuCategory.outside ? (
      <Group gap={4} wrap="nowrap">
        {menuCategory.inside && (
          <Badge size="xs" variant="light" color="violet" circle>
            {t('channelInsideShort')}
          </Badge>
        )}
        {menuCategory.outside && (
          <Badge size="xs" variant="light" color="orange" circle>
            {t('channelOutsideShort')}
          </Badge>
        )}
      </Group>
    ) : undefined;

  return (
    <Group wrap="nowrap" gap={6}>
      <MenuButton
        reference={menuCategory}
        rightSection={channelBadges}
        clickable={true}
        text={menuCategory.title}
        onClick={() => onClick(menuCategory.id)}
      />
      <SwitchOnOff readOnly={isReadOnly} reference={menuCategory} checked={menuCategory.active} onChange={onSwitch} />
      {!isReadOnly && (
        <Menu
          shadow="lg"
          width={220}
          position="bottom-end"
          withArrow
          styles={{ item: { fontSize: 15, paddingBlock: 10 } }}
        >
          <Menu.Target>
            <ActionIcon variant="outline">
              <IconDots stroke={1.5} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            {canMoveUp && (
              <Menu.Item leftSection={<IconArrowUp size={16} />} onClick={() => onMenuCategoryUp(menuCategory)}>
                {t('menuMoveUp')}
              </Menu.Item>
            )}
            {canMoveDown && (
              <Menu.Item leftSection={<IconArrowDown size={16} />} onClick={() => onMenuCategoryDown(menuCategory)}>
                {t('menuMoveDown')}
              </Menu.Item>
            )}
            <Menu.Item leftSection={<IconEdit size={16} />} onClick={() => onMenuCategoryUpdate(menuCategory)}>
              {t('menuEdit')}
            </Menu.Item>
            <Menu.Item
              leftSection={<IconTrash size={16} color="red" />}
              onClick={() => onMenuCategoryDelete(menuCategory)}
            >
              {t('menuDelete')}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      )}
    </Group>
  );
}
