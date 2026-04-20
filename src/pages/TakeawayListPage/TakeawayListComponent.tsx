import { Table } from '@entities/table';
import { Button } from '@mantine/core';
import { IconCircleCheck, IconProgress } from '@tabler/icons-react';

export interface TakeawayListComponentProps {
  takeaway: Table;
  onClick: (id: string) => void;
}

export function TakeawayListComponent({ takeaway, onClick }: TakeawayListComponentProps) {
  const progressIcon = () => <IconProgress size={22} color="orange" />;
  const completedIcon = () => <IconCircleCheck size={22} color="teal" />;

  return (
    <Button
      onClick={() => onClick(takeaway.id)}
      fullWidth
      size="lg"
      c={'var(--mantine-color-text)'}
      bd={'1px solid var(--mantine-color-dark-1)'}
      bg={takeaway.close ? 'var(--aimm-bg-paper)' : 'var(--mantine-color-white)'}
      leftSection={takeaway.close ? completedIcon() : progressIcon()}
      variant={takeaway.close ? 'filled' : 'default'}
    >
      {takeaway.name.toUpperCase()}
    </Button>
  );
}
