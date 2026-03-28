"use server"

import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { randomUUID } from "crypto"

export async function createAdmin(formData: FormData) {
  const session = await auth()
  
  if (!session?.user || session.user.role !== "SUPER_ADMIN") {
    return { error: "Nincs jogosultságod új könyvelő (Admin) rögzítéséhez!" }
  }

  const name = formData.get("name")?.toString()
  const email = formData.get("email")?.toString()

  if (!name || !email) {
    return { error: "Minden mező kitöltése kötelező!" }
  }

  const existingEmail = await prisma.user.findUnique({ where: { email } })
  if (existingEmail) {
    return { error: "Az email cím már foglalt a rendszerben." }
  }

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        role: "ADMIN",
        companyId: null, 
      }
    })

    const token = randomUUID()
    await prisma.passwordResetToken.create({
      data: {
        email: email,
        token: token,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
      }
    })

    console.log(`[EMAIL SIMULATOR] Meghívó elküldve az Adminnak: ${email}`)
    console.log(`[EMAIL SIMULATOR] Link: http://localhost:3000/setup-password?token=${token}`)

  } catch (error) {
    return { error: "Hiba történt a felhasználó rögzítésekor." }
  }

  revalidatePath("/dashboard/users")
  redirect("/dashboard/users")
}
