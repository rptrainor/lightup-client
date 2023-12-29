/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
interface ImportMetaEnv {
  readonly PUBLIC_SUPABASE_URL_DEV: string
  readonly PUBLIC_SUPABASE_ANON_KEY_DEV: string
  readonly PUBLIC_SUPABASE_URL_PROD: string
  readonly PUBLIC_SUPABASE_ANON_KEY_PROD: string
  readonly PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST: string
  readonly PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE: string
  readonly STRIPE_SECRET_KEY_TEST: string
  readonly STRIPE_SECRET_KEY_LIVE: string
  readonly PUBLIC_STRIPE_PRICE_ID_TEST: string
  readonly PUBLIC_STRIPE_PRICE_ID_LIVE: string
  readonly PUBLIC_STRIPE_SUBSCRIPTION_PRICE_ID_TEST: string
  readonly PUBLIC_STRIPE_SUBSCRIPTION_PRICE_ID_LIVE: string
  readonly PUBLIC_STRIPE_CUSTOMER_PORTAL_LINK_TEST: string
  readonly PUBLIC_STRIPE_CUSTOMER_PORTAL_LINK_LIVE: string
  readonly PUBLIC_DOMAIN_DEV: string
  readonly PUBLIC_DOMAIN_PROD: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}