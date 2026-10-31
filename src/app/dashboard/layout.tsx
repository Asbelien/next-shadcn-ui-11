import { StoreProvider } from "@/lib/store"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <StoreProvider>{children}</StoreProvider>
}