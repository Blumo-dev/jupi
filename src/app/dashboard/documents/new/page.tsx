import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { NewDocumentForm } from "./NewDocumentForm"

export default async function NewDocumentPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  const role = session.user.role

  // Only admins need the list of active companies to assign documents to
  let companies: {id: string, name: string}[] = []
  if (role === "SUPER_ADMIN" || role === "ADMIN") {
    companies = await prisma.company.findMany({
      where: { status: "ACTIVE" },
      select: { id: true, name: true },
      orderBy: { name: "asc" }
    })
  }

  return (
    <div className="space-y-6">
      <NewDocumentForm companies={companies} userRole={role} />
    </div>
  )
}
