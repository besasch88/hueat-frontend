import { MenuOption } from '@entities/menuOption';
import { OrderCourse } from '@entities/orderCourse';
import { Badge, Box, Button, TextInput } from '@mantine/core';
import { useLongPress } from '@mantine/hooks';
import { IconMinus, IconPlus } from '@tabler/icons-react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface OrderOptionComponentProps {
  orderCourse: OrderCourse;
  option: MenuOption;
  menuItemId: string;
  canEdit: boolean;
  isLast: boolean;
  onAddOptionQuantity: (itemId: string, optionId: string) => void;
  onRemoveOptionQuantity: (itemId: string, optionId: string) => void;
  onOptionNoteChange: (itemId: string, optionId: string, note: string) => void;
}

export function OrderOptionComponent({
  orderCourse,
  option,
  menuItemId,
  canEdit,
  isLast,
  onAddOptionQuantity,
  onRemoveOptionQuantity,
  onOptionNoteChange,
}: OrderOptionComponentProps) {
  const { t } = useTranslation();
  const [showItemNote, setShowItemNote] = useState(false);

  const getOrderItemByOption = useCallback(
    (o: MenuOption) => {
      return orderCourse.items.find((x) => x.menuOptionId == o.id);
    },
    [orderCourse.items]
  );

  const getOrderItemByOptionQuantity = () => {
    const item = getOrderItemByOption(option);
    if (!item) return 0;
    return item.quantity;
  };

  const getOrderItemByOptionNote = () => {
    const item = getOrderItemByOption(option);
    if (!item) return '';
    return item.note || '';
  };

  const longPressItemHandler = useLongPress(
    () => {
      if (getOrderItemByOptionQuantity() == 0) setShowItemNote(false);
      else if (getOrderItemByOptionNote() != '') setShowItemNote(true);
      else setShowItemNote(!showItemNote);
    },
    { threshold: 300 }
  );

  useEffect(() => {
    const item = getOrderItemByOption(option);
    setShowItemNote(!!item?.note);
  }, [option, getOrderItemByOption]);

  return (
    <Box>
      <Button
        fullWidth
        size="lg"
        p={5}
        bg={'white'}
        variant="filled"
        td={option.active ? '' : 'line-through'}
        mb={isLast ? 'xl' : ''}
        justify={canEdit ? 'space-between' : ''}
        color={canEdit ? 'var(--aimm-bg-paper)' : 'var(--mantine-color-white)'}
        leftSection={
          canEdit && (
            <Button
              component="div"
              variant="filled"
              onClick={() => {
                if (getOrderItemByOptionQuantity() > 0) {
                  onRemoveOptionQuantity(menuItemId, option.id);
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
                onAddOptionQuantity(menuItemId, option.id);
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
        {...longPressItemHandler}
      >
        {option.titleDisplay}
        {getOrderItemByOptionQuantity() > 0 && (
          <Badge ml={10} size="lg" color="red" variant="outline" circle>
            {getOrderItemByOptionQuantity()}
          </Badge>
        )}
      </Button>
      {showItemNote && (
        <TextInput
          autoComplete="off"
          size="md"
          mt={8}
          styles={{
            input: {
              color: 'var(--mantine-color-dark-4)',
            },
          }}
          placeholder={t('notePlaceholder')}
          value={getOrderItemByOptionNote()}
          onChange={(e) => {
            onOptionNoteChange(menuItemId, option.id, e.currentTarget.value.toUpperCase());
          }}
        />
      )}
    </Box>
  );
}
