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
    <main className="flex-1 px-6 py-10 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl space-y-10">
        {/* Header del portal */}
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            🎓 Facilitadores Control Center
          </h1>
          <p className="text-base text-muted-foreground">
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
    <div className="space-y-10">
      <Skeleton className="h-12 w-full max-w-md" />
      <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
    </div>
  )
}
