import { Target } from '@dtos/targetDto';
import { Button, Group, Modal, NumberInput, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { tableService } from '@services/tableService';
import { IconCirclePlus } from '@tabler/icons-react';
import { getErrorMessage } from '@utils/errUtils';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { createSearchParams, useNavigate } from 'react-router-dom';

export interface TakeawayListNewModalComponentProps {
  isOpen: boolean;
  onClose: () => void;
  lastTakeawayNumber: number;
}

export function TakeawayListNewModalComponent({
  isOpen,
  onClose,
  lastTakeawayNumber,
}: TakeawayListNewModalComponentProps) {
  // Services
  const navigate = useNavigate();
  const { t } = useTranslation();

  // States
  const [apiLoading, setApiLoading] = useState(false);

  // Form
  const form = useForm({
    initialValues: {
      name: lastTakeawayNumber + 1,
    },
    validate: {
      name: (value: number) => (value > 0 ? null : t('fieldIsRequired')),
    },
  });

  const onInputFormChange = (newValue: string | number) => {
    form.setFieldValue('name', parseInt(newValue.toString()));
  };

  const onModalClose = () => {
    form.reset();
    onClose();
  };

  // Handler
  const handleCreateTakeawaySubmit = async (values: typeof form.values) => {
    try {
      setApiLoading(true);
      const data = await tableService.createTable({
        inside: false,
        name: `ASPORTO ${values.name}`,
      });
      navigate(
        {
          pathname: `${data.item.id}`,
          search: createSearchParams({
            target: Target.outside,
          }).toString(),
        },
        { replace: true }
      );
    } catch (err: unknown) {
      switch (getErrorMessage(err)) {
        case 'table-same-name-already-exists':
          form.setFieldError('name', t('takeawayNameAlreadyInUse'));
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
    <Modal centered withCloseButton title={t('takeawayAddNew')} opened={isOpen} onClose={onModalClose}>
      {isOpen && (
        <form onSubmit={form.onSubmit(handleCreateTakeawaySubmit)}>
          <Group wrap="nowrap">
            <Text size="lg" mt={'md'} mb="lg" w={200}>
              ASPORTO N.RO:
            </Text>
            <NumberInput
              size="lg"
              autoFocus
              withAsterisk
              disabled={apiLoading}
              placeholder={t('takeawayInsertTypeName')}
              key={form.key('name')}
              {...form.getInputProps('name')}
              onChange={onInputFormChange}
              allowDecimal={false}
              min={1}
              mt={'md'}
              mb="lg"
            />
          </Group>
          <Button
            type="submit"
            size="lg"
            fullWidth
            loading={apiLoading}
            loaderProps={{ type: 'dots' }}
            leftSection={<IconCirclePlus size={28} />}
          >
            {t('takeawayAdd')}
          </Button>
        </form>
      )}
    </Modal>
  );
}
