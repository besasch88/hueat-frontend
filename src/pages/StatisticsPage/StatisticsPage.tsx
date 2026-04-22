import { Layout } from '@components/Layout/Layout';
import { PageTitle } from '@components/PageTitle/PageTitle';
import { useAuth } from '@context/AuthContext';
import { Statistics } from '@entities/statistics';
import { AuthGuard } from '@guards/AuthGuard';
import { Button, Divider, Grid, Group, Loader, Modal, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { statisticsService } from '@services/statisticsService';
import { IconTrash } from '@tabler/icons-react';
import { getErrorMessage } from '@utils/errUtils';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { ModalDeleteStatistics } from './ModalDeleteStatistics';

export function StatisticsPage() {
  // Services
  const auth = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // States
  const [pageLoaded, setPageLoaded] = useState(false);
  const [statistics, setStatistics] = useState<Statistics>();
  const [deleteModalOpen, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);

  const toPrice = (value: number) => (value / 100).toFixed(2);

  const getCashPayment = (stats: Statistics): string => {
    const value = stats.paymentsTakings.find((x) => x.paymentType == 'cash')?.takings || 0;
    return toPrice(value);
  };

  const getCardPayment = (stats: Statistics): string => {
    const value = stats.paymentsTakings.find((x) => x.paymentType == 'card')?.takings || 0;
    return toPrice(value);
  };

  const getTimeStatistics = (stats: Statistics): string => {
    const valueMs = stats.avgTableDuration / 1_000_000;
    const totalSeconds = Math.floor(valueMs / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const hh = String(h).padStart(2, '0');
    const mm = String(m).padStart(2, '0');
    return hh + ':' + mm;
  };

  const refetchStatistics = () => {
    fetchStatistics(navigate);
  };

  const fetchStatistics = async (navigate: NavigateFunction) => {
    try {
      const statisticsData = await statisticsService.getStatistics();
      setStatistics(statisticsData.item);
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
      setPageLoaded(true);
    }
  };

  // Effects
  useEffect(() => {
    fetchStatistics(navigate);
  }, [navigate]);

  return (
    <AuthGuard>
      <Layout>
        {!pageLoaded && (
          <Grid.Col span={12}>
            <PageTitle title={t('menuStatistics')} />
            <Group mt={75} justify="center" align="center">
              <Loader type="dots" />
            </Group>
          </Grid.Col>
        )}
        {pageLoaded && statistics && (
          <>
            <Grid.Col span={12}>
              <PageTitle title={t('menuStatistics')} />
            </Grid.Col>
            <Grid.Col span={12}>
              <Title order={4} mb={10} mt={15}>
                {t('paymentStatistics')}
              </Title>
              <Button
                fullWidth
                px={15}
                mb={10}
                size="lg"
                justify="space-between"
                variant="default"
                color="var(--aimm-bg-paper)"
                bg={'var(--mantine-color-gray-1)'}
                bd={'1px solid var(--mantine-color-dark-1)'}
                c="var(--mantine-color-text)"
                fz={15}
                rightSection={<Text fw={600}>{getCashPayment(statistics)}€</Text>}
                leftSection={<Text>{t('cash')}</Text>}
              ></Button>
              <Button
                fullWidth
                px={15}
                mb={10}
                size="lg"
                justify="space-between"
                variant="default"
                color="var(--aimm-bg-paper)"
                bg={'var(--mantine-color-gray-3)'}
                bd={'1px solid var(--mantine-color-dark-1)'}
                c="var(--mantine-color-text)"
                fz={15}
                rightSection={<Text fw={600}>{getCardPayment(statistics)}€</Text>}
                leftSection={<Text>{t('card')}</Text>}
              ></Button>
            </Grid.Col>
            <Divider />
            <Grid.Col span={12}>
              <Title order={4} mb={10} mt={15}>
                {t('timeStatistics')}
              </Title>
              <Button
                fullWidth
                px={15}
                mb={10}
                size="lg"
                justify="space-between"
                variant="default"
                color="var(--aimm-bg-paper)"
                bg={'var(--mantine-color-gray-1)'}
                bd={'1px solid var(--mantine-color-dark-1)'}
                c="var(--mantine-color-text)"
                fz={15}
                rightSection={<Text fw={600}>{getTimeStatistics(statistics)} h</Text>}
                leftSection={<Text>{t('timeTable')}</Text>}
              ></Button>
            </Grid.Col>
            <Divider />
            {statistics.menuItemStats.length > 0 && (
              <Grid.Col span={12}>
                <Title order={4} mb={10} mt={15}>
                  {t('menuItems').toUpperCase()}
                </Title>
                {statistics.menuItemStats.map((menuItem, index) => (
                  <Button
                    key={`menu_item_${index}`}
                    fullWidth
                    px={15}
                    mb={10}
                    size="lg"
                    justify="space-between"
                    variant="default"
                    color="var(--aimm-bg-paper)"
                    bg={index % 2 == 0 ? 'var(--mantine-color-gray-3)' : 'var(--mantine-color-gray-1)'}
                    bd={'1px solid var(--mantine-color-dark-1)'}
                    c="var(--mantine-color-text)"
                    fz={15}
                    rightSection={<Text fw={600}>{toPrice(menuItem.takings)}€</Text>}
                    leftSection={
                      <Text>
                        {menuItem.quantity} x {menuItem.title}
                      </Text>
                    }
                  ></Button>
                ))}
              </Grid.Col>
            )}
            {auth.hasPermissionTo('delete-statistics') && (
              <>
                <Grid.Col span={12}>
                  <Divider my={'md'} />
                </Grid.Col>
                <Grid.Col span={12}>
                  <Title order={4} mb={10} c="var(--mantine-color-red-7)">
                    {t('dangerZone').toUpperCase()}
                  </Title>
                  <Text c={'var(--mantine-color-text)'}>{t('dangerZoneDescription')}</Text>
                  <Button
                    key={`deleteStatistics`}
                    fullWidth
                    px={15}
                    mt={15}
                    mb={10}
                    size="lg"
                    variant="default"
                    bg={'var(--mantine-color-red-6)'}
                    c="var(--mantine-color-white)"
                    fz={15}
                    leftSection={<IconTrash color="white" />}
                    onClick={openDeleteModal}
                  >
                    {t('deleteStatisticsButton')}
                  </Button>
                </Grid.Col>
              </>
            )}
            <Modal.Root opened={deleteModalOpen} onClose={closeDeleteModal} centered keepMounted>
              <Modal.Overlay />
              <Modal.Content>
                <Modal.Header bg={'var(--mantine-color-red-6)'}>
                  <Modal.Title>{t('dangerZone')}</Modal.Title>
                  <Modal.CloseButton />
                </Modal.Header>
                <Modal.Body>
                  {deleteModalOpen && (
                    <ModalDeleteStatistics
                      onDeleted={() => {
                        closeDeleteModal();
                        refetchStatistics();
                      }}
                    />
                  )}
                </Modal.Body>
              </Modal.Content>
            </Modal.Root>
          </>
        )}
      </Layout>
    </AuthGuard>
  );
}
