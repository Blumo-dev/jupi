import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { NewMessageForm } from "./NewMessageForm"

export default async function NewThreadPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")
  
  const role = session.user.role

  let companies: { id: string, name: string }[] = []
  
  if (role === "SUPER_ADMIN" || role === "ADMIN") {
    companies = await prisma.company.findMany({ select: { id: true, name: true } })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Új Beszélgetés</h1>
        <p className="text-muted-foreground">Kezdeményezz közvetlen kapcsolatot az ügyfelekkel vagy a könyvelőirodával.</p>
      </div>
      <NewMessageForm companies={companies} userRole={role} />
    </div>
  )
}
