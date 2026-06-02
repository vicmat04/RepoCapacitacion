import { Metadata } from "next"
import Link from "next/link"
import { Folder, Plus } from "lucide-react"

import { getAllCategories } from "@/features/categories/queries"
import { CategoryTable } from "@/features/categories/components/category-table"
import { ROUTES } from "@/shared/lib/constants"
import { Button } from "@/shared/ui/button"
import { EmptyState } from "@/shared/components/empty-state"

export const metadata: Metadata = {
  title: "Administrar Categorías | Control Center",
  description: "Gestión de categorías del panel de control",
}

export default async function AdminCategoriesPage() {
  const categories = await getAllCategories()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categorías</h1>
          <p className="text-muted-foreground mt-1">
            Gestioná las categorías que agrupan las herramientas del portal.
          </p>
        </div>
        <Button asChild>
          <Link href={ROUTES.ADMIN_CATEGORIES_NEW}>
            <Plus className="mr-2 h-4 w-4" />
            Nueva Categoría
          </Link>
        </Button>
      </div>

      {categories.length === 0 ? (
        <EmptyState
          className="p-12 border rounded-lg bg-muted/20"
          icon={<Folder className="h-12 w-12 text-muted-foreground/50" />}
          title="No hay categorías registradas"
          description="Comenzá creando tu primera categoría para organizar las herramientas del Control Center."
          action={
            <Button asChild>
              <Link href={ROUTES.ADMIN_CATEGORIES_NEW}>
                <Plus className="mr-2 h-4 w-4" />
                Crear Categoría
              </Link>
            </Button>
          }
        />
      ) : (
        <CategoryTable categories={categories} />
      )}
    </div>
  )
}
