import { Suspense } from "react"
import { cookies } from "next/headers"
import { getActiveCategories } from "@/features/categories/queries"
import { createClient } from "@/shared/lib/supabase/server"
import { PortalSidebar } from "@/shared/components/portal-sidebar"
import { MobilePortalNav } from "@/shared/components/mobile-portal-nav"
import { Skeleton } from "@/shared/ui/skeleton"

/**
 * Layout del portal público.
 *
 * Responsabilidades:
 * - Shell de 2 columnas: Sidebar | Contenido
 * - Lee cookie `portal_sidebar_collapsed` SSR → sin parpadeo al cargar
 * - Sidebar solo visible en sm+ (768px). En mobile, usa MobilePortalNav.
 * - Fetch de categorías propio (para el sidebar) — no duplica el de page.tsx
 *   porque Next.js deduplica fetch() automáticamente en el mismo render.
 * - SSR session check → pasa isAuthenticated + userEmail a navegación
 *
 * FASE 5 — 5.1, 5.2, 5.3, 5.11
 */
export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const sidebarCookie = cookieStore.get("portal_sidebar_collapsed")
  const defaultCollapsed = sidebarCookie?.value === "true"

  // Fetch deduplicado con el de page.tsx (mismo cache key)
  const categories = await getActiveCategories()
  // Solo mostrar categorías que tienen herramientas
  const sidebarCategories = categories
    .filter((c) => c.tools.length > 0)
    .map(({ id, name, slug, icon, display_order, is_active, created_at, updated_at }) => ({
      id, name, slug, icon, display_order, is_active, created_at, updated_at,
    }))

  // SSR session check — usa la cookie de sesión del request, sin round-trip adicional
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isAuthenticated = !!user
  const userEmail = user?.email

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-background">
      {/* Navegación Móvil (Header con Hamburger + Bottom Nav) — Oculto en sm+ */}
      <Suspense fallback={null}>
        <MobilePortalNav
          categories={sidebarCategories}
          isAuthenticated={isAuthenticated}
        />
      </Suspense>

      {/* Sidebar — solo desktop (sm+) */}
      <div className="hidden sm:flex sm:flex-shrink-0">
        <Suspense
          fallback={
            <div className="flex w-56 flex-col gap-2 border-r border-border p-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-9 w-full rounded-lg" />
              ))}
            </div>
          }
        >
          <PortalSidebar
            categories={sidebarCategories}
            defaultCollapsed={defaultCollapsed}
            isAuthenticated={isAuthenticated}
            userEmail={userEmail}
          />
        </Suspense>
      </div>

      {/* Contenido principal */}
      <div className="flex flex-1 flex-col overflow-y-auto pb-14 sm:pb-0 relative">
        {children}
      </div>
    </div>
  )
}

