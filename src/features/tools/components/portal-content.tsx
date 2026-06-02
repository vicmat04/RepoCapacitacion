"use client"

import { useMemo, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { SearchBar } from "@/features/search/components/search-bar"
import { CategoryFilter } from "@/features/categories/components/category-filter"
import { ToolCard } from "@/features/tools/components/tool-card"
import { EmptyState } from "@/shared/components/empty-state"
import type { CategoryWithTools } from "@/shared/lib/supabase/types"

type PortalContentProps = {
  categories: CategoryWithTools[]
}

/**
 * Orquestador del portal — Client Component.
 *
 * Source of truth: URL query params.
 *   ?search=<text>
 *   ?category=<slug>
 *   ?search=<text>&category=<slug>
 *
 * Cambios de filtro usan router.replace() para:
 *   - No agregar entradas innecesarias al historial.
 *   - Preservar scroll position.
 *   - Sentirse instantáneo (sin full reload).
 *
 * SDD §1, §2
 */
export function PortalContent({ categories }: PortalContentProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // ─── Source of truth desde la URL ────────────────────────────────────────
  const searchQuery = searchParams.get("search") ?? ""
  const activeSlug = searchParams.get("category") ?? null

  // ─── Helpers para mutar la URL sin full reload ─────────────────────────
  const buildUrl = useCallback(
    (overrides: { search?: string; category?: string | null }) => {
      const params = new URLSearchParams(searchParams.toString())

      const search = "search" in overrides ? overrides.search : searchQuery
      const category = "category" in overrides ? overrides.category : activeSlug

      if (search) {
        params.set("search", search)
      } else {
        params.delete("search")
      }

      if (category) {
        params.set("category", category)
      } else {
        params.delete("category")
      }

      const qs = params.toString()
      return qs ? `/?${qs}` : "/"
    },
    [searchParams, searchQuery, activeSlug]
  )

  const handleSearch = useCallback(
    (value: string) => {
      router.replace(buildUrl({ search: value }), { scroll: false })
    },
    [router, buildUrl]
  )

  const handleCategorySelect = useCallback(
    (slug: string | null) => {
      router.replace(buildUrl({ category: slug }), { scroll: false })
    },
    [router, buildUrl]
  )

  // ─── Lógica de filtrado (idéntica a FASE 2) ────────────────────────────
  const filterCategories = useMemo(
    () => categories.filter((c) => c.tools.length > 0),
    [categories]
  )

  const filteredCategories = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()

    return categories
      .filter((cat) => {
        if (activeSlug !== null && cat.slug !== activeSlug) return false

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
          onChange={handleSearch}
          placeholder="Buscar herramienta..."
        />
        {/* CategoryFilter visible solo en mobile — en sm+ el sidebar cubre esta función */}
        <div className="sm:hidden">
          <CategoryFilter
            categories={filterCategories}
            activeSlug={activeSlug}
            onSelect={handleCategorySelect}
          />
        </div>
      </div>

      {/* Resultados */}
      {filteredCategories.length === 0 || totalTools === 0 ? (
        <EmptyState
          className="py-20"
          icon={
            <div className="mb-4 text-4xl" aria-hidden="true">
              🔍
            </div>
          }
          title={
            searchQuery
              ? `Sin resultados para "${searchQuery}"`
              : "No hay herramientas disponibles"
          }
          description={
            searchQuery
              ? "Probá con otro término de búsqueda"
              : "El catálogo estará disponible pronto"
          }
        />
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
