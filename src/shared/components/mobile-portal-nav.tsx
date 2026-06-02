"use client"

import { useState, useCallback, useTransition } from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Menu, Home, Search, Grid, Settings, LogIn } from "lucide-react"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/sheet"
import { Button } from "@/shared/ui/button"
import { SidebarNavContent, type SidebarItem } from "@/shared/components/portal-sidebar"
import { ROUTES } from "@/shared/lib/constants"
import { cn } from "@/shared/lib/utils"
import type { Category } from "@/shared/lib/supabase/types"

type MobilePortalNavProps = {
  categories: Category[]
  isAuthenticated: boolean
}

/**
 * Navegación móvil del Portal (Paso C)
 * 
 * Responsabilidades:
 * - Hamburger Header (top) que abre el Sheet con las categorías.
 * - Sheet (Drawer) lateral izquierdo que reusa SidebarNavContent.
 * - Bottom Navigation bar anclada al fondo de la pantalla (iOS safe area).
 * - Oculta en pantallas sm+ (≥768px).
 */
export function MobilePortalNav({ categories, isAuthenticated }: MobilePortalNavProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()
  
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const activeSlug = searchParams.get("category") ?? null

  const items: SidebarItem[] = [
    { slug: null, name: "Todas", icon: "Layers" },
    ...categories.map((cat) => ({ slug: cat.slug, name: cat.name, icon: cat.icon })),
  ]

  // Navegar y cerrar el Sheet automáticamente
  const selectCategory = useCallback(
    (slug: string | null) => {
      const params = new URLSearchParams(searchParams.toString())
      if (slug) {
        params.set("category", slug)
      } else {
        params.delete("category")
      }
      const qs = params.toString()
      
      setIsSheetOpen(false) // Cerrar drawer
      
      startTransition(() => {
        router.replace(qs ? `/?${qs}` : "/", { scroll: false })
      })
    },
    [router, searchParams]
  )

  // 4 íconos para la Bottom Navigation
  const navItems = [
    { label: "Inicio", icon: Home, href: ROUTES.HOME, isActive: pathname === ROUTES.HOME && !activeSlug },
    { label: "Categorías", icon: Grid, isSheetTrigger: true },
    { label: "Buscar", icon: Search, onClick: () => {
        // Disparar evento para que el SearchBar abra el Dialog fullscreen
        window.dispatchEvent(new Event("open-mobile-search"))
      }
    },
    isAuthenticated
      ? { label: "Admin", icon: Settings, href: ROUTES.ADMIN, isActive: pathname.startsWith(ROUTES.ADMIN) }
      : { label: "Ingresar", icon: LogIn, href: ROUTES.LOGIN, isActive: pathname === ROUTES.LOGIN },
  ]

  return (
    <>
      {/* HEADER MÓVIL (Top) */}
      <div className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md sm:hidden">
        <div className="flex items-center gap-2">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="-ml-2 shrink-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menú de categorías</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85vw] max-w-sm flex flex-col p-0">
              <SheetHeader className="border-b border-border p-4 text-left">
                <SheetTitle className="text-lg font-bold">Categorías</SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto px-2 py-4">
                <SidebarNavContent
                  items={items}
                  activeSlug={activeSlug}
                  onSelect={selectCategory}
                />
              </div>
            </SheetContent>
          </Sheet>
          
          <span className="font-semibold tracking-tight text-foreground">
            Control Center
          </span>
        </div>
      </div>

      {/* BOTTOM NAVIGATION (Bottom) */}
      <nav className="fixed inset-x-0 bottom-0 z-40 flex h-14 items-center justify-around border-t border-border bg-background pb-safe sm:hidden">
        {navItems.map((item, i) => {
          const Icon = item.icon
          const isActive = item.isActive

          if (item.isSheetTrigger) {
            return (
              <button
                key={i}
                type="button"
                onClick={() => setIsSheetOpen(true)}
                className={cn(
                  "flex h-full flex-1 flex-col items-center justify-center gap-1 text-muted-foreground transition-colors hover:text-foreground",
                  activeSlug && "text-primary"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] font-medium leading-none">{item.label}</span>
              </button>
            )
          }

          if (item.onClick) {
             return (
              <button
                key={i}
                type="button"
                onClick={item.onClick}
                className="flex h-full flex-1 flex-col items-center justify-center gap-1 text-muted-foreground transition-colors hover:text-foreground"
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] font-medium leading-none">{item.label}</span>
              </button>
            )
          }

          return (
            <Link
              key={i}
              href={item.href!}
              className={cn(
                "flex h-full flex-1 flex-col items-center justify-center gap-1 transition-colors hover:text-foreground",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
