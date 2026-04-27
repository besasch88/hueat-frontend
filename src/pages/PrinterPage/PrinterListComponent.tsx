import { MenuButton } from '@components/MenuButton/MenuButton';
import { SwitchOnOff } from '@components/SwitchOnOff/SwitchOnOff';
import { useAuth } from '@context/AuthContext';
import { Printer } from '@entities/printer';
import { ActionIcon, Group, Menu } from '@mantine/core';
import { IconDots, IconEdit, IconTrash } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

export interface PrinterListComponentProps {
  printer: Printer;
  onSwitch: (printer: Printer, checked: boolean) => void;
  onEdit: (printer: Printer) => void;
  onDelete: (printer: Printer) => void;
}

export function PrinterListComponent({ printer, onSwitch, onEdit, onDelete }: PrinterListComponentProps) {
  const auth = useAuth();
  const { t } = useTranslation();

  const isReadOnly = !auth.hasPermissionTo('write-printer');

  return (
    <Group wrap="nowrap" gap={6}>
      <MenuButton clickable={false} reference={printer} text={printer.title} />
      <SwitchOnOff readOnly={isReadOnly} reference={printer} checked={printer.active} onChange={onSwitch} />
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
            <Menu.Item leftSection={<IconEdit size={16} />} onClick={() => onEdit(printer)}>
              {t('menuEdit')}
            </Menu.Item>
            <Menu.Item leftSection={<IconTrash size={16} color="red" />} onClick={() => onDelete(printer)}>
              {t('menuDelete')}
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      )}
    </Group>
  );
}
