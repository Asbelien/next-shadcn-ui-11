"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { FormAlert } from "@/components/FormAlert"
import { useStore } from "@/lib/store"
import {
  CATEGORIES,
  PRIORITIES,
  PROJECT_STATUSES,
  type Category,
  type Priority,
  type Project,
  type ProjectStatus,
} from "@/lib/data"

interface ProjectFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project?: Project
}

function ProjectFormBody({
  project,
  onClose,
}: {
  project?: Project
  onClose: () => void
}) {
  const { projects, members, addProject, updateProject, getProjectMembers, getProjectName } =
    useStore()

  const [name, setName] = useState(project?.name ?? "")
  const [description, setDescription] = useState(project?.description ?? "")
  const [category, setCategory] = useState<Category | "">(project?.category ?? "")
  const [priority, setPriority] = useState<Priority | "">(project?.priority ?? "")
  const [status, setStatus] = useState<ProjectStatus>(project?.status ?? "Planificado")
  const [memberIds, setMemberIds] = useState<string[]>(
    project ? getProjectMembers(project.id).map((m) => m.userId) : []
  )
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const toggleMember = (userId: string, checked: boolean) => {
    setMemberIds((prev) =>
      checked ? [...prev, userId] : prev.filter((id) => id !== userId)
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const found: string[] = []
    const trimmed = name.trim()

    if (trimmed.length < 3) found.push("El nombre debe tener al menos 3 caracteres")
    if (
      projects.some(
        (p) => p.id !== project?.id && p.name.toLowerCase() === trimmed.toLowerCase()
      )
    )
      found.push("Ya existe un proyecto con ese nombre")
    if (!category) found.push("Selecciona una categoría")
    if (!priority) found.push("Selecciona la prioridad")
    if (memberIds.length === 0) found.push("Asigna al menos un miembro al equipo")

    setErrors(found)
    if (found.length > 0) return

    setLoading(true)
    setTimeout(() => {
      const data = {
        name: trimmed,
        description: description.trim(),
        category: category as Category,
        priority: priority as Priority,
        status,
      }
      if (project) updateProject(project.id, data, memberIds)
      else addProject(data, memberIds)
      setLoading(false)
      onClose()
    }, 1000)
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{project ? "Editar Proyecto" : "Crear Nuevo Proyecto"}</DialogTitle>
        <DialogDescription>
          Completa la información del proyecto. Click en guardar cuando termines.
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <FormAlert errors={errors} />

        <div className="grid gap-2">
          <Label htmlFor="project-name">
            Nombre del Proyecto <span className="text-red-500">*</span>
          </Label>
          <Input
            id="project-name"
            placeholder="Mi Proyecto Increíble"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="project-description">Descripción</Label>
          <Textarea
            id="project-description"
            placeholder="Breve descripción del proyecto..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label>
              Categoría <span className="text-red-500">*</span>
            </Label>
            <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>
              Prioridad <span className="text-red-500">*</span>
            </Label>
            <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona" />
              </SelectTrigger>
              <SelectContent>
                {PRIORITIES.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-2">
          <Label>Estado</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as ProjectStatus)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PROJECT_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label>
            Miembros del equipo <span className="text-red-500">*</span>
          </Label>
          <div className="max-h-44 space-y-3 overflow-y-auto rounded-md border p-3">
            {members.map((m) => (
              <label
                key={m.userId}
                htmlFor={`member-${m.userId}`}
                className="flex cursor-pointer items-center gap-3 text-sm"
              >
                <Checkbox
                  id={`member-${m.userId}`}
                  checked={memberIds.includes(m.userId)}
                  onCheckedChange={(checked) => toggleMember(m.userId, checked === true)}
                />
                <span className="flex-1">
                  <span className="font-medium">{m.name}</span>
                  <span className="block text-xs text-muted-foreground">
                    {m.position}
                    {m.projectId && m.projectId !== project?.id
                      ? ` · Actualmente en ${getProjectName(m.projectId)}`
                      : ""}
                  </span>
                </span>
              </label>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            {memberIds.length} seleccionado(s). Un miembro pertenece a un solo proyecto.
          </p>
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Spinner className="mr-2" />}
          {loading ? "Guardando..." : project ? "Guardar Cambios" : "Crear Proyecto"}
        </Button>
      </DialogFooter>
    </form>
  )
}

export function ProjectForm({ open, onOpenChange, project }: ProjectFormProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[525px]">
        <ProjectFormBody project={project} onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}