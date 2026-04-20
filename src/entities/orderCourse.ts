export type OrderItem = {
  menuItemId: string;
  menuOptionId?: string;
  quantity: number;
  note?: string;
};

export type OrderCourse = {
  id: string;
  items: OrderItem[];
};
