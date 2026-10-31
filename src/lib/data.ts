export type ProjectStatus = "Planificado" | "En progreso" | "En revisión" | "Completado"
export type TaskStatus = "Pendiente" | "En progreso" | "Completado"
export type Priority = "Baja" | "Media" | "Alta" | "Urgente"
export type Category = "Desarrollo Web" | "Desarrollo Mobile" | "Diseño" | "Marketing" | "Otro"
export type Role = "Administrador" | "Editor" | "Lector"

export interface Project {
  id: string
  name: string
  description: string
  category: Category
  priority: Priority
  status: ProjectStatus
}

export interface Member {
  userId: string
  role: Role
  name: string
  email: string
  position: string
  birthdate: string
  phone: string
  projectId: string
  isActive: boolean
}

export interface Task {
  id: string
  description: string
  projectId: string
  status: TaskStatus
  priority: Priority
  userId: string
  dateline: string
}

export const PROJECT_STATUSES: ProjectStatus[] = ["Planificado", "En progreso", "En revisión", "Completado"]
export const TASK_STATUSES: TaskStatus[] = ["Pendiente", "En progreso", "Completado"]
export const PRIORITIES: Priority[] = ["Baja", "Media", "Alta", "Urgente"]
export const CATEGORIES: Category[] = ["Desarrollo Web", "Desarrollo Mobile", "Diseño", "Marketing", "Otro"]
export const ROLES: Role[] = ["Administrador", "Editor", "Lector"]

export const initialProjects: Project[] = [
  { id: "p1", name: "E-commerce Platform", description: "Plataforma de comercio electrónico con Next.js", category: "Desarrollo Web", priority: "Alta", status: "En progreso" },
  { id: "p2", name: "Mobile App", description: "Aplicación móvil con React Native", category: "Desarrollo Mobile", priority: "Media", status: "En revisión" },
  { id: "p3", name: "Dashboard Analytics", description: "Panel de análisis con visualizaciones", category: "Desarrollo Web", priority: "Baja", status: "Planificado" },
  { id: "p4", name: "API Gateway", description: "Microservicios con Node.js", category: "Desarrollo Web", priority: "Alta", status: "En progreso" },
  { id: "p5", name: "Design System", description: "Librería de componentes reutilizables", category: "Diseño", priority: "Media", status: "Completado" },
  { id: "p6", name: "Marketing Website", description: "Sitio web institucional", category: "Marketing", priority: "Media", status: "En progreso" },
]

export const initialMembers: Member[] = [
  { userId: "u1", role: "Editor", name: "María García", email: "maria@example.com", position: "Frontend Developer", birthdate: "1998-03-14", phone: "987654321", projectId: "p1", isActive: true },
  { userId: "u2", role: "Editor", name: "Juan Pérez", email: "juan@example.com", position: "Backend Developer", birthdate: "1996-07-22", phone: "987654322", projectId: "p4", isActive: true },
  { userId: "u3", role: "Editor", name: "Ana López", email: "ana@example.com", position: "UI/UX Designer", birthdate: "1999-11-05", phone: "987654323", projectId: "p2", isActive: false },
  { userId: "u4", role: "Administrador", name: "Carlos Ruiz", email: "carlos@example.com", position: "DevOps Engineer", birthdate: "1995-01-30", phone: "987654324", projectId: "p4", isActive: true },
  { userId: "u5", role: "Administrador", name: "Laura Martínez", email: "laura@example.com", position: "Project Manager", birthdate: "1994-09-18", phone: "987654325", projectId: "p6", isActive: true },
  { userId: "u6", role: "Lector", name: "Diego Torres", email: "diego@example.com", position: "Data Analyst", birthdate: "2000-05-09", phone: "987654326", projectId: "p3", isActive: true },
  { userId: "u7", role: "Editor", name: "Sofía Ramírez", email: "sofia@example.com", position: "Product Designer", birthdate: "1997-12-02", phone: "987654327", projectId: "p5", isActive: true },
]

export const initialTasks: Task[] = [
  { id: "t1", description: "Implementar autenticación", projectId: "p1", status: "En progreso", priority: "Alta", userId: "u1", dateline: "2026-11-15" },
  { id: "t2", description: "Diseñar pantalla de perfil", projectId: "p2", status: "Pendiente", priority: "Media", userId: "u3", dateline: "2026-11-20" },
  { id: "t3", description: "Configurar CI/CD", projectId: "p4", status: "Completado", priority: "Alta", userId: "u4", dateline: "2026-11-10" },
  { id: "t4", description: "Optimizar queries SQL", projectId: "p1", status: "En progreso", priority: "Urgente", userId: "u2", dateline: "2026-11-12" },
  { id: "t5", description: "Documentar API endpoints", projectId: "p4", status: "Pendiente", priority: "Baja", userId: "u2", dateline: "2026-11-25" },
  { id: "t6", description: "Crear librería de botones", projectId: "p5", status: "Completado", priority: "Media", userId: "u7", dateline: "2026-10-20" },
  { id: "t7", description: "Documentar tokens de diseño", projectId: "p5", status: "Completado", priority: "Baja", userId: "u7", dateline: "2026-10-25" },
  { id: "t8", description: "Definir métricas del panel", projectId: "p3", status: "Pendiente", priority: "Media", userId: "u6", dateline: "2026-12-01" },
  { id: "t9", description: "Diseñar landing principal", projectId: "p6", status: "En progreso", priority: "Alta", userId: "u5", dateline: "2026-11-18" },
  { id: "t10", description: "Pruebas en dispositivos iOS", projectId: "p2", status: "En progreso", priority: "Alta", userId: "u3", dateline: "2026-11-08" },
  { id: "t11", description: "Integrar pasarela de pago", projectId: "p1", status: "Pendiente", priority: "Urgente", userId: "u1", dateline: "2026-11-22" },
  { id: "t12", description: "Configurar rate limiting", projectId: "p4", status: "En progreso", priority: "Media", userId: "u4", dateline: "2026-11-14" },
]