"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/shared/lib/supabase/server"
import { ROUTES } from "@/shared/lib/constants"
import { categorySchema, type CategorySchemaType } from "./schemas"

export type CategoryActionState = {
  error?: string
  fieldErrors?: Partial<Record<keyof CategorySchemaType, string[]>>
  success?: boolean
}

export async function createCategory(
  _prevState: CategoryActionState,
  formData: FormData
): Promise<CategoryActionState> {
  const raw = {
    name: formData.get("name"),
    slug: formData.get("slug"),
    icon: formData.get("icon"),
    display_order: formData.get("display_order"),
    is_active: formData.get("is_active") === "true",
  }

  const parsed = categorySchema.safeParse(raw)

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  const supabase = await createClient()

  // La DB restringe la escritura usando RLS. También tiene constraints UNIQUE para name y slug.
  const { error } = await supabase.from("categories").insert({
    name: parsed.data.name,
    slug: parsed.data.slug,
    icon: parsed.data.icon,
    display_order: parsed.data.display_order,
    is_active: parsed.data.is_active,
  })

  if (error) {
    console.error("[createCategory]", error)
    if (error.code === "23505") { // Unique violation
      return { error: "Este nombre o slug ya se encuentra en uso por otra categoría" }
    }
    return { error: "Hubo un error al crear la categoría. Intentá de nuevo." }
  }

  revalidatePath(ROUTES.ADMIN_CATEGORIES)
  revalidatePath("/")
  
  redirect(ROUTES.ADMIN_CATEGORIES)
}

export async function updateCategory(
  id: string,
  _prevState: CategoryActionState,
  formData: FormData
): Promise<CategoryActionState> {
  const raw = {
    name: formData.get("name"),
    slug: formData.get("slug"),
    icon: formData.get("icon"),
    display_order: formData.get("display_order"),
    is_active: formData.get("is_active") === "true",
  }

  const parsed = categorySchema.safeParse(raw)

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  const supabase = await createClient()

  const { error } = await supabase
    .from("categories")
    .update({
      name: parsed.data.name,
      slug: parsed.data.slug,
      icon: parsed.data.icon,
      display_order: parsed.data.display_order,
      is_active: parsed.data.is_active,
    })
    .eq("id", id)

  if (error) {
    console.error("[updateCategory]", error)
    if (error.code === "23505") {
      return { error: "Este nombre o slug ya se encuentra en uso por otra categoría" }
    }
    return { error: "Hubo un error al actualizar la categoría. Intentá de nuevo." }
  }

  revalidatePath(ROUTES.ADMIN_CATEGORIES)
  revalidatePath("/")
  
  redirect(ROUTES.ADMIN_CATEGORIES)
}

export async function toggleCategoryActive(
  id: string,
  currentStatus: boolean
): Promise<{ error?: string, success?: boolean }> {
  const supabase = await createClient()

  const { error } = await supabase
    .from("categories")
    .update({ is_active: !currentStatus })
    .eq("id", id)

  if (error) {
    console.error("[toggleCategoryActive]", error)
    return { error: "Hubo un error al cambiar el estado." }
  }

  revalidatePath(ROUTES.ADMIN_CATEGORIES)
  revalidatePath("/")

  return { success: true }
}

export async function deleteCategory(id: string): Promise<{ error?: string, success?: boolean }> {
  const supabase = await createClient()

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("[deleteCategory]", error)
    if (error.code === "23503") { // Foreign key violation
      return { error: "No es posible eliminar una categoría que posee herramientas asignadas. Reasigne o elimine las herramientas primero." }
    }
    return { error: "Hubo un error al eliminar la categoría." }
  }

  revalidatePath(ROUTES.ADMIN_CATEGORIES)
  revalidatePath("/")

  return { success: true }
}
