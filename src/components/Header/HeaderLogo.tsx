import { Group, Image } from '@mantine/core';
import classes from './HeaderLogo.module.css';

export function HeaderLogo() {
  // Content
  return (
    <Group gap={10} wrap="nowrap" style={{ cursor: 'pointer' }}>
      <Image src="/header.svg" alt="Logo Icon" className={classes.logo} />
    </Group>
  );
}
