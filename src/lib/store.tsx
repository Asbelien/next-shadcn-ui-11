"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import {
  initialMembers,
  initialProjects,
  initialTasks,
  type Member,
  type Project,
  type Task,
} from "@/lib/data"

type ProjectInput = Omit<Project, "id">
type MemberInput = Omit<Member, "userId">
type TaskInput = Omit<Task, "id">

interface StoreValue {
  projects: Project[]
  members: Member[]
  tasks: Task[]
  addProject: (data: ProjectInput, memberIds: string[]) => void
  updateProject: (id: string, data: ProjectInput, memberIds: string[]) => void
  deleteProject: (id: string) => void
  addMember: (data: MemberInput) => void
  updateMember: (userId: string, data: MemberInput) => void
  deleteMember: (userId: string) => void
  addTask: (data: TaskInput) => void
  updateTask: (id: string, data: TaskInput) => void
  deleteTask: (id: string) => void
  getProjectName: (id: string) => string
  getMemberName: (id: string) => string
  getProjectMembers: (projectId: string) => Member[]
  getProjectTasks: (projectId: string) => Task[]
  getProjectProgress: (projectId: string) => number
}

const StoreContext = createContext<StoreValue | null>(null)

function newId(prefix: string) {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [members, setMembers] = useState<Member[]>(initialMembers)
  const [tasks, setTasks] = useState<Task[]>(initialTasks)

  const assignMembers = (projectId: string, memberIds: string[]) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (memberIds.includes(m.userId)) return { ...m, projectId }
        if (m.projectId === projectId) return { ...m, projectId: "" }
        return m
      })
    )
  }

  const addProject = (data: ProjectInput, memberIds: string[]) => {
    const id = newId("p")
    setProjects((prev) => [...prev, { id, ...data }])
    assignMembers(id, memberIds)
  }

  const updateProject = (id: string, data: ProjectInput, memberIds: string[]) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { id, ...data } : p)))
    assignMembers(id, memberIds)
  }

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id))
    setTasks((prev) => prev.filter((t) => t.projectId !== id))
    setMembers((prev) =>
      prev.map((m) => (m.projectId === id ? { ...m, projectId: "" } : m))
    )
  }

  const addMember = (data: MemberInput) => {
    setMembers((prev) => [...prev, { userId: newId("u"), ...data }])
  }

  const updateMember = (userId: string, data: MemberInput) => {
    setMembers((prev) => prev.map((m) => (m.userId === userId ? { userId, ...data } : m)))
  }

  const deleteMember = (userId: string) => {
    setMembers((prev) => prev.filter((m) => m.userId !== userId))
    setTasks((prev) => prev.map((t) => (t.userId === userId ? { ...t, userId: "" } : t)))
  }

  const addTask = (data: TaskInput) => {
    setTasks((prev) => [{ id: newId("t"), ...data }, ...prev])
  }

  const updateTask = (id: string, data: TaskInput) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { id, ...data } : t)))
  }

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  const getProjectName = (id: string) =>
    projects.find((p) => p.id === id)?.name ?? "Sin proyecto"

  const getMemberName = (id: string) =>
    members.find((m) => m.userId === id)?.name ?? "Sin asignar"

  const getProjectMembers = (projectId: string) =>
    members.filter((m) => m.projectId === projectId)

  const getProjectTasks = (projectId: string) =>
    tasks.filter((t) => t.projectId === projectId)

  const getProjectProgress = (projectId: string) => {
    const list = tasks.filter((t) => t.projectId === projectId)
    if (list.length === 0) return 0
    const done = list.filter((t) => t.status === "Completado").length
    return Math.round((done / list.length) * 100)
  }

  return (
    <StoreContext.Provider
      value={{
        projects,
        members,
        tasks,
        addProject,
        updateProject,
        deleteProject,
        addMember,
        updateMember,
        deleteMember,
        addTask,
        updateTask,
        deleteTask,
        getProjectName,
        getMemberName,
        getProjectMembers,
        getProjectTasks,
        getProjectProgress,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error("useStore debe usarse dentro de StoreProvider")
  return ctx
}