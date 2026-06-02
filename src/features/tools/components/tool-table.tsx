import * as LucideIcons from "lucide-react"
import { ExternalLink } from "lucide-react"
import type { ToolWithCategory } from "@/shared/lib/supabase/types"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table"
import { ToolActions } from "./tool-actions"

interface ToolTableProps {
  tools: ToolWithCategory[]
}

export function ToolTable({ tools }: ToolTableProps) {
  if (tools.length === 0) {
    return null // Empty state is handled by the parent page
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Orden</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tools.map((tool) => {
            const IconComponent = (LucideIcons as any)[tool.icon] || LucideIcons.Wrench
            return (
              <TableRow 
                key={tool.id}
                className={tool.is_active ? "" : "opacity-60 grayscale-[0.5]"}
              >
                <TableCell className="font-mono text-muted-foreground">
                  {tool.display_order}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <IconComponent className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{tool.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {tool.categories?.name || "Sin Categoría"}
                </TableCell>
                <TableCell>
                  <a 
                    href={tool.url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-blue-500 hover:underline max-w-[150px] truncate"
                    title={tool.url}
                  >
                    {tool.url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                </TableCell>
                <TableCell>
                  {tool.is_active ? (
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
                  <ToolActions tool={tool} />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
