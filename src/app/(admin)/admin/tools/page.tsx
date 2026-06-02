import { Metadata } from "next"
import Link from "next/link"
import { Wrench, Plus } from "lucide-react"

import { getAllTools } from "@/features/tools/queries"
import { ToolTable } from "@/features/tools/components/tool-table"
import { ROUTES } from "@/shared/lib/constants"
import { Button } from "@/shared/ui/button"
import { EmptyState } from "@/shared/components/empty-state"

export const metadata: Metadata = {
  title: "Administrar Herramientas | Control Center",
  description: "Gestión de herramientas del panel de control",
}

export default async function AdminToolsPage() {
  const tools = await getAllTools()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Herramientas</h1>
          <p className="text-muted-foreground mt-1">
            Gestioná las herramientas que estarán disponibles en el portal.
          </p>
        </div>
        <Button asChild>
          <Link href={ROUTES.ADMIN_TOOLS_NEW}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Herramienta
          </Link>
        </Button>
      </div>

      {tools.length === 0 ? (
        <EmptyState
          className="p-12 border rounded-lg bg-muted/20"
          icon={<Wrench className="h-12 w-12 text-muted-foreground/50" />}
          title="No hay herramientas registradas"
          description="Comenzá creando tu primera herramienta. Asegurate de tener al menos una categoría creada."
          action={
            <Button asChild>
              <Link href={ROUTES.ADMIN_TOOLS_NEW}>
                <Plus className="mr-2 h-4 w-4" />
                Crear Herramienta
              </Link>
            </Button>
          }
        />
      ) : (
        <ToolTable tools={tools} />
      )}
    </div>
  )
}
