export interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
}

export interface Address {
  firstName: string;
  lastName: string;
  street: string;
  zipCode: string;
  city: string;
  phone: string;
  deliveryChoiceId: string;
}

export interface OrderItem {
  _id: string;
  name: string;
  quantity: number;
  price: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  createdAt: string;
  shippingDate: string;
  deliveryStatus?: boolean;
  address: Address;
  items: OrderItem[];
  paymentType: string;
  status: { label: string };
}
