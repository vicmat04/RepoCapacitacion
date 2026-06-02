import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"

import { getCategoryById } from "@/features/categories/queries"
import { CategoryForm } from "@/features/categories/components/category-form"
import { ROUTES } from "@/shared/lib/constants"
import { Button } from "@/shared/ui/button"

export const metadata: Metadata = {
  title: "Editar Categoría | Control Center",
  description: "Modificar los datos de la categoría",
}

interface EditCategoryPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const resolvedParams = await params
  const category = await getCategoryById(resolvedParams.id)

  if (!category) {
    notFound()
  }

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
          <h1 className="text-3xl font-bold tracking-tight">Editar Categoría</h1>
          <p className="text-muted-foreground mt-1">
            Modificá los datos o el estado de la categoría.
          </p>
        </div>
      </div>

      <div className="border rounded-lg p-6 bg-card">
        <CategoryForm initialData={category} />
      </div>
    </div>
  )
}
