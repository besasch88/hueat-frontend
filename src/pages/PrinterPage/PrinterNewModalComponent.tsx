import { Printer } from '@entities/printer';
import { Button, Modal, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { printerService } from '@services/printerService';
import { IconCirclePlus, IconLink, IconPrinter } from '@tabler/icons-react';
import { getErrorMessage } from '@utils/errUtils';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export interface PrinterNewModalComponentProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (printer: Printer) => void;
}

export function PrinterNewModalComponent({ isOpen, onClose, onCreated }: PrinterNewModalComponentProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [apiLoading, setApiLoading] = useState(false);

  const form = useForm({
    initialValues: {
      title: '',
      url: '',
    },
    validate: {
      title: (value: string) => (value.trim().length !== 0 ? null : t('fieldIsRequired')),
      url: (value: string) => (value.trim().length !== 0 ? null : t('fieldIsRequired')),
    },
  });

  const onModalClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit = async (values: typeof form.values) => {
    try {
      setApiLoading(true);
      const data = await printerService.createPrinter({
        title: values.title.trim(),
        url: values.url.trim(),
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
    <Modal centered withCloseButton title={t('printerAddNew')} opened={isOpen} onClose={onModalClose}>
      {isOpen && (
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            size="lg"
            autoFocus
            autoComplete="off"
            withAsterisk
            disabled={apiLoading}
            leftSection={<IconPrinter size={22} />}
            placeholder={t('printerInsertTitle')}
            key={form.key('title')}
            {...form.getInputProps('title')}
            mt={'md'}
          />
          <TextInput
            size="lg"
            autoComplete="off"
            withAsterisk
            disabled={apiLoading}
            leftSection={<IconLink size={22} />}
            placeholder={t('printerInsertUrl')}
            key={form.key('url')}
            {...form.getInputProps('url')}
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
            {t('printerAdd')}
          </Button>
        </form>
      )}
    </Modal>
  );
}
