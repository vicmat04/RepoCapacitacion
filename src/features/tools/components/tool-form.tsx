"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as LucideIcons from "lucide-react"

import { toolSchema, type ToolSchemaType } from "../schemas"
import { createTool, updateTool } from "../actions"
import { CATEGORY_ICONS } from "@/shared/lib/constants"
import type { Tool, Category } from "@/shared/lib/supabase/types"

import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { Button } from "@/shared/ui/button"
import { Switch } from "@/shared/ui/switch"
import { Textarea } from "@/shared/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select"

interface ToolFormProps {
  initialData?: Tool | null
  categories: Pick<Category, "id" | "name">[]
}

export function ToolForm({ initialData, categories }: ToolFormProps) {
  const [isPending, startTransition] = React.useTransition()
  const [serverError, setServerError] = React.useState<string | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ToolSchemaType>({
    resolver: zodResolver(toolSchema) as any,
    defaultValues: {
      name: initialData?.name ?? "",
      description: initialData?.description ?? "",
      url: initialData?.url ?? "",
      icon: initialData?.icon ?? "Wrench",
      category_id: initialData?.category_id ?? "",
      display_order: initialData?.display_order ?? 0,
      is_active: initialData?.is_active ?? true,
      opens_new_tab: initialData?.opens_new_tab ?? true,
    },
  })

  const watchIcon = watch("icon")
  const watchIsActive = watch("is_active")
  const watchOpensNewTab = watch("opens_new_tab")
  const watchCategoryId = watch("category_id")

  const onSubmit = (data: ToolSchemaType) => {
    setServerError(null)
    startTransition(async () => {
      const formData = new FormData()
      formData.append("name", data.name)
      formData.append("description", data.description || "")
      formData.append("url", data.url)
      formData.append("icon", data.icon)
      formData.append("category_id", data.category_id)
      formData.append("display_order", data.display_order.toString())
      formData.append("is_active", data.is_active.toString())
      formData.append("opens_new_tab", data.opens_new_tab.toString())

      const state = { error: undefined, fieldErrors: {} }
      const res = initialData
        ? await updateTool(initialData.id, state, formData)
        : await createTool(state, formData)

      if (res?.error) {
        setServerError(res.error)
      } else if (res?.fieldErrors) {
        setServerError("Hubo un error de validación en los datos enviados.")
      }
    })
  }

  const IconComponent = (LucideIcons as any)[watchIcon] || LucideIcons.Wrench

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre de Herramienta</Label>
        <Input
          id="name"
          placeholder="Ej. Notion"
          {...register("name")}
          disabled={isPending}
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción (opcional)</Label>
        <Textarea
          id="description"
          placeholder="Breve descripción de para qué sirve..."
          {...register("description")}
          disabled={isPending}
          rows={3}
        />
        {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="url">URL (Link destino)</Label>
        <Input
          id="url"
          type="url"
          placeholder="https://..."
          {...register("url")}
          disabled={isPending}
        />
        {errors.url && <p className="text-sm text-destructive">{errors.url.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category_id">Categoría</Label>
        <Select 
          disabled={isPending} 
          value={watchCategoryId} 
          onValueChange={(val) => setValue("category_id", val, { shouldValidate: true })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccioná una categoría" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category_id && <p className="text-sm text-destructive">{errors.category_id.message}</p>}
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

      <div className="space-y-4 pt-2">
        <div className="flex items-center space-x-2">
          <Switch
            id="is_active"
            checked={watchIsActive}
            onCheckedChange={(checked) => setValue("is_active", checked, { shouldValidate: true })}
            disabled={isPending}
          />
          <Label htmlFor="is_active">Activa (Visible en el Portal Público)</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="opens_new_tab"
            checked={watchOpensNewTab}
            onCheckedChange={(checked) => setValue("opens_new_tab", checked, { shouldValidate: true })}
            disabled={isPending}
          />
          <Label htmlFor="opens_new_tab">Abrir link en una nueva pestaña</Label>
        </div>
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
          ? "Actualizar Herramienta"
          : "Crear Herramienta"}
      </Button>
    </form>
  )
}
