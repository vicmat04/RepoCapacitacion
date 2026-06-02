import { Metadata } from "next"
import Link from "next/link"
import { Folder, Wrench } from "lucide-react"

import { getCategoriesCount } from "@/features/categories/queries"
import { getToolsCount } from "@/features/tools/queries"
import { ROUTES } from "@/shared/lib/constants"
import { Button } from "@/shared/ui/button"

export const metadata: Metadata = {
  title: "Dashboard | Control Center",
  description: "Vista general del panel de administración",
}

export default async function AdminDashboardPage() {
  const [categoriesCount, toolsCount] = await Promise.all([
    getCategoriesCount(),
    getToolsCount(),
  ])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Bienvenido al Control Center. Aquí puedes gestionar el contenido del portal.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Categories Card */}
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total de Categorías</h3>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">{categoriesCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Agrupaciones para tus herramientas
            </p>
            <div className="mt-4">
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href={ROUTES.ADMIN_CATEGORIES}>Administrar</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Tools Card */}
        <div className="rounded-xl border bg-card text-card-foreground shadow">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Total de Herramientas</h3>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">{toolsCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Herramientas disponibles en el portal
            </p>
            <div className="mt-4">
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href={ROUTES.ADMIN_TOOLS}>Administrar</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
