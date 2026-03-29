import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { EditUserForm } from "./EditUserForm"

export default async function EditUserPage(props: { params: Promise<{ id: string }> }) {
  const session = await auth()
  
  if (!session?.user || session.user.role !== "SUPER_ADMIN") {
    redirect("/dashboard")
  }

  const { id } = await props.params

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      passwordHash: true,
    }
  })

  if (!user) {
    redirect("/dashboard/users")
  }

  const isCurrentUser = session.user.id === user.id
  const isActivated = !!user.passwordHash

  return (
    <div className="space-y-6">
      <EditUserForm user={user} isCurrentUser={isCurrentUser} isActivated={isActivated} />
    </div>
  )
}
