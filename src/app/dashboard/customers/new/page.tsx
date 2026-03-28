import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { NewCustomerForm } from "./NewCustomerForm"

export default async function NewCustomerPage() {
  const session = await auth()
  
  if (!session?.user || session.user.role === "CUSTOMER") {
    redirect("/dashboard")
  }

  const companies = await prisma.company.findMany({
    where: { status: "ACTIVE" }, // Csak aktív cégekhez adhatunk hozzáférést
    select: { id: true, name: true, shortName: true },
    orderBy: { name: "asc" }
  })

  return (
    <div className="space-y-6">
      <NewCustomerForm companies={companies} />
    </div>
  )
}
