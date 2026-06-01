"use client"

import { cn } from "@/shared/lib/utils"
import type { Category } from "@/shared/lib/supabase/types"

type CategoryFilterProps = {
  categories: Category[]
  activeSlug: string | null
  onSelect: (slug: string | null) => void
}

/**
 * Filtro de categorías — tabs horizontales scrolleables.
 * "Todas" = null slug.
 * SDD §1.5 — Filtro por categoría
 */
export function CategoryFilter({
  categories,
  activeSlug,
  onSelect,
}: CategoryFilterProps) {
  return (
    <nav
      aria-label="Filtrar por categoría"
      className="flex gap-2 overflow-x-auto pb-1 scrollbar-none"
    >
      {/* Tab "Todas" */}
      <button
        type="button"
        onClick={() => onSelect(null)}
        aria-pressed={activeSlug === null}
        className={cn(
          "shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          activeSlug === null
            ? "bg-primary text-primary-foreground shadow-sm"
            : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
        )}
      >
        Todas
      </button>

      {/* Tabs por categoría */}
      {categories.map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => onSelect(cat.slug)}
          aria-pressed={activeSlug === cat.slug}
          className={cn(
            "shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
            activeSlug === cat.slug
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
          )}
        >
          {cat.name}
        </button>
      ))}
    </nav>
  )
}
