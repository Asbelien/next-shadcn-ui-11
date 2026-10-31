"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { DatePicker } from "@/components/DatePicker"
import { FormAlert } from "@/components/FormAlert"
import { useStore } from "@/lib/store"
import {
  PRIORITIES,
  TASK_STATUSES,
  type Priority,
  type Task,
  type TaskStatus,
} from "@/lib/data"

interface TaskFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task?: Task
}

function TaskFormBody({
  task,
  onClose,
}: {
  task?: Task
  onClose: () => void
}) {
  const { projects, members, addTask, updateTask } = useStore()

  const [description, setDescription] = useState(task?.description ?? "")
  const [projectId, setProjectId] = useState(task?.projectId ?? "")
  const [userId, setUserId] = useState(task?.userId ?? "")
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? "Pendiente")
  const [priority, setPriority] = useState<Priority | "">(task?.priority ?? "")
  const [dateline, setDateline] = useState(task?.dateline ?? "")
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const found: string[] = []

    if (description.trim().length < 5)
      found.push("La descripción debe tener al menos 5 caracteres")
    if (!projectId) found.push("Selecciona un proyecto")
    if (!userId) found.push("Asigna la tarea a un miembro")
    if (!priority) found.push("Selecciona la prioridad")
    if (!dateline) found.push("Selecciona la fecha límite")

    setErrors(found)
    if (found.length > 0) return

    setLoading(true)
    setTimeout(() => {
      const data = {
        description: description.trim(),
        projectId,
        userId,
        status,
        priority: priority as Priority,
        dateline,
      }
      if (task) updateTask(task.id, data)
      else addTask(data)
      setLoading(false)
      onClose()
    }, 1000)
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{task ? "Editar Tarea" : "Nueva Tarea"}</DialogTitle>
        <DialogDescription>
          Completa los datos de la tarea.
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <FormAlert errors={errors} />

        <div className="grid gap-2">
          <Label htmlFor="task-description">
            Descripción <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="task-description"
            placeholder="Describe la tarea..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label>
              Proyecto <span className="text-red-500">*</span>
            </Label>
            <Select value={projectId} onValueChange={setProjectId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>
              Asignado a <span className="text-red-500">*</span>
            </Label>
            <Select value={userId} onValueChange={setUserId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona" />
              </SelectTrigger>
              <SelectContent>
                {members.map((m) => (
                  <SelectItem key={m.userId} value={m.userId}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label>Estado</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TASK_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
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
          <Label>
            Fecha límite <span className="text-red-500">*</span>
          </Label>
          <DatePicker value={dateline} onChange={setDateline} />
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Spinner className="mr-2" />}
          {loading ? "Guardando..." : task ? "Guardar Cambios" : "Crear Tarea"}
        </Button>
      </DialogFooter>
    </form>
  )
}

export function TaskForm({ open, onOpenChange, task }: TaskFormProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[525px]">
        <TaskFormBody task={task} onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}