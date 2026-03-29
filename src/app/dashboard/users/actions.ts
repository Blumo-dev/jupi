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
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // 3 nap
      }
    })

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

export async function updateUser(userId: string, formData: FormData) {
  const session = await auth()
  
  if (!session?.user || session.user.role !== "SUPER_ADMIN") {
    return { error: "Nincs jogosultságod!" }
  }

  const name = formData.get("name")?.toString()
  const role = formData.get("role")?.toString() as "SUPER_ADMIN" | "ADMIN" | undefined

  if (!name) {
    return { error: "A név megadása kötelező." }
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { name, ...(role ? { role } : {}) }
    })
  } catch {
    return { error: "Hiba történt a módosításkor." }
  }

  revalidatePath("/dashboard/users")
  revalidatePath(`/dashboard/users/${userId}`)
  return { success: true }
}

export async function deleteUser(userId: string) {
  const session = await auth()
  
  if (!session?.user || session.user.role !== "SUPER_ADMIN") {
    return { error: "Nincs jogosultságod!" }
  }

  if (session.user.id === userId) {
    return { error: "Saját magadat nem törölheted!" }
  }

  try {
    await prisma.user.delete({ where: { id: userId } })
  } catch {
    return { error: "Hiba történt a törléskor." }
  }

  revalidatePath("/dashboard/users")
  redirect("/dashboard/users")
}

export async function resendInvite(userId: string) {
  const session = await auth()
  
  if (!session?.user || session.user.role !== "SUPER_ADMIN") {
    return { error: "Nincs jogosultságod!" }
  }

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return { error: "Felhasználó nem található." }
  if (user.passwordHash) return { error: "Ez a felhasználó már aktiválta a fiókját." }

  // Töröljük a régi tokeneket
  await prisma.passwordResetToken.deleteMany({ where: { email: user.email } })

  const token = randomUUID()
  await prisma.passwordResetToken.create({
    data: {
      email: user.email,
      token,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
    }
  })

  const emailResponse = await sendInviteEmail({
    email: user.email,
    name: user.name || "",
    token,
  })

  if (emailResponse.error) {
    return { error: `Email hiba: ${emailResponse.error}` }
  }

  return { success: true }
}
