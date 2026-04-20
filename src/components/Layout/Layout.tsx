import { Header } from '@components/Header/Header';
import { Navbar } from '@components/Navbar/Navbar';
import { AppShell, AppShellHeader, AppShellMain, AppShellNavbar, Container, Grid } from '@mantine/core';
import { useState } from 'react';

export function Layout({ children }: { children: React.ReactNode }) {
  // States
  const [isOpen, setOpen] = useState(false);

  // Content
  return (
    <AppShell
      header={{ height: 70 }}
      navbar={{
        width: { xs: 250, sm: 300 },
        breakpoint: 'xs',
        collapsed: { mobile: !isOpen, desktop: false },
      }}
    >
      <AppShellHeader bd={0} mx={'md'}>
        <Header onMenuToggle={setOpen} />
      </AppShellHeader>
      <AppShellNavbar zIndex={300} p="md" pt={0} bd={0}>
        <Navbar />
      </AppShellNavbar>
      <AppShellMain>
        <Container fluid>
          <Grid gutter="md" columns={12} pb={100} style={{ overflow: 'hidden' }}>
            {children}
          </Grid>
        </Container>
      </AppShellMain>
    </AppShell>
  );
}
