import { MenuItem } from '@entities/menuItem';
import { MenuOption } from '@entities/menuOption';
import { OrderCourse } from '@entities/orderCourse';
import { Badge, Button, TextInput } from '@mantine/core';
import { useDebouncedValue, useLongPress } from '@mantine/hooks';
import { IconChevronDown, IconChevronUp, IconMinus, IconPlus } from '@tabler/icons-react';
import { forwardRef, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { OrderOptionComponent } from './OrderOptionComponent';

export interface OrderItemComponentProps {
  menuItem: MenuItem;
  orderCourse: OrderCourse;
  canEdit: boolean;
  expandedItem: MenuItem | null;
  onAddItemQuantity: (itemId: string) => void;
  onAddOptionQuantity: (itemId: string, optionId: string) => void;
  onRemoveItemQuantity: (itemId: string) => void;
  onRemoveOptionQuantity: (itemId: string, optionId: string) => void;
  onExpanded: (menuItem: MenuItem | null) => void;
  onItemNoteChange: (itemId: string, note: string) => void;
  onOptionNoteChange: (itemId: string, optionId: string, note: string) => void;
}

function OrderItemComponentFunc(
  {
    menuItem,
    orderCourse,
    canEdit,
    expandedItem,
    onAddItemQuantity,
    onAddOptionQuantity,
    onRemoveItemQuantity,
    onRemoveOptionQuantity,
    onExpanded,
    onItemNoteChange,
    onOptionNoteChange,
  }: OrderItemComponentProps,
  ref: React.Ref<HTMLElement>
) {
  const { t } = useTranslation();
  const [showItemNote, setShowItemNote] = useState(false);
  const longPressItemHandler = useLongPress(
    () => {
      if (getOrderItemQuantity() == 0) setShowItemNote(false);
      else if (getOrderItemNote() != '') setShowItemNote(true);
      else setShowItemNote(!showItemNote);
    },
    { threshold: 300 }
  );

  const hasOptions = () => {
    return menuItem.options.length > 0;
  };

  const getOrderItem = useCallback(() => {
    return orderCourse.items.find((x) => x.menuItemId == menuItem.id);
  }, [orderCourse.items, menuItem.id]);

  const getOrderItemQuantity = () => {
    const item = getOrderItem();
    if (!item) return 0;
    return item.quantity;
  };

  const getOrderItemNote = () => {
    const item = getOrderItem();
    if (!item) return '';
    return item.note || '';
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

  useEffect(() => {
    if (expandedItem?.id !== menuItem.id) {
      setExpanded(false);
    }
  }, [expandedItem, menuItem.id]);

  useEffect(() => {
    const item = getOrderItem();
    setShowItemNote(!!item?.note);
  }, [menuItem.id, getOrderItem]);

  const [isExpanded, setExpanded] = useState(false);

  const [localNote, setLocalNote] = useState(() => getOrderItemNote());
  const [debouncedNote] = useDebouncedValue(localNote, 300);

  useEffect(() => {
    setLocalNote(getOrderItemNote());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderCourse, menuItem.id]); // intentional: reset only when switching items, not on every orderCourse update

  useEffect(() => {
    if (debouncedNote === getOrderItemNote()) return;
    onItemNoteChange(menuItem.id, debouncedNote);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedNote]); // intentional: menuItem.id in closure is current at debounce settle time

  return (
    (menuItem.active || getOrderItem()) && (
      <>
        {!hasOptions() && (
          <>
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
                  <Button
                    component="div"
                    variant="filled"
                    bg={'var(--mantine-primary-color-7)'}
                    onClick={() => onAddItemQuantity(menuItem.id)}
                  >
                    <IconPlus color="var(--mantine-color-white)" />
                  </Button>
                )
              }
              bd={'1px solid var(--mantine-color-dark-1)'}
              c="var(--mantine-color-text)"
              fz={15}
              fw={600}
              {...longPressItemHandler}
            >
              {menuItem.titleDisplay}
              {getOrderItemQuantity() > 0 && (
                <Badge ml={10} size="lg" color="red" variant="outline" circle>
                  {getOrderItemQuantity()}
                </Badge>
              )}
            </Button>
            {showItemNote && (
              <TextInput
                autoComplete="off"
                size="md"
                styles={{
                  input: {
                    color: 'var(--mantine-color-dark-4)',
                  },
                }}
                placeholder={t('notePlaceholder')}
                value={localNote}
                onChange={(e) => setLocalNote(e.currentTarget.value.toUpperCase())}
              />
            )}
          </>
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
              {menuItem.titleDisplay}
              {!isExpanded && getOrderItemTotalQuantity(menuItem.id) > 0 && (
                <Badge ml={10} size="lg" color="red" variant="outline" circle>
                  {getOrderItemTotalQuantity(menuItem.id)}
                </Badge>
              )}
            </Button>

            {isExpanded && (
              <>
                {menuItem.options
                  .filter((o) => {
                    return o.active || getOrderItemByOption(o);
                  })
                  .map((option, index) => (
                    <OrderOptionComponent
                      key={option.id}
                      orderCourse={orderCourse}
                      option={option}
                      menuItemId={menuItem.id}
                      canEdit={canEdit}
                      isLast={index + 1 === menuItem.options.length}
                      onAddOptionQuantity={onAddOptionQuantity}
                      onRemoveOptionQuantity={onRemoveOptionQuantity}
                      onOptionNoteChange={onOptionNoteChange}
                    />
                  ))}
              </>
            )}
          </>
        )}
      </>
    )
  );
}

export const OrderItemComponent = forwardRef(OrderItemComponentFunc);
