import { Box, Button } from '@mantine/core';
import { IconSquareRoundedPlus } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

export interface OrderCustomItemComponentProps {
  onClick: () => void;
}

export function OrderCustomItemComponent({ onClick }: OrderCustomItemComponentProps) {
  const { t } = useTranslation();

  return (
    <Box>
      <Button
        fullWidth
        size="lg"
        p={5}
        variant="filled"
        mb={'xl'}
        bd={'1px solid var(--mantine-primary-color-7)'}
        bg={'var(--mantine-color-white)'}
        c={'var(--mantine-primary-color-7)'}
        fz={16}
        fw={600}
        onClick={onClick}
      >
        <IconSquareRoundedPlus style={{ marginRight: 5 }} />
        {t('addCustomItem')}
      </Button>
    </Box>
  );
}
