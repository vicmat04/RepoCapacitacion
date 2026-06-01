import { ExternalLink } from "lucide-react"
import type { Tool } from "@/shared/lib/supabase/types"

type ToolCardProps = {
  tool: Tool
}

/**
 * Tarjeta de herramienta para el portal público.
 * Design: glassmorphism dark card con glow en hover.
 * SDD §1 — Tool Catalog
 */
export function ToolCard({ tool }: ToolCardProps) {
  return (
    <a
      href={tool.url}
      target={tool.opens_new_tab ? "_blank" : "_self"}
      rel={tool.opens_new_tab ? "noopener noreferrer" : undefined}
      aria-label={`Abrir ${tool.name}${tool.opens_new_tab ? " (nueva pestaña)" : ""}`}
      className="group relative flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_32px_-4px_hsl(217_91%_60%_/_0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {/* Glow gradient en hover */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      {/* Header: ícono + external link */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20 transition-colors duration-300 group-hover:bg-primary/15 group-hover:ring-primary/30">
          <span className="text-lg" aria-hidden="true">
            🔗
          </span>
        </div>
        <ExternalLink
          className="size-4 shrink-0 text-muted-foreground opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:text-primary"
          aria-hidden="true"
        />
      </div>

      {/* Contenido */}
      <div className="space-y-1">
        <h3 className="text-sm font-semibold leading-tight text-foreground transition-colors duration-200 group-hover:text-primary">
          {tool.name}
        </h3>
        {tool.description && (
          <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {tool.description}
          </p>
        )}
      </div>
    </a>
  )
}
