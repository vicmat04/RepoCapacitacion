import { ExternalLink } from "lucide-react"
import { ToolPreview } from "./tool-preview"
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
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_32px_-4px_hsl(217_91%_60%_/_0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {/* Glow gradient en hover */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      {/* Área de la imagen de portada */}
      <div className="relative h-32 sm:h-40 w-full shrink-0 border-b border-border">
        <ToolPreview url={tool.url} />
        
        {/* Icono de link externo flotando arriba a la derecha */}
        <div className="absolute right-3 top-3 z-20 rounded-md bg-background/80 p-1.5 text-muted-foreground backdrop-blur-md opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:text-primary group-hover:bg-background">
          <ExternalLink className="size-4" aria-hidden="true" />
        </div>
      </div>

      {/* Contenido (Textos) */}
      <div className="flex flex-col gap-1.5 p-5 z-20">
        <h3 className="text-base font-semibold leading-tight text-foreground transition-colors duration-200 group-hover:text-primary">
          {tool.name}
        </h3>
        {tool.description && (
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {tool.description}
          </p>
        )}
      </div>
    </a>
  )
}
