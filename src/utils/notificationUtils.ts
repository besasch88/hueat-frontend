import { notifications } from '@mantine/notifications';
import { ReactNode } from 'react';

export interface sendNotificationProps {
  id: string;
  title: ReactNode;
  message: ReactNode;
  icon?: ReactNode;
}
export const sendErrorNotification = ({ id, title, message, icon }: sendNotificationProps) => {
  notifications.show({
    id: id,
    icon: icon,
    position: 'top-center',
    withCloseButton: true,
    autoClose: 5000,
    title: title,
    styles: {
      root: {
        borderWidth: 2,
        borderColor: 'red',
        backgroundColor: 'var(--mantine-color-red-0)',
      },
      title: {
        color: 'var(--mantine-color-text)',
      },
      description: {
        color: 'var(--mantine-color-text)',
      },
    },
    message: message,
    color: 'red',
    withBorder: true,
    loading: false,
  });
};

export const sendSuccessNotification = ({ id, title, message, icon }: sendNotificationProps) => {
  notifications.show({
    id: id,
    icon: icon,
    position: 'top-center',
    withCloseButton: true,
    autoClose: 5000,
    title: title,
    message: message,
    color: 'primary',
    styles: {
      root: {
        borderWidth: 2,
        borderColor: 'primary',
        backgroundColor: 'var(--mantine-primary-color-0)',
      },
      title: {
        color: 'var(--mantine-color-text)',
      },
      description: {
        color: 'var(--mantine-color-text)',
      },
    },
    withBorder: true,
    loading: false,
  });
};
