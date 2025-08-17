

export type TPlan = {
  name: string;
  description?: string;
  heading?:string;
  price: number;
  stripePriceId?: string;
  services: string[];
  freeTrialDays?: number;
  bestValue?: boolean;
  subscription?: boolean;
  billingInterval?: 'week' | 'month' | 'year';
  oneTimePayment?: boolean;
};
