"use client"

import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DatePickerProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  dropdown?: boolean
  invalid?: boolean
}

function parseDate(value: string) {
  if (!value) return undefined
  const [y, m, d] = value.split("-").map(Number)
  return new Date(y, m - 1, d)
}

function toIso(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  return `${y}-${m}-${d}`
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Selecciona una fecha",
  dropdown = false,
  invalid = false,
}: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const selected = parseDate(value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          aria-invalid={invalid}
          className="w-full justify-start font-normal aria-invalid:border-destructive"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selected ? (
            selected.toLocaleDateString("es-PE", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          defaultMonth={selected}
          captionLayout={dropdown ? "dropdown" : "label"}
          startMonth={dropdown ? new Date(1950, 0) : undefined}
          endMonth={dropdown ? new Date(2015, 11) : undefined}
          onSelect={(date) => {
            if (date) onChange(toIso(date))
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}