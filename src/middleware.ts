import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import { ROUTES } from "@/shared/lib/constants"

/**
 * Middleware de autenticación — TAD §6, §7
 *
 * Responsabilidades:
 * 1. Refrescar cookies de sesión Supabase en cada request
 * 2. Proteger /admin/* — redirige a /login si no hay sesión
 * 3. Redirigir /login → /admin si ya hay sesión activa
 */
export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANTE: no llamar supabase.auth.getSession() desde middleware.
  // getUser() valida el JWT contra el servidor — más seguro.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Rutas protegidas: /admin y cualquier subruta
  const isAdminRoute = pathname.startsWith("/admin")

  // Si intenta acceder a /admin sin sesión → redirige a /login
  if (isAdminRoute && !user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = ROUTES.LOGIN
    loginUrl.searchParams.set("redirectTo", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Si ya tiene sesión e intenta ir a /login → redirige a /admin
  if (pathname === ROUTES.LOGIN && user) {
    const adminUrl = request.nextUrl.clone()
    adminUrl.pathname = ROUTES.ADMIN
    return NextResponse.redirect(adminUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Ejecutar en todas las rutas EXCEPTO:
     * - _next/static (archivos estáticos)
     * - _next/image (optimización de imágenes)
     * - favicon.ico
     * - Archivos con extensión (png, jpg, svg, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
