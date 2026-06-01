import type { Metadata } from "next"
import { getActiveCategories } from "@/features/categories/queries"
import { PortalContent } from "@/features/tools/components/portal-content"

export const metadata: Metadata = {
  title: "Facilitadores Control Center",
  description:
    "Hub centralizado de herramientas operativas para facilitadores de Infoplazas AIP. Acceso rápido a todas las herramientas desde un único punto de entrada.",
}

/**
 * Portal público — Server Component.
 * Obtiene datos cacheados (ISR 1h) y los pasa al Client Component.
 * SDD §1 — Tool Catalog
 */
export default async function PortalPage() {
  const categories = await getActiveCategories()

  return (
    <main className="min-h-screen bg-background px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <header className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            🎓 Facilitadores Control Center
          </h1>
          <p className="text-sm text-muted-foreground">
            Todas tus herramientas operativas en un solo lugar
          </p>
        </header>

        {/* Contenido interactivo (Client Component) */}
        <PortalContent categories={categories} />
      </div>
    </main>
  )
}
