export type PaymentMethod = {
  id: string;
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
  is_default: boolean;
  type: string;
  stripe_payment_method_id: string;
};
