import { MenuCategory } from '@entities/menuCategory';
import { Button, Modal, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { menuCategoryService } from '@services/menuCategoryService';
import { IconCirclePlus, IconTag } from '@tabler/icons-react';
import { getErrorMessage } from '@utils/errUtils';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export interface MenuCategoryNewModalComponentProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (menuCategory: MenuCategory) => void;
}

export function MenuCategoryNewModalComponent({ isOpen, onClose, onCreated }: MenuCategoryNewModalComponentProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [apiLoading, setApiLoading] = useState(false);

  const form = useForm({
    initialValues: { title: '' },
    validate: {
      title: (value: string) => (value.trim().length !== 0 ? null : t('fieldIsRequired')),
    },
  });

  const onModalClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit = async (values: typeof form.values) => {
    try {
      setApiLoading(true);
      const data = await menuCategoryService.createMenuCategory({
        title: values.title.trim(),
        titleDisplay: values.title.trim(),
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
    <Modal centered withCloseButton title={t('menuCategoryNewTitle')} opened={isOpen} onClose={onModalClose}>
      {isOpen && (
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            size="lg"
            autoFocus
            autoComplete="off"
            withAsterisk
            disabled={apiLoading}
            leftSection={<IconTag size={22} />}
            placeholder={t('menuCategoryInsertTitle')}
            key={form.key('title')}
            {...form.getInputProps('title')}
            onChange={(e) => form.setFieldValue('title', e.currentTarget.value.toUpperCase())}
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
            {t('menuCategoryAdd')}
          </Button>
        </form>
      )}
    </Modal>
  );
}
