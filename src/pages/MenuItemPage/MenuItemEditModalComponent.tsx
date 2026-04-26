import { SwitchOnOff } from '@components/SwitchOnOff/SwitchOnOff';
import { MenuItem } from '@entities/menuItem';
import { Printer } from '@entities/printer';
import { Button, Group, Modal, NumberInput, Paper, Select, Stack, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { menuItemService } from '@services/menuItemService';
import { printerService } from '@services/printerService';
import {
  IconCurrencyEuro,
  IconDeviceFloppy,
  IconDoorExit,
  IconEye,
  IconLayout2,
  IconPrinter,
} from '@tabler/icons-react';
import { getErrorMessage } from '@utils/errUtils';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export interface MenuItemEditModalComponentProps {
  isOpen: boolean;
  menuItem: MenuItem | null;
  onClose: () => void;
  onUpdated: (menuItem: MenuItem) => void;
}

export function MenuItemEditModalComponent({ isOpen, menuItem, onClose, onUpdated }: MenuItemEditModalComponentProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [apiLoading, setApiLoading] = useState(false);
  const [printers, setPrinters] = useState<Printer[]>([]);

  const form = useForm({
    initialValues: {
      title: '',
      titleDisplay: '',
      price: '' as number | string,
      inside: false,
      printerInsideId: '',
      outside: false,
      printerOutsideId: '',
    },
    validate: {
      title: (value: string) => (value.trim().length !== 0 ? null : t('fieldIsRequired')),
      titleDisplay: (value: string) => (value.trim().length !== 0 ? null : t('fieldIsRequired')),
      printerInsideId: (value, values) => (values.inside && !value ? t('fieldIsRequired') : null),
      printerOutsideId: (value, values) => (values.outside && !value ? t('fieldIsRequired') : null),
    },
  });

  useEffect(() => {
    if (!isOpen) return;
    printerService
      .listPrinters()
      .then((data) => setPrinters(data.items))
      .catch(console.error);
  }, [isOpen]);

  useEffect(() => {
    if (menuItem) {
      form.setValues({
        title: menuItem.title,
        titleDisplay: menuItem.titleDisplay,
        price: (menuItem.price / 100).toString(),
        inside: menuItem.inside,
        printerInsideId: menuItem.printerInsideId ?? '',
        outside: menuItem.outside,
        printerOutsideId: menuItem.printerOutsideId ?? '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuItem]);

  const onModalClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit = async (values: typeof form.values) => {
    if (!menuItem) return;
    try {
      setApiLoading(true);
      const data = await menuItemService.updateMenuItem({
        id: menuItem.id,
        title: values.title.trim(),
        titleDisplay: values.titleDisplay.trim(),
        price: +values.price * 100,
        inside: values.inside,
        printerInsideId: values.inside ? values.printerInsideId || null : null,
        outside: values.outside,
        printerOutsideId: values.outside ? values.printerOutsideId || null : null,
      });
      form.reset();
      onUpdated(data.item);
    } catch (err: unknown) {
      switch (getErrorMessage(err)) {
        case 'refresh-token-failed':
          navigate('/logout', { replace: true });
          break;
        default:
          navigate('/internal-server-error', { replace: true });
          break;
      }
    } finally {
      setApiLoading(false);
    }
  };

  const printerData = printers.map((p) => ({ value: p.id, label: p.title, disabled: !p.active }));

  return (
    <Modal centered withCloseButton title={t('menuItemEditTitle')} opened={isOpen} onClose={onModalClose}>
      {isOpen && (
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            size="lg"
            autoFocus
            autoComplete="off"
            withAsterisk
            disabled={apiLoading}
            leftSection={<IconPrinter size={22} />}
            placeholder={t('menuItemInsertTitle')}
            key={form.key('title')}
            {...form.getInputProps('title')}
            onChange={(e) => form.setFieldValue('title', e.currentTarget.value.toUpperCase())}
            mt="md"
          />
          <TextInput
            size="lg"
            autoComplete="off"
            withAsterisk
            disabled={apiLoading}
            leftSection={<IconEye size={22} />}
            placeholder={t('menuItemInsertTitleDisplay')}
            key={form.key('titleDisplay')}
            {...form.getInputProps('titleDisplay')}
            onChange={(e) => form.setFieldValue('titleDisplay', e.currentTarget.value.toUpperCase())}
            mt="md"
          />
          {menuItem && (menuItem.options?.length ?? 0) === 0 && (
            <NumberInput
              size="lg"
              autoComplete="off"
              disabled={apiLoading}
              leftSection={<IconCurrencyEuro size={22} />}
              placeholder={t('menuItemInsertPrice')}
              decimalSeparator=","
              decimalScale={2}
              fixedDecimalScale
              inputMode="decimal"
              key={form.key('price')}
              {...form.getInputProps('price')}
              onChange={(value) => form.setFieldValue('price', value.toString())}
              mt="md"
            />
          )}
          <Stack gap="sm" mt="lg" mb="lg">
            <Paper
              withBorder
              p="md"
              radius="md"
              style={{
                borderColor: form.values.inside ? 'var(--mantine-primary-color-6)' : undefined,
                backgroundColor: form.values.inside ? 'var(--mantine-primary-color-0)' : undefined,
              }}
            >
              <Group justify="space-between" align="center">
                <Group gap="sm">
                  <IconLayout2 size={22} color="var(--mantine-primary-color-6)" />
                  <Text size="md" fw={500}>
                    {t('menuItemInsideLabel')}
                  </Text>
                </Group>
                <SwitchOnOff
                  reference="inside"
                  checked={form.values.inside}
                  readOnly={apiLoading}
                  onChange={(_, checked) => {
                    form.setFieldValue('inside', checked);
                    if (!checked) form.setFieldValue('printerInsideId', '');
                  }}
                />
              </Group>
              {form.values.inside && (
                <Select
                  size="lg"
                  disabled={apiLoading}
                  placeholder={t('menuItemInsidePrinterPlaceholder')}
                  data={printerData}
                  key={form.key('printerInsideId')}
                  {...form.getInputProps('printerInsideId')}
                  onChange={(value) => form.setFieldValue('printerInsideId', value ?? '')}
                  comboboxProps={{ withinPortal: true, zIndex: 400 }}
                  mt="sm"
                />
              )}
            </Paper>
            <Paper
              withBorder
              p="md"
              radius="md"
              style={{
                borderColor: form.values.outside ? 'var(--mantine-primary-color-6)' : undefined,
                backgroundColor: form.values.outside ? 'var(--mantine-primary-color-0)' : undefined,
              }}
            >
              <Group justify="space-between" align="center">
                <Group gap="sm">
                  <IconDoorExit size={22} color="var(--mantine-primary-color-6)" />
                  <Text size="md" fw={500}>
                    {t('menuItemOutsideLabel')}
                  </Text>
                </Group>
                <SwitchOnOff
                  reference="outside"
                  checked={form.values.outside}
                  readOnly={apiLoading}
                  onChange={(_, checked) => {
                    form.setFieldValue('outside', checked);
                    if (!checked) form.setFieldValue('printerOutsideId', '');
                  }}
                />
              </Group>
              {form.values.outside && (
                <Select
                  size="lg"
                  disabled={apiLoading}
                  placeholder={t('menuItemOutsidePrinterPlaceholder')}
                  data={printerData}
                  key={form.key('printerOutsideId')}
                  {...form.getInputProps('printerOutsideId')}
                  onChange={(value) => form.setFieldValue('printerOutsideId', value ?? '')}
                  comboboxProps={{ withinPortal: true, zIndex: 400 }}
                  mt="sm"
                />
              )}
            </Paper>
          </Stack>
          <Button
            type="submit"
            size="lg"
            fullWidth
            loading={apiLoading}
            loaderProps={{ type: 'dots' }}
            leftSection={<IconDeviceFloppy size={28} />}
          >
            {t('printerSave')}
          </Button>
        </form>
      )}
    </Modal>
  );
}
