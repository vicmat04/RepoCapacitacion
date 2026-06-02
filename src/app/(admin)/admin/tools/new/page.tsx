import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { ToolForm } from "@/features/tools/components/tool-form"
import { getActiveCategories } from "@/features/categories/queries"
import { ROUTES } from "@/shared/lib/constants"
import { Button } from "@/shared/ui/button"

export const metadata: Metadata = {
  title: "Nueva Herramienta | Control Center",
  description: "Añadir una nueva herramienta al portal de facilitadores",
}

export default async function NewToolPage() {
  const categories = await getActiveCategories()

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <Button variant="ghost" className="w-fit -ml-4" asChild>
          <Link href={ROUTES.ADMIN_TOOLS}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Herramientas
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nueva Herramienta</h1>
          <p className="text-muted-foreground mt-1">
            Completá los datos para publicar una nueva herramienta en el portal.
          </p>
        </div>
      </div>

      <div className="border rounded-lg p-6 bg-card">
        <ToolForm categories={categories} />
      </div>
    </div>
  )
}
