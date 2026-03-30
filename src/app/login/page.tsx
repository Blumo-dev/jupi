import { InitForm } from "@/app/init/InitForm"
import { LoginForm } from "./LoginForm"
import prisma from "@/lib/prisma"
import { getSystemSettings } from "../dashboard/settings/actions"

export default async function LoginPage() {
  const adminCount = await prisma.user.count({
    where: { role: "SUPER_ADMIN" }
  })

  const settings = await getSystemSettings()
  const systemName = settings?.systemName || "Jupi"

  // If no super admin exists, recommend init
  const needsInit = adminCount === 0

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      {needsInit ? (
        <div className="w-full max-w-md text-center">
          <h2 className="text-xl text-destructive mb-4 font-bold">Rendszer Értesítés</h2>
          <p className="mb-4">Még nem lett beállítva a {systemName} rendszergazdai fiókja.</p>
          <InitForm systemName={systemName} />
        </div>
      ) : (
        <LoginForm systemName={systemName} />
      )}
    </div>
  )
}
