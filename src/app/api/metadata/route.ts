import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const targetUrl = searchParams.get("url")

  if (!targetUrl) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 })
  }

  try {
    // Simulamos un navegador estándar para que los servidores no nos bloqueen por ser un bot genérico
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept": "text/html"
      },
      // Caché de Next.js: guardamos el resultado por 24 horas (86400 segundos)
      next: { revalidate: 86400 } 
    })

    if (!response.ok) {
      return NextResponse.json({ imageUrl: null })
    }

    const html = await response.text()
    
    // Buscar og:image (Facebook/OpenGraph) o twitter:image
    const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["'][^>]*>/i)
      || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["'][^>]*>/i)
      || html.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["'][^>]*>/i)

    let imageUrl = ogImageMatch ? ogImageMatch[1] : null

    // Si la imagen es una ruta relativa (ej. /images/cover.jpg), la convertimos en absoluta
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
    // Si falla el fetch (ej. timeout o red bloqueada), simplemente no devolvemos imagen
    return NextResponse.json({ imageUrl: null })
  }
}
