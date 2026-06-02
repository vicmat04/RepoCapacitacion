import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { CategoryForm } from "@/features/categories/components/category-form"
import { ROUTES } from "@/shared/lib/constants"
import { Button } from "@/shared/ui/button"

export const metadata: Metadata = {
  title: "Nueva Categoría | Control Center",
  description: "Crear una nueva categoría para el portal de facilitadores",
}

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <Button variant="ghost" className="w-fit -ml-4" asChild>
          <Link href={ROUTES.ADMIN_CATEGORIES}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Categorías
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nueva Categoría</h1>
          <p className="text-muted-foreground mt-1">
            Completá los datos para crear una nueva agrupación de herramientas.
          </p>
        </div>
      </div>

      <div className="border rounded-lg p-6 bg-card">
        <CategoryForm />
      </div>
    </div>
  )
}
