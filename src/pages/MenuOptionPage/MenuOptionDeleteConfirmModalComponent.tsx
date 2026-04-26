import { MenuOption } from '@entities/menuOption';
import { Button, Center, Group, Modal, Text } from '@mantine/core';
import { menuOptionService } from '@services/menuOptionService';
import { IconTrash } from '@tabler/icons-react';
import { getErrorMessage } from '@utils/errUtils';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export interface MenuOptionDeleteConfirmModalComponentProps {
  isOpen: boolean;
  menuOption: MenuOption | null;
  onClose: () => void;
  onDeleted: (id: string) => void;
}

export function MenuOptionDeleteConfirmModalComponent({
  isOpen,
  menuOption,
  onClose,
  onDeleted,
}: MenuOptionDeleteConfirmModalComponentProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [apiLoading, setApiLoading] = useState(false);

  const handleDelete = async () => {
    if (!menuOption) return;
    try {
      setApiLoading(true);
      await menuOptionService.deleteMenuOption({ id: menuOption.id });
      onDeleted(menuOption.id);
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
          <Modal.Title>{t('menuOptionDeleteTitle')}</Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Body>
          {isOpen && (
            <>
              <Center p={30}>
                <Text fz={16} ta="center">
                  {t('menuOptionDeleteConfirm')}
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
