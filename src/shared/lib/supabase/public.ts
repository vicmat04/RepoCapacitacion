import { createClient } from "@supabase/supabase-js"

/**
 * Cliente Supabase público — ISR-safe.
 *
 * Usa @supabase/supabase-js directamente, sin cookies() ni createServerClient().
 * Seguro dentro de unstable_cache() porque no toca ninguna Dynamic API.
 *
 * Seguridad: usa anon key — RLS garantiza que solo se lean registros is_active = true.
 * NO usar para operaciones que requieran sesión autenticada → usar server.ts.
 *
 * TAD §6 — Authentication Strategy
 */
export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        // Sin persistencia de sesión — cliente stateless para ISR
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  )
}
