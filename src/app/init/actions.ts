"use server"

import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"

export async function createSuperAdmin(formData: FormData) {
  const email = formData.get("email")?.toString()
  const password = formData.get("password")?.toString()
  const name = formData.get("name")?.toString()

  if (!email || !password || !name) {
    return { error: "Minden mező kitöltése kötelező!" }
  }

  // Double check if any super admin exists
  const existingAdminCount = await prisma.user.count({
    where: { role: "SUPER_ADMIN" },
  })

  if (existingAdminCount > 0) {
    return { error: "A rendszer már inicializálva van." }
  }

  const existingEmail = await prisma.user.findUnique({
    where: { email },
  })

  if (existingEmail) {
    return { error: "Ez az email cím már foglalt." }
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await prisma.user.create({
    data: {
      email,
      name,
      passwordHash: hashedPassword,
      role: "SUPER_ADMIN",
    },
  })

  redirect("/login")
}
