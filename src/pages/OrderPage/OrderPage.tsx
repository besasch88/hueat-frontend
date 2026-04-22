import { Layout } from '@components/Layout/Layout';
import { PageTitle } from '@components/PageTitle/PageTitle';
import { StackList } from '@components/StackList/StackList';
import { useAuth } from '@context/AuthContext';
import { Target } from '@dtos/targetDto';
import { Menu } from '@entities/menu';
import { MenuCategory } from '@entities/menuCategory';
import { MenuItem } from '@entities/menuItem';
import { Order } from '@entities/order';
import { OrderCourse } from '@entities/orderCourse';
import { Table } from '@entities/table';
import { AuthGuard } from '@guards/AuthGuard';
import { Alert, Flex, Grid, Group, Loader, Modal, SegmentedControl, Text } from '@mantine/core';
import { menuService } from '@services/menuService';
import { orderService } from '@services/orderService';
import { tableService } from '@services/tableService';
import { IconX } from '@tabler/icons-react';
import { getErrorMessage } from '@utils/errUtils';
import { sendErrorNotification } from '@utils/notificationUtils';
import debounce from 'lodash.debounce';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { ModalCloseAndSendTable } from './ModalCloseAndSendTable';
import { ModalCloseTable } from './ModalCloseTable';
import { ModalPrintBill } from './ModalPrintBill';
import { ModalPrintOrder } from './ModalPrintOrder';
import { ModalReopenTable } from './ModalReopenTable';

import classes from './Order.module.css';
import { getOrderActions } from './OrderActionsData';
import { OrderCourseNavigationComponent } from './OrderCourseNavigationComponent';
import { OrderCustomItemComponent } from './OrderCustomItemComponent';
import { OrderItemComponent } from './OrderItemComponent';
import { OrderItemNewModalComponent } from './OrderItemNewModalComponent';
import { useModals } from './OrderModals';
import { orderFinalPrice } from './OrderUtils';

