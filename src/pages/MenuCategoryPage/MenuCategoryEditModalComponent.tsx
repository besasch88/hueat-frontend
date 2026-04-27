import { SwitchOnOff } from '@components/SwitchOnOff/SwitchOnOff';
import { MenuCategory } from '@entities/menuCategory';
import { Button, Group, Modal, Paper, Stack, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { menuCategoryService } from '@services/menuCategoryService';
import { IconDeviceFloppy, IconDoorExit, IconLayout2, IconTag } from '@tabler/icons-react';
import { getErrorMessage } from '@utils/errUtils';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export interface MenuCategoryEditModalComponentProps {
  isOpen: boolean;
  menuCategory: MenuCategory | null;
  onClose: () => void;
  onUpdated: (menuCategory: MenuCategory) => void;
}

export function MenuCategoryEditModalComponent({
  isOpen,
  menuCategory,
  onClose,
  onUpdated,
}: MenuCategoryEditModalComponentProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [apiLoading, setApiLoading] = useState(false);

  const form = useForm({
    initialValues: {
      title: '',
      inside: false,
      outside: false,
    },
    validate: {
      title: (value: string) => (value.trim().length !== 0 ? null : t('fieldIsRequired')),
    },
  });

  useEffect(() => {
    if (menuCategory) {
      form.setValues({
        title: menuCategory.title,
        inside: menuCategory.inside,
        outside: menuCategory.outside,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuCategory]);

  const onModalClose = () => {
    form.reset();
    onClose();
  };

  const handleSubmit = async (values: typeof form.values) => {
    if (!menuCategory) return;
    try {
      setApiLoading(true);
      const data = await menuCategoryService.updateMenuCategory({
        id: menuCategory.id,
        title: values.title.trim(),
        titleDisplay: values.title.trim(),
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
    <Modal centered withCloseButton title={t('menuCategoryEditTitle')} opened={isOpen} onClose={onModalClose}>
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
                    {t('menuCategoryInsideLabel')}
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
                  <IconDoorExit size={22} color="var(--mantine-primary-color-6)" />
                  <Text size="md" fw={500}>
                    {t('menuCategoryOutsideLabel')}
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
