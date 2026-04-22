import { MenuButton } from '@components/MenuButton/MenuButton';
import { SwitchOnOff } from '@components/SwitchOnOff/SwitchOnOff';
import { useAuth } from '@context/AuthContext';
import { MenuItem } from '@entities/menuItem';
import { MenuOption } from '@entities/menuOption';
import { ActionIcon, Group, Menu } from '@mantine/core';
import { IconArrowDown, IconArrowUp, IconBasket, IconDots, IconEdit, IconTrash } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

export interface MenuOptionComponentProps {
  menuItem: MenuItem;
  menuOption: MenuOption;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onSwitch: (menuOption: MenuOption, newValue: boolean) => void;
}

export function MenuOptionComponent({
  menuItem,
  menuOption,
  canMoveUp,
  canMoveDown,
  onSwitch,
}: MenuOptionComponentProps) {
  // Services
  const auth = useAuth();
  const { t } = useTranslation();

  // Utilities
  const isReadOnly = !auth.hasPermissionTo('write-menu');
  const price = (menuOption.price / 100).toFixed(2);
  const isOnlyOutside = menuOption.outside && !menuOption.inside;
  let btnText = menuOption.title;
  if (menuOption.title !== menuItem.title && menuOption.title.startsWith(menuItem.title)) {
    btnText = menuOption.title.slice(menuItem.title.length).trim();
  }
  btnText = `${btnText} (${price}€)`;

  // Content
  return (
    <Group wrap="nowrap" gap={6}>
      <MenuButton
        reference={menuItem}
        rightSection={isOnlyOutside && <IconBasket color="var(--mantine-primary-color-6)"></IconBasket>}
        clickable={false}
        text={btnText}
      ></MenuButton>
      <SwitchOnOff
        readOnly={isReadOnly}
        reference={menuOption}
        checked={menuOption.active}
        onChange={(reference, checked) => {
          onSwitch(reference, checked);
        }}
      />
      {!isReadOnly && (
        <Menu>
          <Menu.Target>
            <ActionIcon variant="outline">
              <IconDots stroke={1.5} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            {canMoveUp && (
              <Menu.Item leftSection={<IconArrowUp size={14} />} onClick={() => alert('DA IMPLEMENTARE')}>
                {t('menuMoveUp')}
              </Menu.Item>
            )}
            {canMoveDown && (
              <Menu.Item leftSection={<IconArrowDown size={14} />} onClick={() => alert('DA IMPLEMENTARE')}>
                {t('menuMoveDown')}
              </Menu.Item>
            )}
            <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => alert('DA IMPLEMENTARE')}>
              {t('menuEdit')}
            </Menu.Item>
            <Menu.Item leftSection={<IconTrash size={14} color="red" />} onClick={() => alert('DA IMPLEMENTARE')}>
              {t('menuDelete')}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      )}
    </Group>
  );
}
