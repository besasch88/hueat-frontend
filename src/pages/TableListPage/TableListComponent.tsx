import { Table } from '@entities/table';
import { Button } from '@mantine/core';
import { IconCircleCheck, IconProgress } from '@tabler/icons-react';

export interface TableListComponentProps {
  table: Table;
  onClick: (id: string) => void;
}

export function TableListComponent({ table, onClick }: TableListComponentProps) {
  const progressIcon = () => <IconProgress size={22} color="orange" />;
  const completedIcon = () => <IconCircleCheck size={22} color="teal" />;

  return (
    <Button
      onClick={() => onClick(table.id)}
      fullWidth
      size="lg"
      c={'var(--mantine-color-text)'}
      bd={'1px solid var(--mantine-color-dark-1)'}
      bg={table.close ? 'var(--aimm-bg-paper)' : 'var(--mantine-color-white)'}
      leftSection={table.close ? completedIcon() : progressIcon()}
      variant={table.close ? 'filled' : 'default'}
    >
      {table.name.toUpperCase()}
    </Button>
  );
}
