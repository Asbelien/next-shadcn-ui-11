"use client"

import { FolderKanban, LayoutDashboard, ListChecks, Settings, Users } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OverviewTab } from "@/components/OverviewTab"
import { ProjectsTab } from "@/components/ProjectsTab"
import { TeamTab } from "@/components/TeamTab"
import { TasksTab } from "@/components/TasksTab"
import { SettingsTab } from "@/components/SettingsTab"

const TABS = [
  { value: "overview", label: "Resumen", icon: LayoutDashboard, content: <OverviewTab /> },
  { value: "projects", label: "Proyectos", icon: FolderKanban, content: <ProjectsTab /> },
  { value: "team", label: "Equipo", icon: Users, content: <TeamTab /> },
  { value: "tasks", label: "Tareas", icon: ListChecks, content: <TasksTab /> },
  { value: "settings", label: "Configuración", icon: Settings, content: <SettingsTab /> },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-emerald-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-8">
        <header className="mb-10 flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <LayoutDashboard className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Dashboard de Proyectos
            </h1>
            <p className="mt-1 text-sm text-slate-500 sm:text-base">
              Gestiona tus proyectos, equipo y tareas en un solo lugar
            </p>
          </div>
        </header>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="h-auto max-w-full gap-1 overflow-x-auto rounded-xl border bg-white p-1.5">
            {TABS.map(({ value, label, icon: Icon }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="gap-2 rounded-lg px-4 py-2 text-slate-600 transition-colors data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {TABS.map(({ value, content }) => (
            <TabsContent key={value} value={value} className="focus-visible:outline-none">
              {content}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}