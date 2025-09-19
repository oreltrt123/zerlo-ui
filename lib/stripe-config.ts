export const STRIPE_PLANS = {
  basic: {
    name: "Basic Plan",
    credits: 10,
    price: 1000, // $9.99 in cents
    priceId: "price_1S0SIoG2lPfNB7xgevflHbFm",
  },
  premium: {
    name: "Premium Plan",
    credits: 30,
    price: 2000, // $19.99 in cents
    priceId: "price_1S8puKG2lPfNB7xgoaAEiyN8",
  },
} as const

export type StripePlan = keyof typeof STRIPE_PLANS
