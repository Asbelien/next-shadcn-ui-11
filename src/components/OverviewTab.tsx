"use client"

import { AlertTriangle, CheckCircle2, FolderKanban, Users } from "lucide-react"
import { PRIORITIES, TASK_STATUSES } from "@/lib/data"
import { useStore } from "@/lib/store"

const STATUS_COLORS: Record<string, string> = {
  Pendiente: "bg-amber-500",
  "En progreso": "bg-sky-500",
  Completado: "bg-emerald-600",
}

const PRIORITY_COLORS: Record<string, string> = {
  Baja: "bg-slate-400",
  Media: "bg-sky-500",
  Alta: "bg-amber-500",
  Urgente: "bg-rose-500",
}

function Bar({ value, color = "bg-emerald-600" }: { value: number; color?: string }) {
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-black/5">
      <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${value}%` }} />
    </div>
  )
}

const tile = "rounded-3xl p-6 transition-transform duration-300 hover:-translate-y-0.5"
const panel = `${tile} bg-white ring-1 ring-black/5`

export function OverviewTab() {
  const { projects, members, tasks, getProjectProgress } = useStore()

  const activeProjects = projects.filter((p) => p.status === "En progreso").length
  const activeMembers = members.filter((m) => m.isActive).length
  const doneTasks = tasks.filter((t) => t.status === "Completado").length
  const urgentPending = tasks.filter((t) => t.priority === "Urgente" && t.status !== "Completado").length
  const totalTasks = tasks.length

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className={`${tile} flex items-start justify-between bg-emerald-600 text-white sm:col-span-2`}>
        <div className="space-y-2">
          <p className="text-sm font-medium text-emerald-100">Proyectos</p>
          <p className="text-6xl font-bold tracking-tight tabular-nums">{projects.length}</p>
          <p className="text-sm text-emerald-100">{activeProjects} en progreso</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
          <FolderKanban className="h-6 w-6" />
        </div>
      </div>

      <div className={`${tile} flex flex-col justify-between bg-sky-100 text-sky-950`}>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/70 text-sky-700">
          <Users className="h-5 w-5" />
        </div>
        <div className="mt-6 space-y-1">
          <p className="text-4xl font-bold tabular-nums">{activeMembers}</p>
          <p className="text-sm font-medium">Miembros activos</p>
          <p className="text-xs text-sky-800">de {members.length} en total</p>
        </div>
      </div>

      <div className={`${tile} flex flex-col justify-between bg-amber-100 text-amber-950`}>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/70 text-amber-700">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <div className="mt-6 space-y-1">
          <p className="text-4xl font-bold tabular-nums">{doneTasks}</p>
          <p className="text-sm font-medium">Tareas completadas</p>
          <p className="text-xs text-amber-800">de {totalTasks} en total</p>
        </div>
      </div>

      <div className={`${panel} sm:col-span-2 lg:row-span-2`}>
        <h3 className="text-lg font-semibold">Progreso por proyecto</h3>
        <p className="mb-5 text-sm text-muted-foreground">Porcentaje de tareas completadas</p>
        <div className="space-y-5">
          {projects.length === 0 && (
            <p className="text-sm text-muted-foreground">No hay proyectos.</p>
          )}
          {projects.map((p) => {
            const progress = getProjectProgress(p.id)
            return (
              <div key={p.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{p.name}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums ${
                      progress === 100 ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {progress}%
                  </span>
                </div>
                <Bar value={progress} />
              </div>
            )
          })}
        </div>
      </div>

      <div className={`${tile} flex items-center justify-between bg-rose-100 text-rose-950 sm:col-span-2`}>
        <div className="space-y-1">
          <p className="text-sm font-medium">Urgentes pendientes</p>
          <p className="text-5xl font-bold tabular-nums">{urgentPending}</p>
          <p className="text-xs text-rose-800">requieren atención</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/70 text-rose-600">
          <AlertTriangle className="h-6 w-6" />
        </div>
      </div>

      <div className={panel}>
        <h3 className="mb-4 text-base font-semibold">Por estado</h3>
        <div className="space-y-4">
          {TASK_STATUSES.map((s) => {
            const count = tasks.filter((t) => t.status === s).length
            const pct = totalTasks === 0 ? 0 : Math.round((count / totalTasks) * 100)
            return (
              <div key={s} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span>{s}</span>
                  <span className="font-semibold tabular-nums">{count}</span>
                </div>
                <Bar value={pct} color={STATUS_COLORS[s]} />
              </div>
            )
          })}
        </div>
      </div>

      <div className={panel}>
        <h3 className="mb-4 text-base font-semibold">Por prioridad</h3>
        <div className="space-y-4">
          {PRIORITIES.map((pr) => {
            const count = tasks.filter((t) => t.priority === pr).length
            const pct = totalTasks === 0 ? 0 : Math.round((count / totalTasks) * 100)
            return (
              <div key={pr} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span>{pr}</span>
                  <span className="font-semibold tabular-nums">{count}</span>
                </div>
                <Bar value={pct} color={PRIORITY_COLORS[pr]} />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}