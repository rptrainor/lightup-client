import { createClient } from '@supabase/supabase-js'

import { addNotification } from '~/stores/notificationStore';

// Constants for environment variables
const PUBLIC_SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL;
const PUBLIC_SUPABASE_ANON_KEY = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

// Validate environment variables
if (!PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_ANON_KEY) {
  addNotification({
    type: 'error',
    header: 'It looks like something went wrong',
    subHeader: 'Please try again later.'
  })
  throw new Error('Missing Supabase environment variables. Make sure PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY are set.');
}

// Initialize Supabase client
export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: true,
  }
});