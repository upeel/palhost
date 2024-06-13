interface Product {
  id: number;
  name: string;
  price: string;
  period: number;
}

interface Instance {
  client_token: string;
  id: number;
}

interface Order {
  id: number;
  instance: Instance;
  region: string;
  product: Product;
}

interface User {
  id: number;
  stripe_id: string;
}

export type Invoice = {
  id: number;
  invoice_no: string;
  date_for_human: string;
  invoice_date: string;
  due_date_for_human: string;
  due_date: string;
  product_desc: string;
  total_for_human: string;
  sub_total_for_human: string;
  subtotal: number;
  tax: number;
  total: number;
  status: number;
  status_in_string: string;
  order: Order;
  user: User;
};
