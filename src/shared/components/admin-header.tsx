"use client"

import { usePathname } from "next/navigation"
import React from "react"
import Link from "next/link"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/ui/breadcrumb"
import { SidebarTrigger } from "@/shared/ui/sidebar"
import { Separator } from "@/shared/ui/separator"

export function AdminHeader() {
  const pathname = usePathname()
  
  // Generar breadcrumbs simples basados en el pathname
  const paths = pathname.split("/").filter(Boolean)
  
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-6" />
      
      <Breadcrumb className="hidden sm:flex">
        <BreadcrumbList>
          {paths.map((path, index) => {
            const href = `/${paths.slice(0, index + 1).join("/")}`
            const isLast = index === paths.length - 1
            const label = path.charAt(0).toUpperCase() + path.slice(1)

            return (
              <React.Fragment key={path}>
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={href}>{label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </React.Fragment>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  )
}
