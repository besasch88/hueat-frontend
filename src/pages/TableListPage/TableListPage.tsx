import { Layout } from '@components/Layout/Layout';
import { useAuth } from '@context/AuthContext';
import { Target } from '@dtos/targetDto';
import { Table } from '@entities/table';
import { AuthGuard } from '@guards/AuthGuard';
import { Grid, Group, Loader, SegmentedControl } from '@mantine/core';
import { tableService } from '@services/tableService';
import { getErrorMessage } from '@utils/errUtils';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import classes from './TableList.module.css';
import { TableListMyComponent } from './TableListMyComponent';
import { TableListNewButtonComponent } from './TableListNewButtonComponent';
import { TableListNewModalComponent } from './TableListNewModalComponent';
import { TableListOthersComponent } from './TableListOthersComponent';
import { useModals } from './TableModals';

export function TableListPage() {
  // Services
  const navigate = useNavigate();
  const auth = useAuth();
  const { t } = useTranslation();

  // Data
  const sections = { MY_TABLES: 'my-tables', OTHER_TABLES: 'other-tables' };

  // States
  const modals = useModals();
  const [pageLoaded, setPageLoaded] = useState(false);
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedSection, setSelectedSection] = useState(sections.MY_TABLES);

  // Effects
  useEffect(() => {
    (async () => {
      try {
        const tableData = await tableService.listTables({ target: Target.inside, includeClosed: true });
        setTables(tableData.items);
      } catch (err: unknown) {
        switch (getErrorMessage(err)) {
          case 'forbidden':
            break;
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
    })();
  }, [navigate]);

  const canCreateTable = (): boolean => {
    return (
      !modals.newTable.isOpen &&
      selectedSection == sections.MY_TABLES &&
      auth.hasPermissionTo('read-my-tables') &&
      auth.hasPermissionTo('write-my-tables')
    );
  };

  // Content
  return (
    <AuthGuard>
      <Layout>
        {!pageLoaded && (
          <Grid.Col span={12}>
            <Group mt={75} justify="center" align="center">
              <Loader type="dots" />
            </Group>
          </Grid.Col>
        )}
        {pageLoaded && (
          <>
            <Grid.Col span={12}>
              <SegmentedControl
                className={classes.segmentRoot}
                onChange={setSelectedSection}
                fullWidth
                size="lg"
                data={[
                  {
                    label: t('tableMyTableMenu').toUpperCase(),
                    value: sections.MY_TABLES,
                  },
                  {
                    label: t('tableOtherTableMenu').toUpperCase(),
                    value: sections.OTHER_TABLES,
                  },
                ]}
              />
            </Grid.Col>
            {selectedSection == sections.MY_TABLES && (
              <Grid.Col span={12}>
                <TableListMyComponent tables={tables} />
              </Grid.Col>
            )}
            {selectedSection == sections.OTHER_TABLES && (
              <Grid.Col span={12}>
                <TableListOthersComponent tables={tables} />
              </Grid.Col>
            )}
            <TableListNewButtonComponent hidden={!canCreateTable()} onClick={modals.newTable.open} />
          </>
        )}
      </Layout>
      <TableListNewModalComponent isOpen={modals.newTable.isOpen} onClose={modals.newTable.close} />
    </AuthGuard>
  );
}
