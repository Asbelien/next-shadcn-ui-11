import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface FormAlertProps {
  errors: string[]
  title?: string
}

export function FormAlert({ errors, title = "Revisa el formulario" }: FormAlertProps) {
  if (errors.length === 0) return null

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        <ul className="list-disc pl-4">
          {errors.map((error) => (
            <li key={error}>{error}</li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  )
}