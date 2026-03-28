import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { InitForm } from "./InitForm"

export default async function InitPage() {
  const adminCount = await prisma.user.count({
    where: { role: "SUPER_ADMIN" }
  })

  // Ha már létezik egy Super Admin, az Init oldal lezár és a bejelentkezéshez irányít
  if (adminCount > 0) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <InitForm />
    </div>
  )
}
