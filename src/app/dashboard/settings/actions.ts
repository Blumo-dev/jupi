"use server"

import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function getSystemSettings() {
  // Singleton: ha nem létezik, alapértékekkel létrehozzuk
  const settings = await (prisma as any).systemSettings.upsert({
    where: { id: "system" },
    update: {},
    create: { id: "system", updatedAt: new Date() },
  })
  return settings
}

export async function updateSystemSettings(formData: FormData) {
  const session = await auth()

  if (!session?.user || (session.user as any).role !== "SUPER_ADMIN") {
    return { error: "Nincs jogosultságod ehhez a művelethez!" }
  }

  // Általános
  const systemName = formData.get("systemName")?.toString() || "Jupi"
  const systemTimezone = formData.get("systemTimezone")?.toString() || "Europe/Budapest"
  const systemLanguage = formData.get("systemLanguage")?.toString() || "hu"
  const systemTheme = formData.get("systemTheme")?.toString() || "light"

  // Feladatok
  const taskReminderEnabled = formData.get("taskReminderEnabled") === "on"
  const taskReminderDays = parseInt(formData.get("taskReminderDays")?.toString() || "3")
  
  // Biztonság
  const passwordExpiryDays = parseInt(formData.get("passwordExpiryDays")?.toString() || "0")
  const twoFactorRequired = formData.get("twoFactorRequired")?.toString() || "NONE"
  const maintenanceMode = formData.get("maintenanceMode") === "on"

  // Értesítések
  const emailNotificationsEnabled = formData.get("emailNotificationsEnabled") === "on"

  // SMTP
  const smtpEnabled = formData.get("smtpEnabled") === "on"
  const smtpHost = formData.get("smtpHost")?.toString() || null
  const smtpPort = formData.get("smtpPort") ? parseInt(formData.get("smtpPort")!.toString()) : null
  const smtpUser = formData.get("smtpUser")?.toString() || null
  const smtpPassword = formData.get("smtpPassword")?.toString() || null
  const smtpFromName = formData.get("smtpFromName")?.toString() || null
  const smtpFromEmail = formData.get("smtpFromEmail")?.toString() || null

  try {
    await (prisma as any).systemSettings.upsert({
      where: { id: "system" },
      update: {
        systemName,
        systemTimezone,
        systemLanguage,
        systemTheme,
        taskReminderEnabled,
        taskReminderDays: isNaN(taskReminderDays) ? 3 : taskReminderDays,
        passwordExpiryDays: isNaN(passwordExpiryDays) ? 0 : passwordExpiryDays,
        twoFactorRequired,
        emailNotificationsEnabled,
        maintenanceMode,
        smtpEnabled,
        smtpHost,
        smtpPort,
        smtpUser,
        smtpPassword,
        smtpFromName,
        smtpFromEmail,
      },
      create: {
        id: "system",
        systemName,
        systemTimezone,
        systemLanguage,
        systemTheme,
        taskReminderEnabled,
        taskReminderDays: isNaN(taskReminderDays) ? 3 : taskReminderDays,
        passwordExpiryDays: isNaN(passwordExpiryDays) ? 0 : passwordExpiryDays,
        twoFactorRequired,
        emailNotificationsEnabled,
        maintenanceMode,
        smtpEnabled,
        smtpHost,
        smtpPort,
        smtpUser,
        smtpPassword,
        smtpFromName,
        smtpFromEmail,
        updatedAt: new Date(),
      },
    })
  } catch (error) {
    console.error(error)
    return { error: "Hiba történt a mentés során." }
  }

  revalidatePath("/dashboard/settings")
  return { success: true }
}
