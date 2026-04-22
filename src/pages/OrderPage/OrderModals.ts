import { useDisclosure } from '@mantine/hooks';

export function useModals() {
  const useReopenTable = () => {
    const [isOpen, { open, close }] = useDisclosure(false);
    return { isOpen, open, close };
  };
  const useCloseTable = () => {
    const [isOpen, { open, close }] = useDisclosure(false);
    return { isOpen, open, close };
  };
  const usePrintOrder = () => {
    const [isOpen, { open, close }] = useDisclosure(false);
    return { isOpen, open, close };
  };
  const usePrintCourse = () => {
    const [isOpen, { open, close }] = useDisclosure(false);
    return { isOpen, open, close };
  };
  const usePrintBill = () => {
    const [isOpen, { open, close }] = useDisclosure(false);
    return { isOpen, open, close };
  };
  const useNewCustomItem = () => {
    const [isOpen, { open, close }] = useDisclosure(false);
    return { isOpen, open, close };
  };

  return {
    reopenTable: useReopenTable(),
    closeTable: useCloseTable(),
    printOrder: usePrintOrder(),
    printCourse: usePrintCourse(),
    printBill: usePrintBill(),
    closeAndSendTable: useCloseTable(),
    newCustomItem: useNewCustomItem(),
  };
}
