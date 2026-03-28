import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { NewUserForm } from "./NewUserForm"

export default async function NewUserPage() {
  const session = await auth()
  
  if (session?.user.role !== "SUPER_ADMIN") {
    redirect("/dashboard")
  }

  return (
    <div className="space-y-6">
      <NewUserForm />
    </div>
  )
}
