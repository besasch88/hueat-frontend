import { Box, Button, Center, Group, Text } from '@mantine/core';
import { statisticsService } from '@services/statisticsService';
import { IconTrash } from '@tabler/icons-react';
import { getErrorMessage } from '@utils/errUtils';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export interface ModalDeleteStatisticsProps {
  onDeleted: () => void;
  onClose: () => void;
}

export function ModalDeleteStatistics({ onDeleted, onClose }: ModalDeleteStatisticsProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [apiLoading, setApiLoading] = useState(false);

  const handleDeleteSubmit = async () => {
    try {
      setApiLoading(true);
      await statisticsService.deleteStatistics();
      onDeleted();
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
    <Box>
      <Center p={30}>
        <Text fz={16} ta={'center'}>
          {t('deleteStatisticsConfirm')}
        </Text>
      </Center>
      <Group grow>
        <Button variant="default" size="lg" disabled={apiLoading} onClick={onClose}>
          {t('printerDeleteCancel')}
        </Button>
        <Button
          onClick={() => handleDeleteSubmit()}
          size="lg"
          variant="filled"
          loading={apiLoading}
          loaderProps={{ type: 'dots' }}
          color="red"
          leftSection={<IconTrash size={28} />}
        >
          {t('menuDelete')}
        </Button>
      </Group>
    </Box>
  );
}
