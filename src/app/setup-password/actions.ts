"use server"

import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"

export async function verifyAndSetPassword(formData: FormData) {
  const token = formData.get("token")?.toString()
  const password = formData.get("password")?.toString()

  if (!token || !password) {
    return { error: "Minden kötelező mezőt tölts ki!" }
  }

  // Find password reset token
  const vt = await prisma.passwordResetToken.findFirst({
    where: { token }
  })

  // Has token expired or doesn't exist?
  if (!vt || vt.expiresAt < new Date()) {
    return { error: "A meghívó link érvénytelen vagy lejárt." }
  }

  // Find the associated user
  const user = await prisma.user.findUnique({
    where: { email: vt.email }
  })

  if (!user) {
    return { error: "Nem található a felhasználó." }
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    
    await prisma.user.update({
      where: { email: user.email },
      data: { passwordHash: hashedPassword }
    })

    // Delete token so it can't be used again
    await prisma.passwordResetToken.delete({
      where: { id: vt.id }
    })
  } catch (err) {
    return { error: "Hiba történt a jelszó módosítása közben." }
  }

  redirect("/login?setup=success")
}
