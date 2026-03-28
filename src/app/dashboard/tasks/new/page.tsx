import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { NewTaskForm } from "./NewTaskForm"

export default async function NewTaskPage() {
  const session = await auth()
  
  // Custom auth check
  if (!session?.user || session.user.role === "CUSTOMER") {
    redirect("/dashboard")
  }

  // Admin/Super Admin needs list of companies
  const companies = await prisma.company.findMany({ select: { id: true, name: true } })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Új Határidő Kiosztása</h1>
        <p className="text-muted-foreground">Teendők, bevallások vagy adatszolgáltatások bekérése az érintett Cégektől.</p>
      </div>
      <NewTaskForm companies={companies} />
    </div>
  )
}
