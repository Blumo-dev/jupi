"use server"

import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { randomUUID } from "crypto"
import { sendInviteEmail } from "@/lib/email"

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
    const newUser = await prisma.user.create({
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

    // Email Kiküldés
    const emailResponse = await sendInviteEmail({
      email: newUser.email,
      name: newUser.name || "",
      token,
    })

    if (emailResponse.error) {
      console.error("Az e-mail kiküldése sikertelen:", emailResponse.error)
      return { success: `Munkatárs rögzítve, de a meghívó e-mail hibára futott: ${emailResponse.error}` }
    }

  } catch (error) {
    return { error: "Hiba történt a felhasználó rögzítésekor." }
  }

  revalidatePath("/dashboard/users")
  redirect("/dashboard/users")
}
