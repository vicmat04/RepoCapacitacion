"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { createClient } from "@/shared/lib/supabase/server"
import { ROUTES } from "@/shared/lib/constants"
import { toolSchema, type ToolSchemaType } from "./schemas"

export type ToolActionState = {
  error?: string
  fieldErrors?: Partial<Record<keyof ToolSchemaType, string[]>>
  success?: boolean
}

export async function createTool(
  prevState: ToolActionState,
  formData: FormData
): Promise<ToolActionState> {
  const data = Object.fromEntries(formData.entries())
  
  // Transform string to boolean where necessary for Zod
  const rawData = {
    ...data,
    is_active: data.is_active === "true",
    opens_new_tab: data.opens_new_tab === "true",
  }

  const validatedFields = toolSchema.safeParse(rawData)

  if (!validatedFields.success) {
    return {
      fieldErrors: validatedFields.error.flatten().fieldErrors as Partial<Record<keyof ToolSchemaType, string[]>>,
    }
  }

  const supabase = await createClient()
  
  const { error } = await supabase.from("tools").insert({
    ...validatedFields.data,
  })

  if (error) {
    console.error("[createTool]", error)
    return { error: "Hubo un error al crear la herramienta. Intentá de nuevo." }
  }

  revalidatePath(ROUTES.ADMIN_TOOLS)
  revalidatePath("/")
  
  redirect(ROUTES.ADMIN_TOOLS)
}

export async function updateTool(
  id: string,
  prevState: ToolActionState,
  formData: FormData
): Promise<ToolActionState> {
  const data = Object.fromEntries(formData.entries())
  
  const rawData = {
    ...data,
    is_active: data.is_active === "true",
    opens_new_tab: data.opens_new_tab === "true",
  }

  const validatedFields = toolSchema.safeParse(rawData)

  if (!validatedFields.success) {
    return {
      fieldErrors: validatedFields.error.flatten().fieldErrors as Partial<Record<keyof ToolSchemaType, string[]>>,
    }
  }

  const supabase = await createClient()

  const { error } = await supabase
    .from("tools")
    .update({ ...validatedFields.data })
    .eq("id", id)

  if (error) {
    console.error("[updateTool]", error)
    return { error: "Hubo un error al actualizar la herramienta. Intentá de nuevo." }
  }

  revalidatePath(ROUTES.ADMIN_TOOLS)
  revalidatePath("/")
  
  redirect(ROUTES.ADMIN_TOOLS)
}

export async function toggleToolActive(
  id: string,
  currentStatus: boolean
): Promise<{ error?: string, success?: boolean }> {
  const supabase = await createClient()

  const { error } = await supabase
    .from("tools")
    .update({ is_active: !currentStatus })
    .eq("id", id)

  if (error) {
    console.error("[toggleToolActive]", error)
    return { error: "Hubo un error al cambiar el estado." }
  }

  revalidatePath(ROUTES.ADMIN_TOOLS)
  revalidatePath("/")

  return { success: true }
}

export async function deleteTool(id: string): Promise<{ error?: string, success?: boolean }> {
  const supabase = await createClient()

  const { error } = await supabase
    .from("tools")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("[deleteTool]", error)
    return { error: "Hubo un error al eliminar la herramienta." }
  }

  revalidatePath(ROUTES.ADMIN_TOOLS)
  revalidatePath("/")

  return { success: true }
}
