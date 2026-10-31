"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface ConfirmDeleteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  onConfirm: () => void
}

export function ConfirmDelete({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
}: ConfirmDeleteProps) {
  const [loading, setLoading] = useState(false)

  const handleConfirm = () => {
    setLoading(true)
    setTimeout(() => {
      onConfirm()
      setLoading(false)
      onOpenChange(false)
    }, 1000)
  }

  return (
    <AlertDialog open={open} onOpenChange={(value) => !loading && onOpenChange(value)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
          <Button variant="destructive" onClick={handleConfirm} disabled={loading}>
            {loading && <Spinner className="mr-2" />}
            {loading ? "Eliminando..." : "Eliminar"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}