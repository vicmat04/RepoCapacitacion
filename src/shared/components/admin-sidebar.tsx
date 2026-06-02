"use client"

import { Home, FolderTree, Wrench, Settings, Globe, LogOut } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { logoutAction } from "@/features/auth/actions"
import { cn } from "@/shared/lib/utils"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarFooter,
} from "@/shared/ui/sidebar"

const navItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: Home,
  },
  {
    title: "Categorías",
    url: "/admin/categories",
    icon: FolderTree,
  },
  {
    title: "Herramientas",
    url: "/admin/tools",
    icon: Wrench,
  },
]

interface AdminSidebarProps {
  userEmail?: string
}

export function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight text-lg hover:opacity-80 transition-opacity">
          <span className="bg-primary text-primary-foreground rounded-md p-1">
            FC
          </span>
          Control Center
        </Link>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Administración</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url || pathname.startsWith(item.url + "/")}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Portal Público</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/">
                    <Globe />
                    <span>Ver Portal</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border">
        {userEmail && (
          <div className="rounded-lg bg-muted/60 px-3 py-2 mb-2">
            <p className="truncate text-xs font-medium text-foreground">
              {userEmail}
            </p>
            <p className="text-[10px] text-muted-foreground">Administrador</p>
          </div>
        )}
        <form action={logoutAction}>
          <button
            type="submit"
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm transition-all duration-150",
              "text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive"
            )}
            title="Cerrar sesión"
          >
            <LogOut className="h-4 w-4" />
            <span>Cerrar sesión</span>
          </button>
        </form>
      </SidebarFooter>
    </Sidebar>
  )
}
