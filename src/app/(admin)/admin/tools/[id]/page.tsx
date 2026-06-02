import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { ToolForm } from "@/features/tools/components/tool-form"
import { getToolById } from "@/features/tools/queries"
import { getActiveCategories } from "@/features/categories/queries"
import { ROUTES } from "@/shared/lib/constants"
import { Button } from "@/shared/ui/button"

export const metadata: Metadata = {
  title: "Editar Herramienta | Control Center",
  description: "Editar los datos de una herramienta existente",
}

interface EditToolPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditToolPage({ params }: EditToolPageProps) {
  const { id } = await params
  
  // Fetch both tool and categories in parallel
  const [tool, categories] = await Promise.all([
    getToolById(id),
    getActiveCategories()
  ])

  if (!tool) {
    notFound()
  }

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
          <h1 className="text-3xl font-bold tracking-tight">Editar Herramienta</h1>
          <p className="text-muted-foreground mt-1">
            Modificá los datos de "{tool.name}".
          </p>
        </div>
      </div>

      <div className="border rounded-lg p-6 bg-card">
        <ToolForm initialData={tool} categories={categories} />
      </div>
    </div>
  )
}
