import * as LucideIcons from "lucide-react"
import type { Category } from "@/shared/lib/supabase/types"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table"
import { CategoryActions } from "./category-actions"

interface CategoryTableProps {
  categories: Category[]
}

export function CategoryTable({ categories }: CategoryTableProps) {
  if (categories.length === 0) {
    return null // Empty state is handled by the parent page
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Orden</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Ícono</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => {
            const IconComponent = (LucideIcons as any)[category.icon] || LucideIcons.Folder
            return (
              <TableRow 
                key={category.id}
                className={category.is_active ? "" : "opacity-60 grayscale-[0.5]"}
              >
                <TableCell className="font-mono text-muted-foreground">
                  {category.display_order}
                </TableCell>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {category.slug}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <IconComponent className="w-4 h-4" />
                    <span className="text-xs">{category.icon}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {category.is_active ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-500">
                      Activa
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground">
                      Inactiva
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <CategoryActions category={category} />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
