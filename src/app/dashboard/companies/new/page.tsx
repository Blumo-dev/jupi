import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { NewCompanyForm } from "./NewCompanyForm"

export default async function NewCompanyPage() {
  const session = await auth()
  
  if (session?.user.role === "CUSTOMER") {
    redirect("/dashboard")
  }

  return (
    <div className="space-y-6">
      <NewCompanyForm />
    </div>
  )
}
