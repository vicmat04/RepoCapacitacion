"use client"

import { useState, useMemo } from "react"
import { SearchBar } from "@/features/search/components/search-bar"
import { CategoryFilter } from "@/features/categories/components/category-filter"
import { ToolCard } from "@/features/tools/components/tool-card"
import type { CategoryWithTools } from "@/shared/lib/supabase/types"

type PortalContentProps = {
  categories: CategoryWithTools[]
}

/**
 * Orquestador del portal — Client Component.
 * Recibe datos del Server Component y maneja:
 * - Estado de búsqueda (text filter)
 * - Estado de categoría activa (slug filter)
 * - Lógica de filtrado combinada (memoizada)
 * SDD §1, §2
 */
export function PortalContent({ categories }: PortalContentProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeSlug, setActiveSlug] = useState<string | null>(null)

  // Categorías para el filtro (solo las que tienen herramientas activas)
  const filterCategories = useMemo(
    () => categories.filter((c) => c.tools.length > 0),
    [categories]
  )

  // Datos filtrados: aplica categoría + búsqueda
  const filteredCategories = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()

    return categories
      .filter((cat) => {
        // Filtro por categoría
        if (activeSlug !== null && cat.slug !== activeSlug) return false

        // Si hay búsqueda, la categoría aplica si alguna tool matchea
        if (query) {
          return cat.tools.some(
            (t) =>
              t.name.toLowerCase().includes(query) ||
              t.description?.toLowerCase().includes(query)
          )
        }

        return cat.tools.length > 0
      })
      .map((cat) => ({
        ...cat,
        tools: query
          ? cat.tools.filter(
              (t) =>
                t.name.toLowerCase().includes(query) ||
                t.description?.toLowerCase().includes(query)
            )
          : cat.tools,
      }))
  }, [categories, activeSlug, searchQuery])

  const totalTools = filteredCategories.reduce(
    (acc, cat) => acc + cat.tools.length,
    0
  )

  return (
    <div className="space-y-8">
      {/* Controles: Search + Category filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Buscar herramienta..."
        />
        <CategoryFilter
          categories={filterCategories}
          activeSlug={activeSlug}
          onSelect={setActiveSlug}
        />
      </div>

      {/* Resultados */}
      {filteredCategories.length === 0 || totalTools === 0 ? (
        <EmptyState query={searchQuery} />
      ) : (
        <div className="space-y-10">
          {filteredCategories.map((cat) =>
            cat.tools.length === 0 ? null : (
              <section key={cat.id} aria-labelledby={`cat-${cat.slug}`}>
                {/* Encabezado de categoría */}
                <div className="mb-4 flex items-center gap-2">
                  <h2
                    id={`cat-${cat.slug}`}
                    className="text-sm font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    {cat.name}
                  </h2>
                  <div className="h-px flex-1 bg-border" aria-hidden="true" />
                  <span className="text-xs text-muted-foreground">
                    {cat.tools.length}
                  </span>
                </div>

                {/* Grid de herramientas */}
                <ul
                  className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  role="list"
                >
                  {cat.tools.map((tool) => (
                    <li key={tool.id}>
                      <ToolCard tool={tool} />
                    </li>
                  ))}
                </ul>
              </section>
            )
          )}
        </div>
      )}
    </div>
  )
}

function EmptyState({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 text-4xl" aria-hidden="true">
        🔍
      </div>
      <p className="text-base font-medium text-foreground">
        {query ? `Sin resultados para "${query}"` : "No hay herramientas disponibles"}
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        {query
          ? "Probá con otro término de búsqueda"
          : "El catálogo estará disponible pronto"}
      </p>
    </div>
  )
}
