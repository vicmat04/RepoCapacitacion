"use client"

import { useState, useTransition, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import * as LucideIcons from "lucide-react"
import { ChevronLeft, ChevronRight, Layers } from "lucide-react"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/ui/tooltip"
import { cn } from "@/shared/lib/utils"
import type { Category } from "@/shared/lib/supabase/types"

// ─── Constantes ─────────────────────────────────────────────────────────────
const COOKIE_KEY = "portal_sidebar_collapsed"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 año

// ─── Tipos ──────────────────────────────────────────────────────────────────
export type SidebarItem = {
  slug: string | null
  name: string
  icon: string
}

type PortalSidebarProps = {
  categories: Category[]
  defaultCollapsed: boolean
}

// ─── Helpers ────────────────────────────────────────────────────────────────
/** Resuelve el componente Lucide por nombre; fallback a Layers */
export function CategoryIcon({ name }: { name: string }) {
  const Icon = (LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>)[name]
  if (!Icon) return <Layers className="size-4" aria-hidden="true" />
  return <Icon className="size-4" aria-hidden="true" />
}

function persistCollapsed(collapsed: boolean) {
  document.cookie = `${COOKIE_KEY}=${collapsed}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`
}

// ─── SidebarNavContent — compartido con el Sheet mobile ─────────────────────
/**
 * Lista de categorías navegables.
 * Exportado para ser reutilizado dentro del Sheet mobile (Paso C).
 * NO tiene estado propio — recibe todo por props.
 */
export function SidebarNavContent({
  items,
  activeSlug,
  onSelect,
  showText = true,
  isCollapsed = false,
}: {
  items: SidebarItem[]
  activeSlug: string | null
  onSelect: (slug: string | null) => void
  showText?: boolean
  isCollapsed?: boolean
}) {
  return (
    <nav
      role="tablist"
      aria-label="Filtrar por categoría"
      className="flex flex-1 flex-col gap-1 overflow-y-auto p-2"
    >
      {items.map(({ slug, name, icon }) => {
        const isActive = slug === activeSlug

        const button = (
          <button
            key={slug ?? "all"}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(slug)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm transition-all duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              isActive
                ? "bg-primary/15 text-primary font-medium ring-1 ring-primary/30"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
              isCollapsed && "justify-center px-0"
            )}
          >
            <span
              className={cn(
                "flex size-5 shrink-0 items-center justify-center",
                isActive && "text-primary"
              )}
            >
              <CategoryIcon name={icon} />
            </span>
            {showText && <span className="truncate">{name}</span>}
          </button>
        )

        if (isCollapsed) {
          return (
            <Tooltip key={slug ?? "all"}>
              <TooltipTrigger asChild>{button}</TooltipTrigger>
              <TooltipContent side="right">{name}</TooltipContent>
            </Tooltip>
          )
        }

        return <div key={slug ?? "all"}>{button}</div>
      })}
    </nav>
  )
}

// ─── PortalSidebar — sidebar desktop colapsable ─────────────────────────────
/**
 * Sidebar del portal público (desktop ≥768px).
 *
 * - Colapso/expansión con ease-out 200ms
 * - Persistencia del estado en cookie (leída SSR en layout sin parpadeo)
 * - Tooltips en modo colapsado
 * - Sincronización con ?category=<slug>
 *
 * FASE 5 — 5.1
 */
export function PortalSidebar({ categories, defaultCollapsed }: PortalSidebarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)

  const activeSlug = searchParams.get("category") ?? null

  const items: SidebarItem[] = [
    { slug: null, name: "Todas", icon: "Layers" },
    ...categories.map((cat) => ({ slug: cat.slug, name: cat.name, icon: cat.icon })),
  ]

  const selectCategory = useCallback(
    (slug: string | null) => {
      const params = new URLSearchParams(searchParams.toString())
      if (slug) { params.set("category", slug) } else { params.delete("category") }
      const qs = params.toString()
      startTransition(() => {
        router.replace(qs ? `/?${qs}` : "/", { scroll: false })
      })
    },
    [router, searchParams]
  )

  const toggleCollapsed = useCallback(() => {
    setIsCollapsed((prev) => {
      const next = !prev
      persistCollapsed(next)
      return next
    })
  }, [])

  return (
    <aside
      data-collapsed={isCollapsed}
      aria-expanded={!isCollapsed}
      aria-label="Navegación de categorías"
      className={cn(
        "relative flex h-full flex-col border-r border-border bg-card/50 backdrop-blur-sm",
        "transition-[width] duration-200 ease-out",
        isCollapsed ? "w-14" : "w-56"
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "flex h-14 shrink-0 items-center border-b border-border px-3",
          isCollapsed ? "justify-center" : "justify-between"
        )}
      >
        {!isCollapsed && (
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Categorías
          </span>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={toggleCollapsed}
              aria-label={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
              className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {isCollapsed ? (
                <ChevronRight className="size-4" />
              ) : (
                <ChevronLeft className="size-4" />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">
            {isCollapsed ? "Expandir" : "Colapsar"}
          </TooltipContent>
        </Tooltip>
      </div>

      <SidebarNavContent
        items={items}
        activeSlug={activeSlug}
        onSelect={selectCategory}
        showText={!isCollapsed}
        isCollapsed={isCollapsed}
      />
    </aside>
  )
}
