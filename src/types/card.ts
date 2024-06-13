export type Address = {
    city?: string;
    country?: string;
    line1?: string;
    line2?: string;
    postal_code?: number;
    state?: string;
};

export type BillingDetails = {
    address?: Address;
    email?: string;
    name?: string;
    phone?: string;
};

export type Card = {
    id: number;
    brand: string;
    country: string;
    exp_month: number;
    exp_year: number;
    fingerprint: string;
    funding: string;
    billing_details: BillingDetails;
  };
  