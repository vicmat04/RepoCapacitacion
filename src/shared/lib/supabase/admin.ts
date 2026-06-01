import { createClient } from "@supabase/supabase-js"

/**
 * Cliente Supabase con service_role key.
 * PELIGRO: bypasea completamente RLS.
 * SOLO usar en Server Actions que requieran permisos admin.
 * NUNCA importar desde Client Components.
 * TAD §11 — Environment Variables (CAUTION)
 */
export function createAdminClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY no está configurada")
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
