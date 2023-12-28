/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
interface ImportMetaEnv {
  readonly PUBLIC_SUPABASE_URL_DEV: string
  readonly PUBLIC_SUPABASE_ANON_KEY_DEV: string
  readonly PUBLIC_SUPABASE_URL_PROD: string
  readonly PUBLIC_SUPABASE_ANON_KEY_PROD: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}