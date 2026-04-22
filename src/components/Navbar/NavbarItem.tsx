import { Icon } from '@components/Icon/Icon';
import { Box, Group, ThemeIcon, UnstyledButton } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import classes from './NavbarItem.module.css';

export interface NavbarItemProps {
  icon: Icon;
  label: string;
  link: string;
}

export function NavbarItem({ icon: Icon, label, link }: NavbarItemProps) {
  // Services
  const navigate = useNavigate();
  const location = useLocation();

  // States
  const [selected, setSelected] = useState(false);

  // Effects
  useEffect(() => {
    setSelected(location.pathname.startsWith(link));
  }, [link, location.pathname]);

  // Handlers
  const onClickHandler = () => {
    navigate(link, { replace: true });
  };

  // Content
  const className = `${classes.control} ${selected ? classes.active : ''}`;
  return (
    <UnstyledButton onClick={onClickHandler} className={className}>
      <Group justify="space-between" gap={0}>
        <Box style={{ display: 'flex', alignItems: 'center' }}>
          <ThemeIcon bd="1px solid" size={40}>
            <Icon size={25} />
          </ThemeIcon>
          <Box ml="md">{label}</Box>
        </Box>
      </Group>
    </UnstyledButton>
  );
}
