import { MenuButton } from '@components/MenuButton/MenuButton';
import { SwitchOnOff } from '@components/SwitchOnOff/SwitchOnOff';
import { useAuth } from '@context/AuthContext';
import { MenuItem } from '@entities/menuItem';
import { MenuOption } from '@entities/menuOption';
import { ActionIcon, Badge, Group, Menu } from '@mantine/core';
import { IconArrowDown, IconArrowUp, IconDots, IconEdit, IconTrash } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

export interface MenuOptionComponentProps {
  menuItem: MenuItem;
  menuOption: MenuOption;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onSwitch: (menuOption: MenuOption, newValue: boolean) => void;
  onMenuOptionUp: (menuOption: MenuOption) => void;
  onMenuOptionDown: (menuOption: MenuOption) => void;
  onMenuOptionUpdate: (menuOption: MenuOption) => void;
  onMenuOptionDelete: (menuOption: MenuOption) => void;
}

export function MenuOptionComponent({
  menuItem,
  menuOption,
  canMoveUp,
  canMoveDown,
  onSwitch,
  onMenuOptionUp,
  onMenuOptionDown,
  onMenuOptionUpdate,
  onMenuOptionDelete,
}: MenuOptionComponentProps) {
  const auth = useAuth();
  const { t } = useTranslation();

  const isReadOnly = !auth.hasPermissionTo('write-menu');
  const price = (menuOption.price / 100).toFixed(2);
  let btnText = menuOption.title;
  if (menuOption.title !== menuItem.title && menuOption.title.startsWith(menuItem.title)) {
    btnText = menuOption.title.slice(menuItem.title.length).trim();
  }
  btnText = `${btnText} (${price}€)`;

  const channelBadges =
    menuOption.inside || menuOption.outside ? (
      <Group gap={4} wrap="nowrap">
        {menuOption.inside && (
          <Badge size="xs" variant="light" color="violet" circle>
            {t('channelInsideShort')}
          </Badge>
        )}
        {menuOption.outside && (
          <Badge size="xs" variant="light" color="orange" circle>
            {t('channelOutsideShort')}
          </Badge>
        )}
      </Group>
    ) : undefined;

  return (
    <Group wrap="nowrap" gap={6}>
      <MenuButton reference={menuOption} rightSection={channelBadges} clickable={false} text={btnText} />
      <SwitchOnOff
        readOnly={isReadOnly}
        reference={menuOption}
        checked={menuOption.active}
        onChange={(reference, checked) => onSwitch(reference, checked)}
      />
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
              <Menu.Item leftSection={<IconArrowUp size={16} />} onClick={() => onMenuOptionUp(menuOption)}>
                {t('menuMoveUp')}
              </Menu.Item>
            )}
            {canMoveDown && (
              <Menu.Item leftSection={<IconArrowDown size={16} />} onClick={() => onMenuOptionDown(menuOption)}>
                {t('menuMoveDown')}
              </Menu.Item>
            )}
            <Menu.Item leftSection={<IconEdit size={16} />} onClick={() => onMenuOptionUpdate(menuOption)}>
              {t('menuEdit')}
            </Menu.Item>
            <Menu.Item leftSection={<IconTrash size={16} color="red" />} onClick={() => onMenuOptionDelete(menuOption)}>
              {t('menuDelete')}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      )}
    </Group>
  );
}
