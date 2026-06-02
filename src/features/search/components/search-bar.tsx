"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X, ArrowLeft } from "lucide-react"

import { cn } from "@/shared/lib/utils"
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/shared/ui/dialog"
import { Button } from "@/shared/ui/button"

type SearchBarProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

/**
 * Barra de búsqueda para el portal.
 * - Desktop (sm+): Barra de búsqueda expandida.
 * - Mobile (<sm): Botón de lupa que abre un buscador fullscreen (FASE 5).
 * 
 * SDD §2 — Search feature
 */
export function SearchBar({
  value,
  onChange,
  placeholder = "Buscar herramienta...",
}: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-focus en el input al abrir el dialog en mobile
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // Escuchar un evento personalizado para abrir desde la Bottom Nav
  useEffect(() => {
    const handleOpenSearch = () => setIsOpen(true)
    window.addEventListener("open-mobile-search", handleOpenSearch)
    return () => window.removeEventListener("open-mobile-search", handleOpenSearch)
  }, [])

  return (
    <>
      {/* ── DESKTOP (sm+) ── */}
      <div className="relative hidden w-full max-w-md sm:block">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          type="search"
          role="searchbox"
          aria-label="Buscar herramientas"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-border bg-secondary py-2.5 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Limpiar búsqueda"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* ── MOBILE (<sm) ── */}
      <div className="sm:hidden">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "rounded-full bg-secondary text-muted-foreground",
                value && "border-primary text-primary" // Resaltar si hay filtro activo
              )}
              aria-label="Abrir búsqueda"
            >
              <Search className="size-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="block h-dvh max-w-full p-0 sm:hidden" showCloseButton={false}>
            {/* Header del buscador mobile */}
            <div className="flex h-14 items-center gap-2 border-b border-border bg-background px-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="shrink-0 text-muted-foreground"
                aria-label="Cerrar búsqueda"
              >
                <ArrowLeft className="size-5" />
              </Button>
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="search"
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder={placeholder}
                  className="h-10 w-full rounded-md border-0 bg-transparent px-2 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0"
                />
                {value && (
                  <button
                    type="button"
                    onClick={() => {
                      onChange("")
                      inputRef.current?.focus()
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground"
                    aria-label="Limpiar búsqueda"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>
            </div>
            
            {/* Ocultar el DialogTitle para la accesibilidad sin mostrarlo */}
            <DialogTitle className="sr-only">Búsqueda de herramientas</DialogTitle>

            {/* Espacio para sugerencias futuras o estado vacío */}
            <div className="p-4 text-center text-sm text-muted-foreground mt-10">
              {value ? "Escribe para ver resultados..." : "Ingresa un término de búsqueda."}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
