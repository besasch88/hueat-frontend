import { Menu } from '@entities/menu';
import { MenuItem } from '@entities/menuItem';
import { MenuOption } from '@entities/menuOption';
import { Order } from '@entities/order';
import { OrderCourse, OrderItem } from '@entities/orderCourse';
import { Table } from '@entities/table';
import { Box, Button, Center, Divider, Group, Text } from '@mantine/core';
import { orderService } from '@services/orderService';
import { IconCheck, IconX } from '@tabler/icons-react';
import { getErrorMessage } from '@utils/errUtils';
import { sendErrorNotification, sendSuccessNotification } from '@utils/notificationUtils';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export interface ModalPrintOrderProps {
  table: Table;
  menu: Menu;
  order: Order;
  course?: OrderCourse;
  onPrintDone: () => void;
}
export function ModalPrintOrder({ table, menu, order, course, onPrintDone }: ModalPrintOrderProps) {
  // Services
  const { t } = useTranslation();
  const navigate = useNavigate();

  // States
  const [apiLoading, setApiLoading] = useState(false);

  const onPrintClick = async () => {
    try {
      setApiLoading(true);
      await orderService.printOrder({
        id: table.id,
        target: course ? 'course' : 'order',
        courseId: course ? course.id : undefined,
      });
      sendSuccessNotification({
        id: 'order-print-done',
        icon: <IconCheck size={26} />,
        title: <Text fw={600}>{t('donePrintTitle')}</Text>,
        message: <Text>{t('donePrintDescription')}</Text>,
      });
    } catch (err: unknown) {
      switch (getErrorMessage(err)) {
        case 'refresh-token-failed':
          navigate('/logout', { replace: true });
          break;
        default:
          sendErrorNotification({
            id: 'order-print-error',
            icon: <IconX size={26} />,
            title: <Text fw={600}>{t('errorPrintTitle')}</Text>,
            message: <Text>{t('errorPrintDescription')}</Text>,
          });
          break;
      }
    } finally {
      setApiLoading(false);
      onPrintDone();
    }
  };

  // Utilities
  const findCourseItem = (course: OrderCourse, menuItemId: string): OrderItem[] => {
    const o: OrderItem[] = [];
    course.items.forEach((i) => {
      if (i.menuItemId == menuItemId && i.menuOptionId == null) {
        o.push(i);
      }
    });
    return o;
  };

  const findCourseOption = (course: OrderCourse, menuOptionId: string): OrderItem[] => {
    const o: OrderItem[] = [];
    course.items.forEach((i) => {
      if (i.menuOptionId == menuOptionId) {
        o.push(i);
      }
    });
    return o;
  };

  const getNumberOfElements = (): number => {
    if (course) return course.items.length;
    return order.courses.reduce((tot, c) => tot + c.items.length, 0);
  };

  // Content
  const printItem = (menuItem: MenuItem | MenuOption, quantity: number, note?: string) => {
    return (
      <Box key={`course_item_${menuItem.id}`}>
        <Group wrap="nowrap" w={'100%'} mb={6} justify="space-between">
          <Text
            size="lg"
            style={{
              paddingLeft: '1.7rem',
              textIndent: '-1.7rem',
            }}
          >
            <b>{quantity}</b>
            {' x '}
            {menuItem.title}
            {note && (
              <>
                <br />
                <i style={{ fontSize: '0.8em' }}>- {note}</i>
              </>
            )}
          </Text>
        </Group>
      </Box>
    );
  };

  const printMenu = (menu: Menu, course: OrderCourse) => {
    return menu.categories.map((c) => {
      return c.items.map((i) => {
        if (i.options.length == 0) {
          const x = findCourseItem(course, i.id);
          const tot = x.reduce((tot, a) => {
            return tot + a.quantity;
          }, 0);
          if (tot > 0) {
            return printItem(i, tot, x[0].note);
          }
        } else {
          return i.options.map((o) => {
            const x = findCourseOption(course, o.id);
            const tot = x.reduce((tot, a) => {
              return tot + a.quantity;
            }, 0);
            if (tot > 0) {
              return printItem(o, tot, x[0].note);
            }
          });
        }
      });
    });
  };

  const printCourse = (c: OrderCourse, index: number, menu: Menu) => {
    // Hide empty courses
    if (c.items.length == 0) return <div key={`empty_course_${c.id}`}></div>;
    return (
      <Box key={`course_${c.id}`} mt={10} mb={40}>
        <Text fw={600} size="xl">
          {t('course')} {index}
        </Text>
        <Divider mb={15} />
        {printMenu(menu, c)}
      </Box>
    );
  };

  return (
    <Box style={{ fontFamily: 'Montserrat' }}>
      {order.courses.map((c, index) => {
        if (course && course.id == c.id) {
          return printCourse(c, index + 1, menu);
        } else if (!course) {
          return printCourse(c, index + 1, menu);
        }
      })}
      {getNumberOfElements() == 0 && (
        <Center p={30}>
          <Text fz={18} ta={'center'}>
            {t('noItemsToPrint')}
          </Text>
        </Center>
      )}
      {getNumberOfElements() > 0 && (
        <Button size="lg" fullWidth onClick={onPrintClick} loading={apiLoading}>
          {t('print')}
        </Button>
      )}
    </Box>
  );
}
