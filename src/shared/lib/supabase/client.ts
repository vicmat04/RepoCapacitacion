"use client"

import { createBrowserClient } from "@supabase/ssr"

/**
 * Cliente Supabase para Client Components.
 * Singleton por convención — no crear múltiples instancias.
 * TAD §6 — Authentication Strategy
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
