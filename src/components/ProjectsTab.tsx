"use client"

import { useState } from "react"
import { FolderOpen, Pencil, Plus, Trash2, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ConfirmDelete } from "@/components/ConfirmDelete"
import { ProjectForm } from "@/components/ProjectForm"
import { useStore } from "@/lib/store"
import type { Priority, Project, ProjectStatus, TaskStatus } from "@/lib/data"

const STATUS_STYLES: Record<ProjectStatus, string> = {
  Planificado: "bg-slate-100 text-slate-700",
  "En progreso": "bg-sky-100 text-sky-700",
  "En revisión": "bg-amber-100 text-amber-700",
  Completado: "bg-emerald-100 text-emerald-700",
}

const TASK_STATUS_STYLES: Record<TaskStatus, string> = {
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

const BADGE = "border-transparent font-medium"

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-black/5">
      <div
        className="h-full rounded-full bg-emerald-600 transition-all duration-500"
        style={{ width: `${value}%` }}
      />
    </div>
  )
}

export function ProjectsTab() {
  const {
    projects,
    deleteProject,
    getProjectMembers,
    getProjectTasks,
    getProjectProgress,
    getMemberName,
  } = useStore()

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Project | undefined>(undefined)
  const [detailId, setDetailId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<Project | null>(null)

  const detail = projects.find((p) => p.id === detailId)

  const openCreate = () => {
    setEditing(undefined)
    setFormOpen(true)
  }

  const openEdit = (project: Project) => {
    setEditing(project)
    setFormOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Proyectos</h2>
          <p className="text-sm text-muted-foreground">
            {projects.length} proyecto(s) registrados
          </p>
        </div>
        <Button onClick={openCreate} className="rounded-xl">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Proyecto
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border-2 border-dashed bg-white py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
            <FolderOpen className="h-7 w-7" />
          </div>
          <p className="text-sm text-muted-foreground">
            No hay proyectos. Crea el primero con el botón Nuevo Proyecto.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const progress = getProjectProgress(project.id)
            const teamCount = getProjectMembers(project.id).length

            return (
              <Card
                key={project.id}
                className="group rounded-3xl border-0 bg-white shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <CardContent className="space-y-5 pt-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-lg font-bold text-white transition-transform duration-300 group-hover:scale-110">
                        {project.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate font-semibold">{project.name}</h3>
                        <p className="text-xs text-muted-foreground">{project.category}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={`${BADGE} ${STATUS_STYLES[project.status]}`}>
                      {project.status}
                    </Badge>
                  </div>

                  <p className="line-clamp-2 min-h-10 text-sm text-muted-foreground">
                    {project.description || "Sin descripción"}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progreso</span>
                      <span className="font-semibold tabular-nums">{progress}%</span>
                    </div>
                    <ProgressBar value={progress} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      {teamCount} miembros
                    </div>
                    <Badge variant="outline" className={`${BADGE} ${PRIORITY_STYLES[project.priority]}`}>
                      {project.priority}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between gap-2 border-t pt-4">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="rounded-lg text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
                      onClick={() => setDetailId(project.id)}
                    >
                      Ver detalles
                    </Button>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="outline"
                        className="rounded-lg"
                        aria-label="Editar proyecto"
                        onClick={() => openEdit(project)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        className="rounded-lg hover:bg-rose-50"
                        aria-label="Eliminar proyecto"
                        onClick={() => setDeleting(project)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <ProjectForm open={formOpen} onOpenChange={setFormOpen} project={editing} />

      <Dialog open={detail !== undefined} onOpenChange={(open) => !open && setDetailId(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl sm:max-w-[560px]">
          {detail && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-lg font-bold text-white">
                    {detail.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <DialogTitle>{detail.name}</DialogTitle>
                    <DialogDescription>{detail.description || "Sin descripción"}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-5 text-sm">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className={`${BADGE} ${STATUS_STYLES[detail.status]}`}>
                    {detail.status}
                  </Badge>
                  <Badge variant="outline" className={`${BADGE} ${PRIORITY_STYLES[detail.priority]}`}>
                    Prioridad {detail.priority}
                  </Badge>
                  <Badge variant="outline" className={`${BADGE} bg-slate-100 text-slate-700`}>
                    {detail.category}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Progreso</span>
                    <span className="font-semibold tabular-nums">{getProjectProgress(detail.id)}%</span>
                  </div>
                  <ProgressBar value={getProjectProgress(detail.id)} />
                </div>

                <div>
                  <h4 className="mb-2 font-semibold">Equipo</h4>
                  {getProjectMembers(detail.id).length === 0 ? (
                    <p className="text-muted-foreground">Sin miembros asignados.</p>
                  ) : (
                    <ul className="space-y-2">
                      {getProjectMembers(detail.id).map((m) => (
                        <li
                          key={m.userId}
                          className="flex items-center justify-between rounded-2xl bg-slate-50 p-3"
                        >
                          <span>
                            <span className="font-medium">{m.name}</span>
                            <span className="block text-xs text-muted-foreground">{m.position}</span>
                          </span>
                          <Badge
                            variant="outline"
                            className={`${BADGE} ${
                              m.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {m.isActive ? "Activo" : "Inactivo"}
                          </Badge>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div>
                  <h4 className="mb-2 font-semibold">Tareas ({getProjectTasks(detail.id).length})</h4>
                  {getProjectTasks(detail.id).length === 0 ? (
                    <p className="text-muted-foreground">Sin tareas registradas.</p>
                  ) : (
                    <ul className="space-y-2">
                      {getProjectTasks(detail.id).map((t) => (
                        <li
                          key={t.id}
                          className="flex items-center justify-between gap-2 rounded-2xl bg-slate-50 p-3"
                        >
                          <span>
                            <span className="font-medium">{t.description}</span>
                            <span className="block text-xs text-muted-foreground">
                              {getMemberName(t.userId)} · {t.dateline}
                            </span>
                          </span>
                          <Badge variant="outline" className={`${BADGE} ${TASK_STATUS_STYLES[t.status]}`}>
                            {t.status}
                          </Badge>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDelete
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Eliminar proyecto"
        description={`Se eliminará "${deleting?.name ?? ""}" junto con sus tareas, y sus miembros quedarán sin proyecto. Esta acción no se puede deshacer.`}
        onConfirm={() => deleting && deleteProject(deleting.id)}
      />
    </div>
  )
}