export function OrderPage() {
  const { tableId } = useParams();
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const target = searchParams.get('target') as Target;

  // Services
  const navigate = useNavigate();
  const auth = useAuth();

  // Scroll
  const itemsRef = useRef<Record<string, HTMLElement | null>>({});

  // States
  const modals = useModals();
  const [isPageLoaded, setPageLoaded] = useState(false);

  const [table, setTable] = useState<Table>();
  const [menu, setMenu] = useState<Menu>();
  const [order, setOrder] = useState<Order>();

  const [currentCategory, setCurrentCategory] = useState<MenuCategory>();
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [expandedMenuItem, setExpandedMenuItem] = useState<MenuItem | null>(null);
  const [currentCourse, setCurrentCourse] = useState<OrderCourse>();

  // Effects
  useEffect(() => {
    (async () => {
      try {
        if (!tableId) return;
        // Retrieve Table
        const tableData = await tableService.getTable({ id: tableId });
        setTable(tableData.item);
        // Retrieve Menu
        const menuData = await menuService.getMenu({ tableID: tableId });
        setMenu(menuData.item);
        setCategories(menuData.item.categories);
        setCurrentCategory(menuData.item.categories[0]);

        try {
          const orderData = await orderService.getOrder({ id: tableId });
          setOrder(orderData.item);
          setCurrentCourse(orderData.item.courses[orderData.item.courses.length - 1]);
        } catch (err: unknown) {
          switch (getErrorMessage(err)) {
            case 'order-not-found': {
              const currentOrder = {
                id: tableId,
                courses: [{ id: uuidv4().toString(), items: [] }],
              };
              setOrder(currentOrder);
              setCurrentCourse(currentOrder.courses[currentOrder.courses.length - 1]);
              break;
            }
            case 'refresh-token-failed':
              navigate('/logout', { replace: true });
              break;
            default:
              navigate('/internal-server-error', { replace: true });
              break;
          }
        }
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
  }, [navigate, tableId, auth, target]);

  const debouncedSaveOrder = useMemo(
    () =>
      debounce(async (order: Order) => {
        if (!tableId) return;
        if (auth.getUserId() !== table?.userId) {
          if (!auth.hasPermissionTo('write-other-tables')) return;
        }
        try {
          await orderService.updateOrder({ id: tableId, courses: order.courses });
        } catch (err: unknown) {
          switch (getErrorMessage(err)) {
            case 'refresh-token-failed':
              navigate('/logout', { replace: true });
              break;
            default:
              sendErrorNotification({
                id: 'order-save-error',
                icon: <IconX size={26} />,
                title: <Text fw={600}>{t('errorOrderSaveTitle')}</Text>,
                message: <Text>{t('errorOrderSaveDescription')}</Text>,
              });
              break;
          }
        }
      }, 500),
    [tableId, navigate, t, auth, table]
  );

  useEffect(() => {
    if (!order) return;
    debouncedSaveOrder(order);
  }, [order, debouncedSaveOrder]);

  const isTargetOutside = () => {
    return target == Target.outside;
  };

  const onMenuActionClick = (code: string) => {
    switch (code) {
      case 'reopen':
        modals.reopenTable.open();
        break;
      case 'print-order':
        modals.printOrder.open();
        break;
      case 'print-course':
        modals.printCourse.open();
        break;
      case 'print-bill':
        modals.printBill.open();
        break;
      case 'close':
        modals.closeTable.open();
        break;
      case 'close-send':
        modals.closeAndSendTable.open();
        break;
    }
  };

  const onCustomItemClick = () => {
    modals.newCustomItem.open();
  };

  useEffect(() => {
    if (!expandedMenuItem) return;
    const el = itemsRef.current[expandedMenuItem.id];
    if (!el) return;
    window.setTimeout(() => {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
    }, 120);
  }, [expandedMenuItem]);

  const nextCourse = (o: Order) => {
    if (!currentCourse) return;
    const i = getSelectedCourseIndex(o);
    if (isSelectedCourseLast(o)) {
      const newCourse: OrderCourse = {
        id: uuidv4().toString(),
        items: [],
      };
      o.courses.push(newCourse);
      setCurrentCourse(newCourse);
      setOrder(o);
      debouncedSaveOrder(o);
    } else {
      setCurrentCourse(o.courses[i + 1]);
    }
  };

  const previousCourse = (o: Order) => {
    if (!currentCourse) return;
    const i = getSelectedCourseIndex(o);
    if (isSelectedCourseFirst(o)) {
      return;
    }
    setCurrentCourse(o.courses[i - 1]);
  };

  const getSelectedCourseIndex = (o: Order): number => {
    return o.courses.findIndex((x) => x.id === currentCourse?.id);
  };

  const isSelectedCourseFirst = (o: Order): boolean => {
    return o.courses[0].id === currentCourse?.id;
  };

  const isSelectedCourseLast = (o: Order): boolean => {
    return o.courses[o.courses.length - 1].id === currentCourse?.id;
  };

  const getCategoryById = (m: Menu, id: string): MenuCategory => {
    const a = m.categories.find((x) => x.id == id)!;
    return a;
  };

  const hasAtLeastOneCover = (o: Order): boolean => {
    return o.courses.some((c) => c.items.some((i) => i.menuItemId === '37023186-295f-4736-94a2-b0cb19dad8b2'));
  };

  const canEdit = () => {
    if (!table || table.close) {
      return false;
    }
    if (auth.getUserId() === table.userId) {
      return auth.hasPermissionTo('write-my-tables');
    } else {
      return auth.hasPermissionTo('write-other-tables');
    }
  };

  const isAnyModalOpen = () => {
    return (
      modals.reopenTable.isOpen ||
      modals.closeTable.isOpen ||
      modals.printOrder.isOpen ||
      modals.printCourse.isOpen ||
      modals.printBill.isOpen
    );
  };

  const onAddItemQuantity = (o: Order, id: string) => {
    if (!currentCourse) return;
    const updatedCourse = {
      ...currentCourse,
    };
    const index = updatedCourse.items.findIndex((i) => {
      return i.menuItemId == id && i.menuOptionId == null;
    });
    if (index == -1) {
      updatedCourse.items.push({
        menuItemId: id,
        quantity: 1,
      });
    } else {
      updatedCourse.items[index].quantity++;
    }
    setCurrentCourse(updatedCourse);
    const updatedOrder = { ...o };
    updatedOrder.courses = updatedOrder.courses.map((c) => {
      return c.id == updatedCourse.id ? updatedCourse : c;
    });
    setOrder(updatedOrder);
  };

  const onRemoveItemQuantity = (o: Order, id: string) => {
    if (!currentCourse) return;

    const updatedCourse = {
      ...currentCourse,
      items: currentCourse.items
        .map((item) => {
          if (item.menuItemId === id && item.menuOptionId == null && item.quantity > 0) {
            return {
              ...item,
              quantity: item.quantity - 1,
            };
          }
          return item;
        })
        .filter((x) => x.quantity > 0),
    };
    setCurrentCourse(updatedCourse);
    const updatedOrder = { ...o };
    updatedOrder.courses = updatedOrder.courses.map((c) => {
      return c.id == updatedCourse.id ? updatedCourse : c;
    });
    setOrder(updatedOrder);
  };

  const onAddOptionQuantity = (o: Order, itemId: string, optionId: string) => {
    if (!currentCourse) return;
    const updatedCourse = {
      ...currentCourse,
    };
    const index = updatedCourse.items.findIndex((i) => {
      return i.menuItemId == itemId && i.menuOptionId == optionId;
    });
    if (index == -1) {
      updatedCourse.items.push({
        menuItemId: itemId,
        menuOptionId: optionId,
        quantity: 1,
      });
    } else {
      updatedCourse.items[index].quantity++;
    }
    setCurrentCourse(updatedCourse);
    const updatedOrder = { ...o };
    updatedOrder.courses = updatedOrder.courses.map((c) => {
      return c.id == updatedCourse.id ? updatedCourse : c;
    });
    setOrder(updatedOrder);
  };

  const onRemoveOptionQuantity = (o: Order, itemId: string, optionId: string) => {
    if (!currentCourse) return;

    const updatedCourse = {
      ...currentCourse,
      items: currentCourse.items
        .map((item) => {
          if (item.menuItemId === itemId && item.menuOptionId == optionId && item.quantity > 0) {
            return {
              ...item,
              quantity: item.quantity - 1,
            };
          }
          return item;
        })
        .filter((x) => x.quantity > 0),
    };
    setCurrentCourse(updatedCourse);
    const updatedOrder = { ...o };
    updatedOrder.courses = updatedOrder.courses.map((c) => {
      return c.id == updatedCourse.id ? updatedCourse : c;
    });
    setOrder(updatedOrder);
  };

  const onItemNoteChange = (o: Order, itemId: string, note: string) => {
    if (!currentCourse) return;
    const updatedCourse = {
      ...currentCourse,
    };
    const index = updatedCourse.items.findIndex((i) => {
      return i.menuItemId == itemId && i.menuOptionId == null;
    });
    if (index == -1) {
      updatedCourse.items.push({
        menuItemId: itemId,
        quantity: 0,
        note: note,
      });
    } else {
      updatedCourse.items[index].note = note || undefined;
    }
    setCurrentCourse(updatedCourse);
    const updatedOrder = { ...o };
    updatedOrder.courses = updatedOrder.courses.map((c) => {
      return c.id == updatedCourse.id ? updatedCourse : c;
    });
    setOrder(updatedOrder);
  };

  const onOptionNoteChange = (o: Order, itemId: string, optionId: string, note: string) => {
    if (!currentCourse) return;
    const updatedCourse = {
      ...currentCourse,
    };
    const index = updatedCourse.items.findIndex((i) => {
      return i.menuItemId == itemId && i.menuOptionId == optionId;
    });
    if (index == -1) {
      updatedCourse.items.push({
        menuItemId: itemId,
        menuOptionId: optionId,
        quantity: 0,
        note: note,
      });
    } else {
      updatedCourse.items[index].note = note || undefined;
    }
    setCurrentCourse(updatedCourse);
    const updatedOrder = { ...o };
    updatedOrder.courses = updatedOrder.courses.map((c) => {
      return c.id == updatedCourse.id ? updatedCourse : c;
    });
    setOrder(updatedOrder);
  };

  const onAddCustomItem = (o: Order, i: MenuItem) => {
    if (!menu) return;
    const updatedMenu = {
      ...menu,
    };
    const categoryIndex = updatedMenu.categories.findIndex((x) => i.menuCategoryId == x.id);
    if (categoryIndex >= 0) {
      // Set empty options by default for custom items
      i['options'] = [];
      updatedMenu.categories[categoryIndex].items.push(i);
      setMenu(updatedMenu);
    }
    onAddItemQuantity(o, i.id);
  };

  // Content
  return (
    <AuthGuard>
      <Layout>
        {!isPageLoaded && (
          <Grid.Col span={12}>
            <Flex wrap="nowrap" w={'100%'} gap={10}>
              <PageTitle title="..." backLink={isTargetOutside() ? '/takeaway' : '/tables'} />
            </Flex>
            <Group mt={75} justify="center" align="center">
              <Loader type="dots" />
            </Group>
          </Grid.Col>
        )}
        {isPageLoaded && table && order && menu && currentCategory && currentCourse && (
          <>
            <Grid.Col span={12}>
              <Flex wrap="nowrap" w={'100%'} gap={10}>
                <PageTitle
                  title={table.name}
                  backLink={isTargetOutside() ? '/takeaway' : '/tables'}
                  actions={getOrderActions(auth, t, table, (code: string) => {
                    onMenuActionClick(code);
                  })}
                  alert={
                    table.inside && !table.close && !hasAtLeastOneCover(order)
                      ? {
                          color: 'orange',
                          ta: 'center',
                          children: (
                            <Text fw={600} size="lg">
                              {t('rememberAlert')}
                            </Text>
                          ),
                        }
                      : undefined
                  }
                />
              </Flex>
            </Grid.Col>

            {table.close && (
              <Grid.Col span={12}>
                <Alert ta={'center'}>
                  <Text fz={20}>
                    {t(table.paymentMethod || '')}: <b>{orderFinalPrice(order, menu).toFixed(2)}€</b>
                  </Text>
                </Alert>
              </Grid.Col>
            )}
            <Grid.Col span={12}>
              <SegmentedControl
                size="lg"
                fullWidth
                value={currentCategory.id}
                className={classes.segmentRoot}
                onChange={(value) => setCurrentCategory(getCategoryById(menu, value))}
                data={categories.map((c) => {
                  return {
                    label: c.titleDisplay,
                    value: c.id,
                  };
                })}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <StackList>
                {currentCategory.items.map((menuItem, index) => {
                  return (
                    <OrderItemComponent
                      key={`menu_item_${index}`}
                      menuItem={menuItem}
                      orderCourse={currentCourse}
                      expandedItem={expandedMenuItem}
                      onExpanded={setExpandedMenuItem}
                      canEdit={canEdit()}
                      onAddItemQuantity={(itemId) => onAddItemQuantity(order, itemId)}
                      onRemoveItemQuantity={(itemId) => onRemoveItemQuantity(order, itemId)}
                      onAddOptionQuantity={(itemId, optionId) => onAddOptionQuantity(order, itemId, optionId)}
                      onRemoveOptionQuantity={(itemId, optionId) => onRemoveOptionQuantity(order, itemId, optionId)}
                      onItemNoteChange={(itemId, note) => onItemNoteChange(order, itemId, note)}
                      onOptionNoteChange={(itemId, optionId, note) => onOptionNoteChange(order, itemId, optionId, note)}
                      ref={(el: HTMLElement | null) => {
                        itemsRef.current[menuItem.id] = el;
                      }}
                    />
                  );
                })}
                {canEdit() && <OrderCustomItemComponent onClick={onCustomItemClick} />}
              </StackList>
            </Grid.Col>
            {!isAnyModalOpen() && !isTargetOutside() && (
              <OrderCourseNavigationComponent
                isPreviousVisible={!isSelectedCourseFirst(order)}
                onPreviousClick={() => previousCourse(order)}
                currentValue={getSelectedCourseIndex(order) + 1}
                isNextVisible={!isSelectedCourseLast(order) || !table.close}
                onNextClick={() => nextCourse(order)}
                isNextNew={isSelectedCourseLast(order) && !table.close}
              />
            )}
            <Modal
              centered
              withCloseButton
              opened={modals.reopenTable.isOpen}
              onClose={modals.reopenTable.close}
              title={`${t('tableTable').toUpperCase()} ${table.name}`}
            >
              {modals.reopenTable.isOpen && (
                <ModalReopenTable
                  table={table}
                  onClick={(t) => {
                    setTable(t);
                    modals.reopenTable.close();
                  }}
                />
              )}
            </Modal>
            <Modal
              centered
              withCloseButton
              opened={modals.closeTable.isOpen}
              onClose={modals.closeTable.close}
              title={`${t('tableTable').toUpperCase()} ${table.name}`}
            >
              {modals.closeTable.isOpen && (
                <ModalCloseTable
                  table={table}
                  onClick={(t) => {
                    setTable(t);
                    modals.closeTable.close();
                  }}
                />
              )}
            </Modal>
            <Modal
              centered
              withCloseButton
              opened={modals.closeAndSendTable.isOpen}
              onClose={modals.closeAndSendTable.close}
              title={`${t('tableTable').toUpperCase()} ${table.name}`}
            >
              {modals.closeAndSendTable.isOpen && (
                <ModalCloseAndSendTable
                  table={table}
                  onClick={(t) => {
                    setTable(t);
                    modals.closeAndSendTable.close();
                  }}
                />
              )}
            </Modal>
            <Modal
              centered
              withCloseButton
              opened={modals.printOrder.isOpen}
              onClose={modals.printOrder.close}
              title={`${t('tableTable').toUpperCase()} ${table.name}`}
            >
              {modals.printOrder.isOpen && (
                <ModalPrintOrder
                  table={table}
                  menu={menu}
                  order={order}
                  onPrintDone={() => {
                    modals.printOrder.close();
                  }}
                />
              )}
            </Modal>
            <Modal
              centered
              withCloseButton
              opened={modals.printCourse.isOpen}
              onClose={modals.printCourse.close}
              title={`${t('tableTable').toUpperCase()} ${table.name}`}
            >
              {modals.printCourse.isOpen && (
                <ModalPrintOrder
                  table={table}
                  menu={menu}
                  course={currentCourse}
                  order={order}
                  onPrintDone={() => {
                    modals.printCourse.close();
                  }}
                />
              )}
            </Modal>
            <Modal
              centered
              withCloseButton
              opened={modals.printBill.isOpen}
              onClose={modals.printBill.close}
              title={`${t('tableTable').toUpperCase()} ${table.name}`}
            >
              {modals.printBill.isOpen && (
                <ModalPrintBill
                  table={table}
                  menu={menu}
                  order={order}
                  onPrintDone={() => {
                    modals.printBill.close();
                  }}
                />
              )}
            </Modal>
            <Modal
              centered
              withCloseButton
              opened={modals.newCustomItem.isOpen}
              onClose={modals.newCustomItem.close}
              title={t('addCustomItem').toUpperCase()}
            >
              {modals.newCustomItem.isOpen && (
                <OrderItemNewModalComponent
                  table={table}
                  menuCategory={currentCategory}
                  onAddCustomItem={(i) => {
                    modals.newCustomItem.close();
                    onAddCustomItem(order, i);
                  }}
                />
              )}
            </Modal>
          </>
        )}
      </Layout>
    </AuthGuard>
  );
}
