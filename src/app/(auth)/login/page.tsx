import type { Metadata } from "next"
import { LoginForm } from "@/features/auth/components/login-form"

export const metadata: Metadata = {
  title: "Ingresar",
  description: "Acceso al panel de administración del Facilitadores Control Center",
  robots: { index: false, follow: false },
}

/**
 * Página de login — Server Component.
 * La protección (redirect si ya hay sesión) está en middleware.ts.
 * SDD §4.1 — Login Page
 */
export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Header */}
        <div className="space-y-2 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
            <span className="text-2xl">🎓</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Control Center
          </h1>
          <p className="text-sm text-muted-foreground">
            Ingresá con tu cuenta de administrador
          </p>
        </div>

        {/* Card */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <LoginForm />
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          Infoplazas AIP — Acceso restringido a personal autorizado
        </p>
      </div>
    </main>
  )
}
