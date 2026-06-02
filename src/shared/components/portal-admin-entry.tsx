import Link from "next/link"
import { LogIn, LayoutDashboard, LogOut } from "lucide-react"

import { logoutAction } from "@/features/auth/actions"
import { ROUTES } from "@/shared/lib/constants"
import { cn } from "@/shared/lib/utils"

interface PortalAdminEntryProps {
  isAuthenticated: boolean
  /** Email del usuario autenticado (undefined si no hay sesión) */
  userEmail?: string
  isCollapsed?: boolean
}

/**
 * Entrada al área de administración en el sidebar del portal.
 *
 * - Sin sesión → CTA "Iniciar sesión" → /login
 * - Con sesión → email del usuario + acceso a /admin + logout
 *
 * Server Component puro: el logout usa <form action> sin JS en cliente.
 * FASE 5 — 5.11 (Auth-Gated Navigation)
 */
export function PortalAdminEntry({
  isAuthenticated,
  userEmail,
  isCollapsed = false,
}: PortalAdminEntryProps) {
  if (!isAuthenticated) {
    return (
      <div className="p-2">
        <Link
          href={ROUTES.LOGIN}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm transition-all duration-150",
            "text-muted-foreground hover:bg-accent hover:text-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            isCollapsed && "justify-center px-0"
          )}
          title="Iniciar sesión"
        >
          <span className="flex size-5 shrink-0 items-center justify-center">
            <LogIn className="size-4" aria-hidden="true" />
          </span>
          {!isCollapsed && <span className="truncate">Iniciar sesión</span>}
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-1 p-2">
      {/* Identidad del usuario autenticado */}
      {!isCollapsed && userEmail && (
        <div className="rounded-lg bg-muted/60 px-2 py-2">
          <p className="truncate text-xs font-medium text-foreground">
            {userEmail}
          </p>
          <p className="text-[10px] text-muted-foreground">Administrador</p>
        </div>
      )}

      {/* Acceso al panel */}
      <Link
        href={ROUTES.ADMIN}
        className={cn(
          "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm transition-all duration-150",
          "text-muted-foreground hover:bg-accent hover:text-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          isCollapsed && "justify-center px-0"
        )}
        title="Ir al panel de administración"
      >
        <span className="flex size-5 shrink-0 items-center justify-center">
          <LayoutDashboard className="size-4" aria-hidden="true" />
        </span>
        {!isCollapsed && <span className="truncate">Administración</span>}
      </Link>

      {/* Logout — Server Action vía form, sin JS en cliente */}
      <form action={logoutAction}>
        <button
          type="submit"
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm transition-all duration-150",
            "text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive",
            isCollapsed && "justify-center px-0"
          )}
          title="Cerrar sesión"
        >
          <span className="flex size-5 shrink-0 items-center justify-center">
            <LogOut className="size-4" aria-hidden="true" />
          </span>
          {!isCollapsed && <span className="truncate">Cerrar sesión</span>}
        </button>
      </form>
    </div>
  )
}
