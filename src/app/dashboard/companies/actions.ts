"use server"

import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createCompany(formData: FormData) {
  const session = await auth()
  
  if (!session?.user || session.user.role !== "SUPER_ADMIN") {
    return { error: "Nincs jogosultságod ehhez a művelethez!" }
  }

  const name = formData.get("name")?.toString()
  const shortName = formData.get("shortName")?.toString()
  const taxNumber = formData.get("taxNumber")?.toString()
  const companyRegNumber = formData.get("companyRegNumber")?.toString()
  const email = formData.get("email")?.toString()
  const status = formData.get("status")?.toString() as "ACTIVE" | "PAUSED" | "CLOSED" | undefined

  if (!name) {
    return { error: "A Cégnév megadása kötelező." }
  }

  try {
    await prisma.company.create({
      data: {
        name,
        shortName,
        taxNumber,
        companyRegNumber,
        email,
        status: status || "ACTIVE",
      }
    })
  } catch (error) {
    return { error: "Hiba történt a cég mentésekor." }
  }

  revalidatePath("/dashboard/companies")
  redirect("/dashboard/companies")
}
