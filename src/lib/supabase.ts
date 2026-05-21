import { createBrowserClient } from '@supabase/ssr'

let _client: ReturnType<typeof createBrowserClient> | null = null;

function getClient() {
  if (!_client) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase environment variables are missing. Supabase features will be disabled.');
      // Return a mock client that does nothing
      _client = createBrowserClient('', '') as any;
    } else {
      _client = createBrowserClient(supabaseUrl, supabaseAnonKey);
    }
  }
  return _client;
}

// Proxy ensures the client is never created at module-import time (build-safe)
export const supabase = new Proxy({} as ReturnType<typeof createBrowserClient>, {
  get(_target, prop) {
    return (getClient() as any)[prop];
  }
});
