"use client"

import { useState } from "react"
import { Bell, CalendarClock, CheckCircle2, Mail } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
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
import { FormAlert } from "@/components/FormAlert"

const LANGUAGES = ["Español", "English", "Português"]
const TIMEZONES = ["America/Lima (UTC-5)", "America/Bogota (UTC-5)", "America/Mexico_City (UTC-6)", "America/Santiago (UTC-3)"]

interface Settings {
  organization: string
  contactEmail: string
  language: string
  timezone: string
  emailNotifications: boolean
  deadlineReminders: boolean
  weeklySummary: boolean
}

const defaultSettings: Settings = {
  organization: "Mi Organización",
  contactEmail: "contacto@example.com",
  language: "Español",
  timezone: "America/Lima (UTC-5)",
  emailNotifications: true,
  deadlineReminders: true,
  weeklySummary: false,
}

const NOTIFICATIONS = [
  {
    key: "emailNotifications",
    label: "Notificaciones por email",
    description: "Recibe avisos cuando se asignen o cambien tareas.",
    icon: Mail,
    bubble: "bg-sky-100 text-sky-600",
  },
  {
    key: "deadlineReminders",
    label: "Recordatorios de fecha límite",
    description: "Te avisamos un día antes del vencimiento de una tarea.",
    icon: CalendarClock,
    bubble: "bg-amber-100 text-amber-600",
  },
  {
    key: "weeklySummary",
    label: "Resumen semanal",
    description: "Un correo con el avance de todos tus proyectos.",
    icon: Bell,
    bubble: "bg-emerald-100 text-emerald-600",
  },
] as const

export function SettingsTab() {
  const [saved, setSaved] = useState<Settings>(defaultSettings)
  const [form, setForm] = useState<Settings>(defaultSettings)
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const update = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setSuccess(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const found: string[] = []

    if (form.organization.trim().length < 3)
      found.push("El nombre de la organización debe tener al menos 3 caracteres")
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail.trim()))
      found.push("Ingresa un email de contacto válido")

    setErrors(found)
    setSuccess(false)
    if (found.length > 0) return

    setLoading(true)
    setTimeout(() => {
      setSaved({ ...form })
      setLoading(false)
      setSuccess(true)
    }, 1500)
  }

  const handleReset = () => {
    setForm(saved)
    setErrors([])
    setSuccess(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Configuración</h2>
        <p className="text-sm text-muted-foreground">Administra las preferencias de tu cuenta</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl space-y-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5 sm:p-8"
      >
        <FormAlert errors={errors} />

        {success && (
          <Alert className="rounded-2xl border-emerald-200 bg-emerald-50 text-emerald-800">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <AlertTitle>Configuración guardada</AlertTitle>
            <AlertDescription className="text-emerald-700">
              Los cambios se aplicaron correctamente (simulado).
            </AlertDescription>
          </Alert>
        )}

        <section className="space-y-4">
          <h3 className="text-base font-semibold">General</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="settings-org">
                Organización <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="settings-org"
                className="h-10 rounded-xl"
                value={form.organization}
                onChange={(e) => update("organization", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="settings-email">
                Email de contacto <span className="text-rose-500">*</span>
              </Label>
              <Input
                id="settings-email"
                type="email"
                className="h-10 rounded-xl"
                value={form.contactEmail}
                onChange={(e) => update("contactEmail", e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Idioma</Label>
              <Select value={form.language} onValueChange={(v) => update("language", v)}>
                <SelectTrigger className="h-10 w-full rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Zona horaria</Label>
              <Select value={form.timezone} onValueChange={(v) => update("timezone", v)}>
                <SelectTrigger className="h-10 w-full rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-base font-semibold">Notificaciones</h3>

          <div className="space-y-3">
            {NOTIFICATIONS.map((n) => (
              <div
                key={n.key}
                className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4 transition-colors hover:bg-emerald-50/60"
              >
                <div className="flex items-center gap-4">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${n.bubble}`}>
                    <n.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <Label htmlFor={`settings-${n.key}`}>{n.label}</Label>
                    <p className="text-xs text-muted-foreground">{n.description}</p>
                  </div>
                </div>
                <Switch
                  id={`settings-${n.key}`}
                  checked={form[n.key]}
                  onCheckedChange={(v) => update(n.key, v)}
                />
              </div>
            ))}
          </div>
        </section>

        <div className="flex gap-2 border-t pt-6">
          <Button type="submit" disabled={loading} className="rounded-xl">
            {loading && <Spinner className="mr-2" />}
            {loading ? "Guardando..." : "Guardar cambios"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            onClick={handleReset}
            disabled={loading}
          >
            Restablecer
          </Button>
        </div>
      </form>
    </div>
  )
}