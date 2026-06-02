import type { Metadata } from "next"
import { Suspense } from "react"
import { getActiveCategories } from "@/features/categories/queries"
import { PortalContent } from "@/features/tools/components/portal-content"
import { Skeleton } from "@/shared/ui/skeleton"

export const metadata: Metadata = {
  title: "Facilitadores Control Center",
  description:
    "Hub centralizado de herramientas operativas para facilitadores de Infoplazas AIP. Acceso rápido a todas las herramientas desde un único punto de entrada.",
}

/**
 * Portal público — Server Component.
 * El layout (layout.tsx) ya provee el shell con sidebar.
 * Esta página se encarga del header + contenido del catálogo.
 * PortalContent usa useSearchParams() → requiere Suspense boundary.
 * SDD §1 — Tool Catalog
 */
export default async function PortalPage() {
  const categories = await getActiveCategories()

  return (
    <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Header del portal */}
        <header className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            🎓 Facilitadores Control Center
          </h1>
          <p className="text-sm text-muted-foreground">
            Todas tus herramientas operativas en un solo lugar
          </p>
        </header>

        {/* Suspense requerido por useSearchParams() en PortalContent */}
        <Suspense fallback={<PortalSkeleton />}>
          <PortalContent categories={categories} />
        </Suspense>
      </div>
    </main>
  )
}

function PortalSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-10 w-full max-w-md" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
    </div>
  )
}
