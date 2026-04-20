import { MenuItem } from '@entities/menuItem';
import { MenuOption } from '@entities/menuOption';
import { OrderCourse } from '@entities/orderCourse';
import { Badge, Button } from '@mantine/core';
import { IconChevronDown, IconChevronUp, IconMinus, IconPlus } from '@tabler/icons-react';
import { forwardRef, useEffect, useState } from 'react';

export interface OrderComponentProps {
  menuItem: MenuItem;
  orderCourse: OrderCourse;
  canEdit: boolean;
  expandedItem: MenuItem | null;
  onAddItemQuantity: (itemId: string) => void;
  onAddOptionQuantity: (itemId: string, optionId: string) => void;
  onRemoveItemQuantity: (itemId: string) => void;
  onRemoveOptionQuantity: (itemId: string, optionId: string) => void;
  onExpanded: (menuItem: MenuItem | null) => void;
}

function OrderComponentFunc(
  {
    menuItem,
    orderCourse,
    canEdit,
    onAddItemQuantity,
    onAddOptionQuantity,
    onRemoveItemQuantity,
    onRemoveOptionQuantity,
    onExpanded,
    expandedItem,
  }: OrderComponentProps,
  ref: React.Ref<HTMLElement>
) {
  const hasOptions = () => {
    return menuItem.options.length > 0;
  };

  const getOrderItem = () => {
    return orderCourse.items.find((x) => x.menuItemId == menuItem.id);
  };

  const getOrderItemQuantity = () => {
    const item = getOrderItem();
    if (!item) return 0;
    return item.quantity;
  };

  const getOrderItemTotalQuantity = (menuItemId: string) => {
    return orderCourse.items.reduce((total, item) => {
      if (item.menuItemId == menuItemId && item.menuOptionId != null) {
        return total + item.quantity;
      }
      return total;
    }, 0);
  };

  const getOrderItemByOption = (o: MenuOption) => {
    return orderCourse.items.find((x) => x.menuOptionId == o.id);
  };

  const getOrderItemByOptionQuantity = (o: MenuOption) => {
    const item = getOrderItemByOption(o);
    if (!item) return 0;
    return item.quantity;
  };

  const calculateOptionTitle = (o: MenuOption, i: MenuItem) => {
    if (o.title !== i.title && o.title.startsWith(i.title)) {
      return o.title.slice(i.title.length).trim();
    }
    return o.title;
  };

  useEffect(() => {
    if (expandedItem?.id !== menuItem.id) {
      setExpanded(false);
    }
  }, [expandedItem, menuItem.id]);

  const [isExpanded, setExpanded] = useState(false);

  return (
    (menuItem.active || getOrderItem()) && (
      <>
        {!hasOptions() && (
          <Button
            ref={ref as React.Ref<HTMLButtonElement>}
            fullWidth
            size="lg"
            p={5}
            bg={'white'}
            variant="filled"
            justify={canEdit ? 'space-between' : ''}
            color={canEdit ? 'var(--aimm-bg-paper)' : 'var(--mantine-color-white)'}
            td={menuItem.active ? '' : 'line-through'}
            leftSection={
              canEdit && (
                <Button
                  component="div"
                  variant="filled"
                  onClick={() => {
                    if (getOrderItemQuantity() > 0) {
                      onRemoveItemQuantity(menuItem.id);
                    }
                  }}
                  color="var(--mantine-color-red-text)"
                >
                  <IconMinus color="var(--mantine-color-white)" />
                </Button>
              )
            }
            rightSection={
              canEdit && (
                <Button component="div" variant="filled" onClick={() => onAddItemQuantity(menuItem.id)}>
                  <IconPlus color="var(--mantine-color-white)" />
                </Button>
              )
            }
            bd={'1px solid var(--mantine-color-dark-1)'}
            c="var(--mantine-color-text)"
            fz={15}
            fw={600}
          >
            {menuItem.title}
            {getOrderItemQuantity() > 0 && (
              <Badge ml={10} size="lg" color="red" variant="outline" circle>
                {getOrderItemQuantity()}
              </Badge>
            )}
          </Button>
        )}
        {hasOptions() && (
          <>
            <Button
              ref={ref as React.Ref<HTMLButtonElement>}
              fullWidth
              size="lg"
              p={5}
              bg={'var(--aimm-bg-paper)'}
              variant="filled"
              color={'var(--aimm-bg-paper)'}
              bd={'1px solid var(--mantine-color-dark-1)'}
              c="var(--mantine-color-text)"
              td={menuItem.active ? '' : 'line-through'}
              rightSection={isExpanded ? <IconChevronUp /> : <IconChevronDown />}
              fz={15}
              fw={600}
              onClick={() => {
                if (!isExpanded) onExpanded(menuItem);
                if (isExpanded) onExpanded(null);
                setExpanded(!isExpanded);
              }}
            >
              {menuItem.title}
              {!isExpanded && getOrderItemTotalQuantity(menuItem.id) > 0 && (
                <Badge ml={10} size="lg" color="red" variant="outline" circle>
                  {getOrderItemTotalQuantity(menuItem.id)}
                </Badge>
              )}
            </Button>
            {isExpanded &&
              menuItem.options
                .filter((o) => {
                  return o.active || getOrderItemByOption(o);
                })
                .map((option, index) => (
                  <Button
                    key={`menu_option_${index}`}
                    fullWidth
                    size="lg"
                    p={5}
                    bg={'white'}
                    variant="filled"
                    td={option.active ? '' : 'line-through'}
                    mb={index + 1 === menuItem.options.length ? 'xl' : ''}
                    justify={canEdit ? 'space-between' : ''}
                    color={canEdit ? 'var(--aimm-bg-paper)' : 'var(--mantine-color-white)'}
                    leftSection={
                      canEdit && (
                        <Button
                          component="div"
                          variant="filled"
                          onClick={() => {
                            if (getOrderItemByOptionQuantity(option) > 0) {
                              onRemoveOptionQuantity(menuItem.id, option.id);
                            }
                          }}
                          color="var(--mantine-color-red-text)"
                        >
                          <IconMinus color="var(--mantine-color-white)" />
                        </Button>
                      )
                    }
                    rightSection={
                      canEdit && (
                        <Button
                          component="div"
                          variant="filled"
                          onClick={() => {
                            onAddOptionQuantity(menuItem.id, option.id);
                          }}
                        >
                          <IconPlus color="var(--mantine-color-white)" />
                        </Button>
                      )
                    }
                    bd={'1px solid var(--mantine-color-dark-1)'}
                    c="var(--mantine-color-text)"
                    fz={15}
                    fw={300}
                  >
                    {calculateOptionTitle(option, menuItem)}
                    {getOrderItemByOptionQuantity(option) > 0 && (
                      <Badge ml={10} size="lg" color="red" variant="outline" circle>
                        {getOrderItemByOptionQuantity(option)}
                      </Badge>
                    )}
                  </Button>
                ))}
          </>
        )}
      </>
    )
  );
}

export const OrderComponent = forwardRef(OrderComponentFunc);
