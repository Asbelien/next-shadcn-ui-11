"use client"

import { useState } from "react"
import { Pencil, Plus, Trash2, Users } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ConfirmDelete } from "@/components/ConfirmDelete"
import { MemberForm } from "@/components/MemberForm"
import { useStore } from "@/lib/store"
import type { Member, Role } from "@/lib/data"

const ROLE_STYLES: Record<Role, string> = {
  Administrador: "bg-emerald-600 text-white",
  Editor: "bg-sky-100 text-sky-700",
  Lector: "bg-slate-100 text-slate-700",
}

const AVATAR_COLORS = [
  "bg-emerald-100 text-emerald-700",
  "bg-sky-100 text-sky-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-teal-100 text-teal-700",
]

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

function formatDate(value: string) {
  const [y, m, d] = value.split("-").map(Number)
  return new Date(y, m - 1, d).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export function TeamTab() {
  const { members, deleteMember, getProjectName } = useStore()

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Member | undefined>(undefined)
  const [deleting, setDeleting] = useState<Member | null>(null)

  const activeCount = members.filter((m) => m.isActive).length

  const openCreate = () => {
    setEditing(undefined)
    setFormOpen(true)
  }

  const openEdit = (member: Member) => {
    setEditing(member)
    setFormOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Equipo</h2>
          <p className="text-sm text-muted-foreground">
            {members.length} miembro(s) · {activeCount} activos
          </p>
        </div>
        <Button onClick={openCreate} className="rounded-xl">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Miembro
        </Button>
      </div>

      {members.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border-2 border-dashed bg-white py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
            <Users className="h-7 w-7" />
          </div>
          <p className="text-sm text-muted-foreground">No hay miembros registrados.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/5">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead className="pl-6">Miembro</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Nacimiento</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Proyecto</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="pr-6 text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((m, i) => (
                <TableRow key={m.userId} className="transition-colors hover:bg-emerald-50/50">
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback
                          className={`font-semibold ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}
                        >
                          {initials(m.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{m.name}</p>
                        <p className="text-xs text-muted-foreground">{m.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{m.position}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`border-transparent font-medium ${ROLE_STYLES[m.role]}`}>
                      {m.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(m.birthdate)}</TableCell>
                  <TableCell className="tabular-nums text-muted-foreground">{m.phone}</TableCell>
                  <TableCell>
                    {m.projectId ? (
                      getProjectName(m.projectId)
                    ) : (
                      <span className="text-muted-foreground">Sin proyecto</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center gap-2 text-sm">
                      <span
                        className={`h-2 w-2 rounded-full ${m.isActive ? "bg-emerald-500" : "bg-slate-300"}`}
                      />
                      {m.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        size="icon"
                        variant="outline"
                        className="rounded-lg"
                        aria-label="Editar miembro"
                        onClick={() => openEdit(m)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        className="rounded-lg hover:bg-rose-50"
                        aria-label="Eliminar miembro"
                        onClick={() => setDeleting(m)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <MemberForm open={formOpen} onOpenChange={setFormOpen} member={editing} />

      <ConfirmDelete
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title="Eliminar miembro"
        description={`Se eliminará a "${deleting?.name ?? ""}" y sus tareas quedarán sin asignar. Esta acción no se puede deshacer.`}
        onConfirm={() => deleting && deleteMember(deleting.userId)}
      />
    </div>
  )
}