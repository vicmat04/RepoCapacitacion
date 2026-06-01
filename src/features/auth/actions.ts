"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/shared/lib/supabase/server"
import { loginSchema, type LoginFormValues } from "./login-schema"
import { ROUTES } from "@/shared/lib/constants"

export type LoginActionState = {
  error?: string
  fieldErrors?: Partial<Record<keyof LoginFormValues, string[]>>
}

/**
 * Server Action: login con email/password.
 * TAD §6 — Authentication Strategy
 * SDD §4 — Admin Auth feature
 */
export async function loginAction(
  _prevState: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  // Validación con Zod
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  }

  const parsed = loginSchema.safeParse(raw)

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error) {
    // No revelar si el email existe o no — mensaje genérico
    return {
      error: "Credenciales incorrectas. Verificá tu email y contraseña.",
    }
  }

  // Éxito: redirigir al panel admin
  // redirect() lanza un error internamente — no wrappear en try/catch
  redirect(ROUTES.ADMIN)
}

/**
 * Server Action: logout.
 */
export async function logoutAction(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect(ROUTES.LOGIN)
}
