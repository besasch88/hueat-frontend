import { SwitchOnOff } from '@components/SwitchOnOff/SwitchOnOff';
import { MenuOption } from '@entities/menuOption';
import { ActionIcon, Button, Group, Modal, NumberInput, Paper, Popover, Stack, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { menuOptionService } from '@services/menuOptionService';
import {
  IconBasket,
  IconCurrencyEuro,
  IconDeviceFloppy,
  IconEye,
  IconHelpCircle,
  IconLayout2,
  IconPrinter,
} from '@tabler/icons-react';
import { getErrorMessage } from '@utils/errUtils';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export interface MenuOptionEditModalComponentProps {
  isOpen: boolean;
  menuOption: MenuOption | null;
  onClose: () => void;
  onUpdated: (menuOption: MenuOption) => void;
}

export function MenuOptionEditModalComponent({
  isOpen,
  menuOption,
  onClose,
  onUpdated,
}: MenuOptionEditModalComponentProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [apiLoading, setApiLoading] = useState(false);

  const form = useForm({
    initialValues: {
      title: '',
      titleDisplay: '',
      price: '' as number | string,
      inside: false,
      outside: false,
    },
    validate: {
      title: (value: string) => (value.trim().length !== 0 ? null : t('fieldIsRequired')),
      titleDisplay: (value: string) => (value.trim().length !== 0 ? null : t('fieldIsRequired')),
    },
  });

  useEffect(() => {
    if (menuOption) {
      form.setValues({
        title: menuOption.title,
        titleDisplay: menuOption.titleDisplay,
        price: (menuOption.price / 100).toString(),
        inside: menuOption.inside,
        outside: menuOption.outside,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuOption]);

  const onModalClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit = async (values: typeof form.values) => {
    if (!menuOption) return;
    try {
      setApiLoading(true);
      const data = await menuOptionService.updateMenuOption({
        id: menuOption.id,
        title: values.title.trim(),
        titleDisplay: values.titleDisplay.trim(),
        price: +values.price * 100,
        inside: values.inside,
        outside: values.outside,
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

  return (
    <Modal centered withCloseButton title={t('menuOptionEditTitle')} opened={isOpen} onClose={onModalClose}>
      {isOpen && (
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            size="lg"
            autoFocus
            autoComplete="off"
            withAsterisk
            disabled={apiLoading}
            leftSection={<IconPrinter size={22} />}
            placeholder={t('menuOptionInsertTitle')}
            rightSectionPointerEvents="all"
            rightSection={
              <Popover width={220} position="bottom-end" withArrow shadow="md" zIndex={400}>
                <Popover.Target>
                  <ActionIcon variant="subtle" color="gray" size="sm" tabIndex={-1}>
                    <IconHelpCircle size={16} />
                  </ActionIcon>
                </Popover.Target>
                <Popover.Dropdown>
                  <Text size="sm">{t('titlePrintHint')}</Text>
                </Popover.Dropdown>
              </Popover>
            }
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
            placeholder={t('menuOptionInsertTitleDisplay')}
            rightSectionPointerEvents="all"
            rightSection={
              <Popover width={220} position="bottom-end" withArrow shadow="md" zIndex={400}>
                <Popover.Target>
                  <ActionIcon variant="subtle" color="gray" size="sm" tabIndex={-1}>
                    <IconHelpCircle size={16} />
                  </ActionIcon>
                </Popover.Target>
                <Popover.Dropdown>
                  <Text size="xs">{t('titleDisplayHint')}</Text>
                </Popover.Dropdown>
              </Popover>
            }
            key={form.key('titleDisplay')}
            {...form.getInputProps('titleDisplay')}
            onChange={(e) => form.setFieldValue('titleDisplay', e.currentTarget.value.toUpperCase())}
            mt="md"
          />
          <NumberInput
            size="lg"
            autoComplete="off"
            disabled={apiLoading}
            leftSection={<IconCurrencyEuro size={22} />}
            placeholder={t('menuOptionInsertPrice')}
            decimalSeparator=","
            decimalScale={2}
            fixedDecimalScale
            inputMode="decimal"
            key={form.key('price')}
            {...form.getInputProps('price')}
            onChange={(value) => form.setFieldValue('price', value.toString())}
            mt="md"
          />
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
                    {t('menuOptionInsideLabel')}
                  </Text>
                </Group>
                <SwitchOnOff
                  reference="inside"
                  checked={form.values.inside}
                  readOnly={apiLoading}
                  onChange={(_, checked) => form.setFieldValue('inside', checked)}
                />
              </Group>
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
                  <IconBasket size={22} color="var(--mantine-primary-color-6)" />
                  <Text size="md" fw={500}>
                    {t('menuOptionOutsideLabel')}
                  </Text>
                </Group>
                <SwitchOnOff
                  reference="outside"
                  checked={form.values.outside}
                  readOnly={apiLoading}
                  onChange={(_, checked) => form.setFieldValue('outside', checked)}
                />
              </Group>
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
