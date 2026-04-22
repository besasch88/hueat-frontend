import { MenuCategory } from '@entities/menuCategory';
import { MenuItem } from '@entities/menuItem';
import { Printer } from '@entities/printer';
import { Table } from '@entities/table';
import { Button, NumberInput, Select, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { menuItemService } from '@services/menuItemService';
import { printerService } from '@services/printerService';
import { IconCirclePlus, IconCurrencyEuro, IconLayout2 } from '@tabler/icons-react';
import { getErrorMessage } from '@utils/errUtils';
import { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export interface OrderItemNewModalComponentProps {
  table: Table;
  menuCategory: MenuCategory;
  onAddCustomItem: (m: MenuItem) => void;
}

export function OrderItemNewModalComponent({ table, menuCategory, onAddCustomItem }: OrderItemNewModalComponentProps) {
  // Services
  const { t } = useTranslation();
  const navigate = useNavigate();

  // States
  const [pageLoaded, setPageLoaded] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);
  const [printers, setPrinters] = useState<Printer[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const printerData = await printerService.listPrinters();
        setPrinters(printerData.items);
      } catch (err: unknown) {
        switch (getErrorMessage(err)) {
          case 'forbidden':
            break;
          case 'refresh-token-failed':
            navigate('/logout', { replace: true });
            break;
          default:
            navigate('/internal-server-error', { replace: true });
            break;
        }
      } finally {
        setPageLoaded(true);
      }
    })();
  }, [navigate]);

  useEffect(() => {
    if (printers.length > 0) {
      form.setFieldValue('printerId', printers[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [printers]);

  // Form
  const form = useForm({
    initialValues: {
      title: '',
      titleDisplay: '',
      price: '',
      printerId: '',
    },
    validate: {
      title: (value: string) => (value.trim().length != 0 ? null : t('fieldIsRequired')),
      titleDisplay: (value: string) => (value.trim().length != 0 ? null : t('fieldIsRequired')),
      printerId: (value: string) => (value.trim().length != 0 ? null : t('fieldIsRequired')),
      price: (value: number | string) => (value !== '' && +value > 0 ? null : t('fieldIsRequired')),
    },
  });

  const onInputTitleFormChange = (event: ChangeEvent<HTMLInputElement>) => {
    form.setFieldValue('title', event.currentTarget.value.toUpperCase());
  };

  const onInputTitleDisplayFormChange = (event: ChangeEvent<HTMLInputElement>) => {
    form.setFieldValue('titleDisplay', event.currentTarget.value.toUpperCase());
  };

  const onInputPrinterFormChange = (value: string | null) => {
    form.setFieldValue('printerId', value || '');
  };

  const onInputPriceFormChange = (value: number | string) => {
    form.setFieldValue('price', value.toString());
  };

  // Handler
  const handleCreateCustomMenuItemSubmit = async (values: typeof form.values) => {
    try {
      setApiLoading(true);
      const data = await menuItemService.createMenuCustomItem({
        tableId: table.id,
        menuCategoryId: menuCategory.id,
        title: values.title,
        titleDisplay: values.titleDisplay,
        price: +values.price * 100,
        printerId: values.printerId,
      });
      onAddCustomItem(data.item);
    } catch (err: unknown) {
      switch (getErrorMessage(err)) {
        case 'menu-item-same-title-already-exists':
          form.setFieldError('title', t('menuItemTitleAlreadyInUse'));
          break;
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
    <form onSubmit={form.onSubmit(handleCreateCustomMenuItemSubmit)}>
      <TextInput
        size="lg"
        autoComplete="off"
        leftSection={<IconLayout2 size={22} />}
        placeholder={t('menuCustomItemTitlePlaceholder')}
        key={form.key('title')}
        {...form.getInputProps('title')}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          onInputTitleFormChange(event);
          onInputTitleDisplayFormChange(event);
        }}
        mt={'md'}
        mb="lg"
      />
      <Select
        size="lg"
        disabled={!pageLoaded}
        placeholder={t('menuCustomItemPrinterPlaceholder')}
        data={printers.map((p) => ({ value: p.id, label: p.title, disabled: !p.active }))}
        key={form.key('printerId')}
        {...form.getInputProps('printerId')}
        onChange={onInputPrinterFormChange}
        mt={'md'}
        comboboxProps={{ withinPortal: true, zIndex: 400 }}
        mb="lg"
      />
      <NumberInput
        decimalSeparator=","
        decimalScale={2}
        fixedDecimalScale
        inputMode="decimal"
        size="lg"
        autoComplete="off"
        leftSection={<IconCurrencyEuro size={22} />}
        placeholder={t('menuCustomItemPricePlaceholder')}
        key={form.key('price')}
        {...form.getInputProps('price')}
        onChange={onInputPriceFormChange}
        mt={'md'}
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
        {t('tableAdd')}
      </Button>
    </form>
  );
}
