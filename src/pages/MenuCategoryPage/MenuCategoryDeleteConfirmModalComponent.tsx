import { MenuCategory } from '@entities/menuCategory';
import { Button, Center, Group, Modal, Text } from '@mantine/core';
import { menuCategoryService } from '@services/menuCategoryService';
import { IconTrash } from '@tabler/icons-react';
import { getErrorMessage } from '@utils/errUtils';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export interface MenuCategoryDeleteConfirmModalComponentProps {
  isOpen: boolean;
  menuCategory: MenuCategory | null;
  onClose: () => void;
  onDeleted: (id: string) => void;
}

export function MenuCategoryDeleteConfirmModalComponent({
  isOpen,
  menuCategory,
  onClose,
  onDeleted,
}: MenuCategoryDeleteConfirmModalComponentProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [apiLoading, setApiLoading] = useState(false);

  const handleDelete = async () => {
    if (!menuCategory) return;
    try {
      setApiLoading(true);
      await menuCategoryService.deleteMenuCategory({ id: menuCategory.id });
      onDeleted(menuCategory.id);
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
    <Modal.Root opened={isOpen} onClose={onClose} centered>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header bg={'var(--mantine-color-red-6)'}>
          <Modal.Title>{t('menuCategoryDeleteTitle')}</Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Body>
          {isOpen && (
            <>
              <Center p={30}>
                <Text fz={16} ta="center">
                  {t('menuCategoryDeleteConfirm')}
                </Text>
              </Center>
              <Group grow>
                <Button variant="default" size="lg" disabled={apiLoading} onClick={onClose}>
                  {t('printerDeleteCancel')}
                </Button>
                <Button
                  size="lg"
                  variant="filled"
                  color="red"
                  loading={apiLoading}
                  loaderProps={{ type: 'dots' }}
                  leftSection={<IconTrash size={28} />}
                  onClick={handleDelete}
                >
                  {t('menuDelete')}
                </Button>
              </Group>
            </>
          )}
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}
