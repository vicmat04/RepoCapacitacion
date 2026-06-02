"use client"

import { useState, useEffect } from "react"
import { Skeleton } from "@/shared/ui/skeleton"

interface ToolPreviewProps {
  url: string
}

/**
 * Componente cliente que consulta nuestra API interna para obtener
 * la imagen OpenGraph de una URL externa.
 * 
 * Si falla, no tiene imagen o está cargando, maneja esos estados
 * visualmente para que la tarjeta nunca se rompa.
 */
export function ToolPreview({ url }: ToolPreviewProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function fetchMetadata() {
      try {
        const res = await fetch(`/api/metadata?url=${encodeURIComponent(url)}`)
        if (!res.ok) throw new Error("Failed to fetch")
        
        const data = await res.json()
        if (isMounted) {
          if (data.imageUrl) {
            setImageUrl(data.imageUrl)
          } else {
            setHasError(true)
          }
        }
      } catch (err) {
        if (isMounted) setHasError(true)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    fetchMetadata()

    return () => {
      isMounted = false
    }
  }, [url])

  if (isLoading) {
    return <Skeleton className="h-full w-full rounded-none" />
  }

  if (hasError || !imageUrl) {
    // Fallback: el diseño original de la caja con el clip
    return (
      <div className="flex h-full w-full items-center justify-center bg-primary/5 transition-colors duration-300 group-hover:bg-primary/10">
        <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20 transition-colors duration-300 group-hover:bg-primary/20 group-hover:ring-primary/40">
          <span className="text-2xl" aria-hidden="true">
            🔗
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden bg-white/5 p-4">
      {/* 
        Usamos <img> estándar en lugar de next/image porque los dominios son dinámicos 
        y no podemos agregarlos todos a next.config.ts por adelantado.
      */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt="Vista previa del sitio web"
        className="h-full w-full object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-105"
        onError={() => setHasError(true)}
        loading="lazy"
      />
    </div>
  )
}
