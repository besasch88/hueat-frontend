import { Switch } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';

export interface SwitchOnOffProps<T> {
  reference: T;
  checked: boolean;
  readOnly: boolean;
  onChange: (reference: T, checked: boolean) => void;
}

export function SwitchOnOff<T>({ reference, checked, readOnly, onChange }: SwitchOnOffProps<T>) {
  // Handlers
  const onSwitchChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!readOnly) {
      onChange(reference, event.currentTarget.checked);
    }
  };

  // Content
  const checkIcon = () => <IconCheck size={12} color="var(--mantine-primary-color-5)" stroke={3} />;
  const xIcon = () => <IconX size={12} color="var(--mantine-color-red-6)" stroke={3} />;

  return (
    <Switch
      checked={checked}
      size="lg"
      onLabel="ON"
      offLabel="OFF"
      onChange={onSwitchChangeHandler}
      color="var(--mantine-primary-color-5)"
      thumbIcon={checked ? checkIcon() : xIcon()}
    ></Switch>
  );
}
