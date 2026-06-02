"use client"

import { useState, useEffect } from "react"
import { Skeleton } from "@/shared/ui/skeleton"

interface ToolPreviewProps {
  url: string
  fallbackName?: string | null
  fallbackDescription?: string | null
}

interface Metadata {
  imageUrl: string | null
  title: string | null
  description: string | null
}

export function ToolPreview({ url, fallbackName, fallbackDescription }: ToolPreviewProps) {
  const [metadata, setMetadata] = useState<Metadata | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Extraer el host para mostrarlo tipo "whatsapp"
  let domain = ""
  try {
    domain = new URL(url).hostname.replace("www.", "")
  } catch (e) {
    domain = url
  }

  useEffect(() => {
    let isMounted = true

    async function fetchMetadata() {
      try {
        const res = await fetch(`/api/metadata?url=${encodeURIComponent(url)}`)
        if (!res.ok) throw new Error("Failed to fetch")
        
        const data = await res.json()
        if (isMounted) {
          setMetadata(data)
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

  const title = metadata?.title || fallbackName || "Enlace"
  const description = metadata?.description || fallbackDescription

  if (isLoading) {
    return (
      <div className="flex w-full min-h-[100px] h-full">
        <div className="w-[100px] shrink-0">
          <Skeleton className="h-full w-full rounded-none" />
        </div>
        <div className="flex flex-col gap-2 p-3 w-full justify-center">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex w-full min-h-[100px] h-full bg-card z-20">
      {/* Columna Izquierda: Imagen */}
      <div className="w-[100px] shrink-0 border-r border-border bg-white/5 flex items-center justify-center p-2 sm:p-3">
        {metadata?.imageUrl && !hasError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={metadata.imageUrl}
            alt={title}
            className="max-h-[80px] max-w-full object-contain drop-shadow-md transition-transform duration-500 group-hover:scale-105"
            onError={() => setHasError(true)}
            loading="lazy"
          />
        ) : (
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/20 transition-colors duration-300 group-hover:bg-primary/20 group-hover:ring-primary/40">
            <span className="text-xl" aria-hidden="true">🔗</span>
          </div>
        )}
      </div>

      {/* Columna Derecha: Textos (Título, Desc, Dominio) */}
      <div className="flex flex-col justify-center gap-1 p-3 sm:p-4 overflow-hidden w-full">
        <h3 className="text-[14px] font-semibold leading-tight text-foreground transition-colors duration-200 group-hover:text-primary line-clamp-3">
          {title}
        </h3>
        {description && (
          <p className="line-clamp-3 text-[11.5px] leading-snug text-muted-foreground">
            {description}
          </p>
        )}
        <span className="mt-1 text-[10px] font-medium text-muted-foreground/60 line-clamp-1 break-all uppercase tracking-wider">
          {domain}
        </span>
      </div>
    </div>
  )
}
