import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-08-01",
  appInfo: {
    // For sample support and debugging, not required for production:
    name: "vegan",
    url: "https://github.com/test",
    version: "0.0.1",
  },
  typescript: true,
});
