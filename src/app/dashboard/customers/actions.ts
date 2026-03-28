"use server"

import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { randomUUID } from "crypto"

export async function createCustomer(formData: FormData) {
  const session = await auth()
  
  if (!session?.user || session.user.role === "CUSTOMER") {
    return { error: "Nincs jogosultságod ügyfeleket meghívni!" }
  }

  const name = formData.get("name")?.toString()
  const email = formData.get("email")?.toString()
  const companyId = formData.get("companyId")?.toString()

  if (!name || !email || !companyId) {
    return { error: "Minden mező kitöltése kötelező!" }
  }

  const existingEmail = await prisma.user.findUnique({ where: { email } })
  if (existingEmail) {
    return { error: "Az email cím már regisztrálva van! Próbálj újat." }
  }

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        role: "CUSTOMER",
        companyId, 
      }
    })

    const token = randomUUID()
    await prisma.passwordResetToken.create({
      data: {
        email: email,
        token: token,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // 3 days validity
      }
    })

    console.log(`[EMAIL SIMULATOR] Ügyfél meghívó (Jelszó beállító) link kiküldve: ${email}`)
    console.log(`[EMAIL SIMULATOR] Link: http://localhost:3000/setup-password?token=${token}`)

  } catch (error) {
    return { error: "Hiba történt az ügyfél létrehozása közben." }
  }

  revalidatePath("/dashboard/customers")
  redirect("/dashboard/customers")
}
