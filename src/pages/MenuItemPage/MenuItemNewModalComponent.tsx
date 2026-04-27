import { MenuItem } from '@entities/menuItem';
import { ActionIcon, Button, Modal, NumberInput, Popover, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { menuItemService } from '@services/menuItemService';
import { IconCirclePlus, IconCurrencyEuro, IconEye, IconHelpCircle, IconMapPin } from '@tabler/icons-react';
import { getErrorMessage } from '@utils/errUtils';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export interface MenuItemNewModalComponentProps {
  isOpen: boolean;
  menuCategoryId: string;
  onClose: () => void;
  onCreated: (menuItem: MenuItem) => void;
}

export function MenuItemNewModalComponent({
  isOpen,
  menuCategoryId,
  onClose,
  onCreated,
}: MenuItemNewModalComponentProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [apiLoading, setApiLoading] = useState(false);

  const form = useForm({
    initialValues: { title: '', titleDisplay: '', price: '' as number | string },
    validate: {
      title: (value: string) => (value.trim().length !== 0 ? null : t('fieldIsRequired')),
      titleDisplay: (value: string) => (value.trim().length !== 0 ? null : t('fieldIsRequired')),
      price: (value: number | string) => (value !== '' ? null : t('fieldIsRequired')),
    },
  });

  const onPriceChange = (value: number | string) => {
    form.setFieldValue('price', value.toString());
  };

  const onModalClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit = async (values: typeof form.values) => {
    try {
      setApiLoading(true);
      const data = await menuItemService.createMenuItem({
        menuCategoryId,
        title: values.title.trim(),
        titleDisplay: values.titleDisplay.trim(),
        price: +values.price * 100,
      });
      form.reset();
      onCreated(data.item);
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
    <Modal centered withCloseButton title={t('menuItemNewTitle')} opened={isOpen} onClose={onModalClose}>
      {isOpen && (
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            size="lg"
            autoFocus
            autoComplete="off"
            withAsterisk
            disabled={apiLoading}
            leftSection={<IconMapPin size={22} />}
            placeholder={t('menuItemInsertTitle')}
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
            placeholder={t('menuItemInsertTitleDisplay')}
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
            placeholder={t('menuItemInsertPrice')}
            decimalSeparator=","
            decimalScale={2}
            fixedDecimalScale
            inputMode="decimal"
            key={form.key('price')}
            {...form.getInputProps('price')}
            onChange={onPriceChange}
            mt="md"
            mb="lg"
          />
          <Button
            type="submit"
            size="lg"
            fullWidth
            loading={apiLoading}
            loaderProps={{ type: 'dots' }}
            leftSection={<IconCirclePlus size={28} />}
          >
            {t('printerAdd')}
          </Button>
        </form>
      )}
    </Modal>
  );
}
