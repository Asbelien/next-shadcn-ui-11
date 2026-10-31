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
import { Switch } from "@/components/ui/switch"
import { DatePicker } from "@/components/DatePicker"
import { FormAlert } from "@/components/FormAlert"
import { useStore } from "@/lib/store"
import { ROLES, type Member, type Role } from "@/lib/data"

interface MemberFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  member?: Member
}

function MemberFormBody({
  member,
  onClose,
}: {
  member?: Member
  onClose: () => void
}) {
  const { members, projects, addMember, updateMember } = useStore()

  const [name, setName] = useState(member?.name ?? "")
  const [email, setEmail] = useState(member?.email ?? "")
  const [position, setPosition] = useState(member?.position ?? "")
  const [role, setRole] = useState<Role | "">(member?.role ?? "")
  const [birthdate, setBirthdate] = useState(member?.birthdate ?? "")
  const [phone, setPhone] = useState(member?.phone ?? "")
  const [projectId, setProjectId] = useState(member?.projectId || "none")
  const [isActive, setIsActive] = useState(member?.isActive ?? true)
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const found: string[] = []

    if (name.trim().length < 3) found.push("El nombre debe tener al menos 3 caracteres")
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      found.push("Ingresa un email válido")
    else if (
      members.some(
        (m) =>
          m.userId !== member?.userId &&
          m.email.toLowerCase() === email.trim().toLowerCase()
      )
    )
      found.push("Ya existe un miembro con ese email")
    if (position.trim().length < 2) found.push("Ingresa el cargo del miembro")
    if (!role) found.push("Selecciona un rol")
    if (!birthdate) found.push("Selecciona la fecha de nacimiento")
    if (!/^9\d{8}$/.test(phone)) found.push("El teléfono debe tener 9 dígitos y empezar con 9")

    setErrors(found)
    if (found.length > 0) return

    setLoading(true)
    setTimeout(() => {
      const data = {
        role: role as Role,
        name: name.trim(),
        email: email.trim(),
        position: position.trim(),
        birthdate,
        phone,
        projectId: projectId === "none" ? "" : projectId,
        isActive,
      }
      if (member) updateMember(member.userId, data)
      else addMember(data)
      setLoading(false)
      onClose()
    }, 1000)
  }

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{member ? "Editar Miembro" : "Nuevo Miembro"}</DialogTitle>
        <DialogDescription>
          Completa los datos del miembro del equipo.
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        <FormAlert errors={errors} />

        <div className="grid gap-2">
          <Label htmlFor="member-name">
            Nombre completo <span className="text-red-500">*</span>
          </Label>
          <Input
            id="member-name"
            placeholder="Nombre y apellido"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="member-email">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="member-email"
            type="email"
            placeholder="correo@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="member-position">
              Cargo <span className="text-red-500">*</span>
            </Label>
            <Input
              id="member-position"
              placeholder="Frontend Developer"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>
              Rol <span className="text-red-500">*</span>
            </Label>
            <Select value={role} onValueChange={(v) => setRole(v as Role)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label>
              Fecha de nacimiento <span className="text-red-500">*</span>
            </Label>
            <DatePicker
              value={birthdate}
              onChange={setBirthdate}
              placeholder="Selecciona"
              dropdown
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="member-phone">
              Teléfono <span className="text-red-500">*</span>
            </Label>
            <Input
              id="member-phone"
              inputMode="numeric"
              maxLength={9}
              placeholder="987654321"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label>Proyecto</Label>
          <Select value={projectId} onValueChange={setProjectId}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Sin proyecto</SelectItem>
              {projects.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between rounded-md border p-3">
          <div>
            <Label htmlFor="member-active">Miembro activo</Label>
            <p className="text-xs text-muted-foreground">
              Los miembros inactivos no cuentan en las métricas.
            </p>
          </div>
          <Switch id="member-active" checked={isActive} onCheckedChange={setIsActive} />
        </div>
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Spinner className="mr-2" />}
          {loading ? "Guardando..." : member ? "Guardar Cambios" : "Crear Miembro"}
        </Button>
      </DialogFooter>
    </form>
  )
}

export function MemberForm({ open, onOpenChange, member }: MemberFormProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[525px]">
        <MemberFormBody member={member} onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}