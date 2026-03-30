import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { getSystemSettings } from "./actions"
import { SettingsForm } from "./SettingsForm"

export default async function SettingsPage() {
  const session = await auth()
  
  // Csak SUPER_ADMIN töltheti be
  if (!session?.user || (session.user as any).role !== "SUPER_ADMIN") {
    redirect("/dashboard")
  }

  const settings = await getSystemSettings()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Rendszerbeállítások</h1>
        <p className="text-muted-foreground">Konfiguráld a Jupi SaaS portál globális paramétereit.</p>
      </div>
      
      <SettingsForm initialSettings={settings} />
    </div>
  )
}
