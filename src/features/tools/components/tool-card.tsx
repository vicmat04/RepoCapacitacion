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
      
      {/* Icono de link externo flotando arriba a la derecha */}
      <div className="absolute right-2 top-2 z-20 rounded-md bg-background/80 p-1.5 text-muted-foreground backdrop-blur-md opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:text-primary group-hover:bg-background">
        <ExternalLink className="size-3.5" aria-hidden="true" />
      </div>

      <ToolPreview 
        url={tool.url} 
        fallbackName={tool.name} 
        fallbackDescription={tool.description} 
      />
    </a>
  )
}
