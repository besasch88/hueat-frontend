import { EmptyState } from '@components/EmptyState/EmptyState';
import { useTranslation } from 'react-i18next';

export function PrinterEmptyStateComponent() {
  const { t } = useTranslation();
  return <EmptyState title={t('printerEmptyList')} text={t('printerEmptyListDescription')} imageName="no-results" />;
}
