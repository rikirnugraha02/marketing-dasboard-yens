import { createClient } from '@supabase/supabase-js';

// Retrieve credentials from Vite env or user localStorage override
const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const localUrl = typeof window !== 'undefined' ? localStorage.getItem('yens_supabase_url') : null;
const localKey = typeof window !== 'undefined' ? localStorage.getItem('yens_supabase_key') : null;

export const supabaseUrl = localUrl || envUrl || '';
export const supabaseAnonKey = localKey || envKey || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('your-project-id')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: true },
      realtime: { params: { eventsPerSecond: 10 } }
    })
  : null;

export const saveSupabaseConfig = (url, key) => {
  if (url && key) {
    localStorage.setItem('yens_supabase_url', url.trim());
    localStorage.setItem('yens_supabase_key', key.trim());
    window.location.reload();
  }
};

export const clearSupabaseConfig = () => {
  localStorage.removeItem('yens_supabase_url');
  localStorage.removeItem('yens_supabase_key');
  window.location.reload();
};
