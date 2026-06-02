"use client"

import * as React from "react"
import { MoreHorizontal, Edit, Trash2, Power, PowerOff } from "lucide-react"
import Link from "next/link"

import type { ToolWithCategory } from "@/shared/lib/supabase/types"
import { toggleToolActive, deleteTool } from "../actions"
import { ROUTES } from "@/shared/lib/constants"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import { Button } from "@/shared/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog"

interface ToolActionsProps {
  tool: ToolWithCategory
}

export function ToolActions({ tool }: ToolActionsProps) {
  const [isPending, startTransition] = React.useTransition()
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleToggle = () => {
    startTransition(async () => {
      const { error } = await toggleToolActive(tool.id, tool.is_active)
      if (error) {
        alert(error)
      }
    })
  }

  const handleDelete = () => {
    setError(null)
    startTransition(async () => {
      const { error } = await deleteTool(tool.id)
      if (error) {
        setError(error)
      } else {
        setShowDeleteDialog(false)
      }
    })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" disabled={isPending}>
            <span className="sr-only">Abrir menú</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`${ROUTES.ADMIN_TOOLS}/${tool.id}`}>
              <Edit className="mr-2 h-4 w-4" />
              <span>Editar</span>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handleToggle} disabled={isPending}>
            {tool.is_active ? (
              <>
                <PowerOff className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Inactivar</span>
              </>
            ) : (
              <>
                <Power className="mr-2 h-4 w-4 text-emerald-500" />
                <span className="text-emerald-500">Reactivar</span>
              </>
            )}
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={() => setShowDeleteDialog(true)} 
            disabled={isPending}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Eliminar</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar herramienta?</DialogTitle>
            <DialogDescription>
              Esta acción eliminará la herramienta <strong>{tool.name}</strong>. 
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          
          {error && (
            <div className="p-3 text-sm text-destructive-foreground bg-destructive/90 rounded-md animate-shake">
              {error}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={isPending}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
              {isPending ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
