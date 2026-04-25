import { Layout } from '@components/Layout/Layout';
import { PageTitle } from '@components/PageTitle/PageTitle';
import { StackList } from '@components/StackList/StackList';
import { useAuth } from '@context/AuthContext';
import { Printer } from '@entities/printer';
import { AuthGuard } from '@guards/AuthGuard';
import { Affix, Button, Grid, Group, Loader } from '@mantine/core';
import { printerService } from '@services/printerService';
import { IconCirclePlus } from '@tabler/icons-react';
import { getErrorMessage } from '@utils/errUtils';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { PrinterDeleteConfirmModalComponent } from './PrinterDeleteConfirmModalComponent';
import { PrinterEditModalComponent } from './PrinterEditModalComponent';
import { PrinterEmptyStateComponent } from './PrinterEmptyStateComponent';
import { PrinterListComponent } from './PrinterListComponent';
import { useModals } from './PrinterModals';
import { PrinterNewModalComponent } from './PrinterNewModalComponent';

export function PrinterPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const auth = useAuth();

  const modals = useModals();
  const [pageLoaded, setPageLoaded] = useState(false);
  const [printers, setPrinters] = useState<Printer[]>([]);

  const onPrinterSwitchHandler = async (printer: Printer, checked: boolean) => {
    try {
      const data = await printerService.updatePrinter({ id: printer.id, active: checked });
      setPrinters((prev) => prev.map((p) => (p.id === data.item.id ? data.item : p)));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await printerService.listPrinters();
        setPrinters(data.items);
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
    })();
  }, [navigate]);

  const canWritePrinter = auth.hasPermissionTo('write-printer');

  return (
    <AuthGuard>
      <Layout>
        {!pageLoaded && (
          <Grid.Col span={12}>
            <PageTitle title={t('printerTitle')} />
            <Group mt={75} justify="center" align="center">
              <Loader type="dots" />
            </Group>
          </Grid.Col>
        )}
        {pageLoaded && (
          <>
            <Grid.Col span={12}>
              <PageTitle title={t('printerTitle')} />
            </Grid.Col>
            <Grid.Col span={12}>
              <StackList>
                {printers.map((printer) => (
                  <PrinterListComponent
                    key={`printer_${printer.id}`}
                    printer={printer}
                    onSwitch={onPrinterSwitchHandler}
                    onEdit={modals.editPrinter.open}
                    onDelete={modals.deletePrinter.open}
                  />
                ))}
              </StackList>
              {printers.length === 0 && <PrinterEmptyStateComponent />}
            </Grid.Col>
            <Affix p={'md'} position={{ bottom: 0 }} hidden={!canWritePrinter} ta={'center'}>
              <Button size="lg" onClick={modals.newPrinter.open} leftSection={<IconCirclePlus size={28} />}>
                {t('printerAddNew')}
              </Button>
            </Affix>
          </>
        )}
      </Layout>
      <PrinterNewModalComponent
        isOpen={modals.newPrinter.isOpen}
        onClose={modals.newPrinter.close}
        onCreated={(printer) => {
          setPrinters((prev) => [...prev, printer]);
          modals.newPrinter.close();
        }}
      />
      <PrinterEditModalComponent
        isOpen={modals.editPrinter.isOpen}
        printer={modals.editPrinter.printer}
        onClose={modals.editPrinter.close}
        onUpdated={(printer) => {
          setPrinters((prev) => prev.map((p) => (p.id === printer.id ? printer : p)));
          modals.editPrinter.close();
        }}
      />
      <PrinterDeleteConfirmModalComponent
        isOpen={modals.deletePrinter.isOpen}
        printer={modals.deletePrinter.printer}
        onClose={modals.deletePrinter.close}
        onDeleted={(id) => {
          setPrinters((prev) => prev.filter((p) => p.id !== id));
          modals.deletePrinter.close();
        }}
      />
    </AuthGuard>
  );
}
