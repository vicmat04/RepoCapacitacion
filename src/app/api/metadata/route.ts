import { NextResponse } from "next/server"
import * as cheerio from "cheerio"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const targetUrl = searchParams.get("url")

  if (!targetUrl) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 })
  }

  try {
    // Simulamos un navegador estándar para que los servidores no nos bloqueen
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      },
      // Caché de Next.js: guardamos el resultado por 24 horas (86400 segundos)
      next: { revalidate: 86400 } 
    })

    if (!response.ok) {
      return NextResponse.json({ imageUrl: null })
    }

    const html = await response.text()
    const $ = cheerio.load(html)
    
    // 1. Prioridad principal: og:image o twitter:image
    let imageUrl = 
      $('meta[property="og:image"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content') ||
      $('meta[itemprop="image"]').attr('content')

    // 2. Si no hay metadatos sociales, emulamos WhatsApp y buscamos íconos (favicon / apple-touch-icon)
    if (!imageUrl) {
      imageUrl = 
        $('link[rel="apple-touch-icon"]').attr('href') ||
        $('link[rel="apple-touch-icon-precomposed"]').attr('href') ||
        $('link[rel="icon"][sizes="512x512"]').attr('href') ||
        $('link[rel="icon"]').last().attr('href') ||
        $('link[rel="shortcut icon"]').attr('href')
    }

    // Convertir rutas relativas a absolutas
    if (imageUrl && !imageUrl.startsWith("http")) {
      const urlObj = new URL(targetUrl)
      if (imageUrl.startsWith("/")) {
        imageUrl = `${urlObj.origin}${imageUrl}`
      } else {
        imageUrl = `${urlObj.origin}/${imageUrl}`
      }
    }

    return NextResponse.json({ imageUrl })
  } catch (error) {
    // Si falla el fetch, simplemente no devolvemos imagen
    return NextResponse.json({ imageUrl: null })
  }
}
