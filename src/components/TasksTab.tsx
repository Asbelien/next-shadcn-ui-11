"use client"

import { useState } from "react"
import { ListChecks, Pencil, Plus, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ConfirmDelete } from "@/components/ConfirmDelete"
import { TaskForm } from "@/components/TaskForm"
import { useStore } from "@/lib/store"
import type { Priority, Task, TaskStatus } from "@/lib/data"

const PAGE_SIZE = 5

const STATUS_STYLES: Record<TaskStatus, string> = {
  Pendiente: "bg-amber-100 text-amber-700",
  "En progreso": "bg-sky-100 text-sky-700",
  Completado: "bg-emerald-100 text-emerald-700",
}

const PRIORITY_STYLES: Record<Priority, string> = {
  Baja: "bg-slate-100 text-slate-700",
  Media: "bg-sky-100 text-sky-700",
  Alta: "bg-amber-100 text-amber-700",
  Urgente: "bg-rose-100 text-rose-700",
}

function formatDate(value: string) {
  const [y, m, d] = value.split("-").map(Number)
  return new Date(y, m - 1, d).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

function isOverdue(task: Task) {
  if (task.status === "Completado") return false
  const [y, m, d] = task.dateline.split("-").map(Number)
  const due = new Date(y, m - 1, d)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return due < today
}

export function TasksTab() {
  const { tasks, deleteTask, getProjectName, getMemberName } = useStore()

  const [page, setPage] = useState(1)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Task | undefined>(undefined)
  const [deleting, setDeleting] = useState<Task | null>(null)

  const totalPages = Math.max(1, Math.ceil(tasks.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * PAGE_SIZE
  const visible = tasks.slice(start, start + PAGE_SIZE)
  const doneCount = tasks.filter((t) => t.status === "Completado").length

  const goTo = (e: React.MouseEvent, target: number) => {
    e.preventDefault()
    if (target >= 1 && target <= totalPages) setPage(target)
  }

  const openCreate = () => {
    setEditing(undefined)
    setFormOpen(true)
  }

  const openEdit = (task: Task) => {
    setEditing(task)
    setFormOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Tareas</h2>
          <p className="text-sm text-muted-foreground">
            {tasks.length} tarea(s) · {doneCount} completadas
          </p>
        </div>
        <Button onClick={openCreate} className="rounded-xl">
          <Plus className="mr-2 h-4 w-4" />
          Nueva Tarea
        </Button>
      </div>

      {tasks.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border-2 border-dashed bg-white py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
            <ListChecks className="h-7 w-7" />
          </div>
          <p className="text-sm text-muted-foreground">No hay tareas registradas.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead className="pl-6">Descripción</TableHead>
                <TableHead>Proyecto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Prioridad</TableHead>
                <TableHead>Asignado a</TableHead>
                <TableHead>Fecha límite</TableHead>
                <TableHead className="pr-6 text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.map((task) => (
                <TableRow key={task.id} className="transition-colors hover:bg-emerald-50/50">
                  <TableCell className="pl-6 font-medium">{task.description}</TableCell>
                  <TableCell className="text-muted-foreground">{getProjectName(task.projectId)}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`border-transparent font-medium ${STATUS_STYLES[task.status]}`}
                    >
                      {task.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`border-transparent font-medium ${PRIORITY_STYLES[task.priority]}`}
                    >
                      {task.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>{getMemberName(task.userId)}</TableCell>
                  <TableCell
                    className={isOverdue(task) ? "font-medium text-rose-600" : "text-muted-foreground"}
                  >
                    {formatDate(task.dateline)}
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        size="icon"
                        variant="outline"
                        className="rounded-lg"
                        aria-label="Editar tarea"
                        onClick={() => openEdit(task)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        className="rounded-lg hover:bg-rose-50"
                        aria-label="Eliminar tarea"
                        onClick={() => setDeleting(task)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex flex-col items-center justify-between gap-3 border-t px-6 py-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              Mostrando {start + 1}-{Math.min(start + PAGE_SIZE, tasks.length)} de {tasks.length} tareas
            </p>
            <Pagination className="mx-0 w-auto">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    aria-disabled={currentPage === 1}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    onClick={(e) => goTo(e, currentPage - 1)}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <PaginationItem key={n}>
                    <PaginationLink
                      href="#"
                      isActive={n === currentPage}
                      className={
                        n === currentPage
                          ? "border-transparent bg-emerald-600 text-white hover:bg-emerald-700 hover:text-white"
                          : ""
                      }
                      onClick={(e) => goTo(e, n)}
                    >
                      {n}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    aria-disabled={currentPage === totalPages}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    onClick={(e) => goTo(e, currentPage + 1)}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      )}

      <TaskForm open={formOpen} onOpenChange={setFormOpen} task={editing} />

      <ConfirmDelete
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Eliminar tarea"
        description={`Se eliminará la tarea "${deleting?.description ?? ""}". Esta acción no se puede deshacer.`}
        onConfirm={() => deleting && deleteTask(deleting.id)}
      />
    </div>
  )
}