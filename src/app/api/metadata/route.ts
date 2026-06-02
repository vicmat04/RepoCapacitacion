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
    
    // 1. Imagen
    let imageUrl = 
      $('meta[property="og:image"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content') ||
      $('meta[itemprop="image"]').attr('content')

    if (!imageUrl) {
      imageUrl = 
        $('link[rel="apple-touch-icon"]').attr('href') ||
        $('link[rel="apple-touch-icon-precomposed"]').attr('href') ||
        $('link[rel="icon"][sizes="512x512"]').attr('href') ||
        $('link[rel="icon"]').last().attr('href') ||
        $('link[rel="shortcut icon"]').attr('href')
    }

    if (imageUrl && !imageUrl.startsWith("http")) {
      const urlObj = new URL(targetUrl)
      if (imageUrl.startsWith("/")) {
        imageUrl = `${urlObj.origin}${imageUrl}`
      } else {
        imageUrl = `${urlObj.origin}/${imageUrl}`
      }
    }

    // 2. Título
    const title = 
      $('meta[property="og:title"]').attr('content') ||
      $('meta[name="twitter:title"]').attr('content') ||
      $('title').text() ||
      null

    // 3. Descripción
    const description = 
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="twitter:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      null

    return NextResponse.json({ imageUrl, title, description })
  } catch (error) {
    return NextResponse.json({ imageUrl: null, title: null, description: null })
  }
}
