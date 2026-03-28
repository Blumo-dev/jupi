import prisma from "@/lib/prisma"
import { SetupForm } from "./SetupForm"

export default async function SetupPasswordPage(props: { searchParams: Promise<{ token?: string }> }) {
  const params = await props.searchParams
  const token = params.token

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <h1 className="text-xl font-bold text-destructive text-center">Érvénytelen vagy hiányzó link! <br /> <span className="text-sm font-normal text-muted-foreground mt-2 block">Kérlek használt az eredeti emailes linket a beállításhoz.</span></h1>
      </div>
    )
  }

  const vt = await prisma.passwordResetToken.findFirst({
    where: { token, expiresAt: { gt: new Date() } }
  })

  // Has token expired or already used?
  if (!vt) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <h1 className="text-xl font-bold text-destructive text-center">A meghívó lejárt vagy már használatban van!</h1>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <SetupForm token={token} email={vt.email} />
    </div>
  )
}
