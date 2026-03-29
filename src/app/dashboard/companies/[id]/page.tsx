import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { EditCompanyForm } from "./EditCompanyForm"

export default async function EditCompanyPage(props: { params: Promise<{ id: string }> }) {
  const session = await auth()
  
  if (!session?.user || session.user.role === "CUSTOMER") {
    redirect("/dashboard")
  }

  const { id } = await props.params

  const company = await prisma.company.findUnique({
    where: { id },
    include: {
      users: {
        where: { role: "CUSTOMER" },
        take: 1
      }
    }
  })

  if (!company) {
    redirect("/dashboard/companies")
  }

  const contactUser = company.users[0] || null

  return (
    <div className="space-y-6">
      <EditCompanyForm company={company} contactUser={contactUser} />
    </div>
  )
}
