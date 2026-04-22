import { Icon } from '@components/Icon/Icon';
import { ActionIcon, Alert, AlertProps, Flex, Menu, SegmentedControl, Text } from '@mantine/core';
import { IconCircleArrowLeft, IconDots } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

export interface PageTitleAction {
  icon: Icon;
  text: string;
  onActionClick: () => void;
}

export interface PageTitleProps {
  title: string;
  backLink?: string;
  actions?: PageTitleAction[];
  alert?: AlertProps;
}

export function PageTitle({ title, backLink, actions, alert }: PageTitleProps) {
  // Services
  const navigate = useNavigate();

  // Handlers
  const onBackClickHandler = () => {
    if (backLink) {
      navigate(backLink, { replace: true });
    }
  };

  // Content
  const renderAction = (action: PageTitleAction, index: number, isLast: boolean) => {
    return (
      <div key={`title_menu_item_${index}`}>
        <Menu.Item onClick={action.onActionClick} leftSection={<action.icon size={30} />} my={10}>
          <Text size="lg">{action.text}</Text>
        </Menu.Item>
        {!isLast && <Menu.Divider />}
      </div>
    );
  };

  return (
    <Flex wrap="nowrap" w={'100%'} gap={10}>
      {backLink && (
        <ActionIcon
          variant="outline"
          aria-label="Back"
          size={50}
          onClick={onBackClickHandler}
          color="var(--mantine-primary-color-6)"
        >
          <IconCircleArrowLeft stroke={1.5} />
        </ActionIcon>
      )}
      <SegmentedControl
        fullWidth
        w={'100%'}
        size="lg"
        color="var(--mantine-color-white)"
        data={[{ label: title.toUpperCase(), value: title.toUpperCase() }]}
      ></SegmentedControl>
      {actions && actions.length > 0 && (
        <Menu
          shadow="lg"
          width={300}
          position="bottom-end"
          withArrow
          transitionProps={{ transition: 'rotate-right', duration: 150 }}
        >
          <Menu.Target>
            <ActionIcon variant="outline" aria-label="Actions" size={50} color="var(--mantine-primary-color-6)">
              <IconDots stroke={1.5} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            {alert && <Alert {...alert}></Alert>}
            {actions.map((action, index) => renderAction(action, index, index + 1 == actions.length))}
          </Menu.Dropdown>
        </Menu>
      )}
    </Flex>
  );
}
