import { Target } from '@dtos/targetDto';
import { Button, Modal, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { tableService } from '@services/tableService';
import { IconCirclePlus, IconLayout2 } from '@tabler/icons-react';
import { getErrorMessage } from '@utils/errUtils';
import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createSearchParams, useNavigate } from 'react-router-dom';

export interface TableListNewModalComponentProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TableListNewModalComponent({ isOpen, onClose }: TableListNewModalComponentProps) {
  // Services
  const navigate = useNavigate();
  const { t } = useTranslation();

  // States
  const [apiLoading, setApiLoading] = useState(false);

  // Form
  const form = useForm({
    initialValues: {
      name: '',
    },
    validate: {
      name: (value: string) => (value.trim().length != 0 ? null : t('fieldIsRequired')),
    },
  });

  const onInputFormChange = (event: ChangeEvent<HTMLInputElement>) => {
    form.setFieldValue('name', event.currentTarget.value.toUpperCase());
  };

  const onModalClose = () => {
    form.reset();
    onClose();
  };

  // Handler
  const handleCreateTableSubmit = async (values: typeof form.values) => {
    try {
      setApiLoading(true);
      const data = await tableService.createTable({
        inside: true,
        name: values.name,
      });
      navigate(
        {
          pathname: data.item.id,
          search: createSearchParams({
            target: Target.inside,
          }).toString(),
        },
        { replace: true }
      );
    } catch (err: unknown) {
      switch (getErrorMessage(err)) {
        case 'table-same-name-already-exists':
          form.setFieldError('name', t('tableNameAlreadyInUse'));
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
    <Modal centered withCloseButton title={t('tableAddNew')} opened={isOpen} onClose={onModalClose}>
      {isOpen && (
        <form onSubmit={form.onSubmit(handleCreateTableSubmit)}>
          <TextInput
            size="lg"
            autoFocus
            autoComplete="off"
            withAsterisk
            disabled={apiLoading}
            leftSection={<IconLayout2 size={22} />}
            placeholder={t('tableInsertTypeName')}
            key={form.key('name')}
            {...form.getInputProps('name')}
            onChange={onInputFormChange}
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
      )}
    </Modal>
  );
}
