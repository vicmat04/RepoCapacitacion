"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as LucideIcons from "lucide-react"

import { categorySchema, type CategorySchemaType } from "../schemas"
import { createCategory, updateCategory } from "../actions"
import { CATEGORY_ICONS, type CategoryIcon } from "@/shared/lib/constants"
import type { Category } from "@/shared/lib/supabase/types"

import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { Button } from "@/shared/ui/button"
import { Switch } from "@/shared/ui/switch"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"

interface CategoryFormProps {
  initialData?: Category | null
}

function generateSlug(text: string) {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9 -]/g, "") // Remove invalid chars
    .replace(/\s+/g, "-") // Collapse whitespace and replace by -
    .replace(/-+/g, "-") // Collapse dashes
    .replace(/^-+/, "") // Trim - from start
    .replace(/-+$/, "") // Trim - from end
}

export function CategoryForm({ initialData }: CategoryFormProps) {
  const [isPending, startTransition] = React.useTransition()
  const [serverError, setServerError] = React.useState<string | null>(null)
  const [isSlugManual, setIsSlugManual] = React.useState(!!initialData)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CategorySchemaType>({
    resolver: zodResolver(categorySchema) as any, // type workaround for z.coerce
    defaultValues: {
      name: initialData?.name ?? "",
      slug: initialData?.slug ?? "",
      icon: initialData?.icon ?? "Folder",
      display_order: initialData?.display_order ?? 0,
      is_active: initialData?.is_active ?? true,
    },
  })

  const watchName = watch("name")
  const watchIcon = watch("icon")
  const watchIsActive = watch("is_active")

  React.useEffect(() => {
    if (!isSlugManual && watchName) {
      setValue("slug", generateSlug(watchName), { shouldValidate: true })
    }
  }, [watchName, isSlugManual, setValue])

  const onSubmit = (data: CategorySchemaType) => {
    setServerError(null)
    startTransition(async () => {
      const formData = new FormData()
      formData.append("name", data.name)
      formData.append("slug", data.slug)
      formData.append("icon", data.icon)
      formData.append("display_order", data.display_order.toString())
      formData.append("is_active", data.is_active.toString())

      const state = { error: undefined, fieldErrors: {} }
      const res = initialData
        ? await updateCategory(initialData.id, state, formData)
        : await createCategory(state, formData)

      if (res?.error) {
        setServerError(res.error)
      } else if (res?.fieldErrors) {
        // Here we could map fieldErrors to RHF setError, but Zod already catches most
        setServerError("Hubo un error de validación.")
      }
    })
  }

  const IconComponent = (LucideIcons as any)[watchIcon] || LucideIcons.Folder

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre de Categoría</Label>
        <Input
          id="name"
          placeholder="Ej. Herramientas de Gestión"
          {...register("name")}
          disabled={isPending}
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug (URL amigable)</Label>
        <Input
          id="slug"
          placeholder="ej-herramientas-de-gestion"
          {...register("slug")}
          onChange={(e) => {
            setIsSlugManual(true)
            setValue("slug", e.target.value, { shouldValidate: true })
          }}
          disabled={isPending}
        />
        <p className="text-xs text-muted-foreground">
          Debe ser único. Se genera automáticamente basado en el nombre.
        </p>
        {errors.slug && <p className="text-sm text-destructive">{errors.slug.message}</p>}
      </div>

      <div className="space-y-2">
        <Label>Ícono</Label>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-[200px] justify-start gap-2" disabled={isPending}>
                <IconComponent className="h-4 w-4" />
                <span>{watchIcon}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[200px] max-h-[300px] overflow-y-auto">
              {CATEGORY_ICONS.map((iconName) => {
                const ItemIcon = (LucideIcons as any)[iconName]
                if (!ItemIcon) return null
                return (
                  <DropdownMenuItem
                    key={iconName}
                    onClick={() => setValue("icon", iconName, { shouldValidate: true })}
                    className="gap-2 cursor-pointer"
                  >
                    <ItemIcon className="h-4 w-4" />
                    <span>{iconName}</span>
                  </DropdownMenuItem>
                )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {errors.icon && <p className="text-sm text-destructive">{errors.icon.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="display_order">Orden de Visualización</Label>
        <Input
          id="display_order"
          type="number"
          min="0"
          {...register("display_order")}
          disabled={isPending}
        />
        <p className="text-xs text-muted-foreground">
          Menor número aparecerá más arriba en la lista.
        </p>
        {errors.display_order && <p className="text-sm text-destructive">{errors.display_order.message}</p>}
      </div>

      <div className="flex items-center space-x-2 pt-2">
        <Switch
          id="is_active"
          checked={watchIsActive}
          onCheckedChange={(checked) => setValue("is_active", checked, { shouldValidate: true })}
          disabled={isPending}
        />
        <Label htmlFor="is_active">Activa (Visible en el Portal Público)</Label>
      </div>

      {serverError && (
        <div className="p-3 text-sm text-destructive-foreground bg-destructive/90 rounded-md animate-shake">
          {serverError}
        </div>
      )}

      <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
        {isPending
          ? "Guardando..."
          : initialData
          ? "Actualizar Categoría"
          : "Crear Categoría"}
      </Button>
    </form>
  )
}
