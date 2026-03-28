"use server"

import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createTask(formData: FormData) {
  const session = await auth()
  
  // Only SUPER_ADMIN and ADMIN can create Tasks for companies
  if (!session?.user || session.user.role === "CUSTOMER") {
    return { error: "Nincs jogosultságod feladatot kiírni!" }
  }

  const title = formData.get("title")?.toString()
  const description = formData.get("description")?.toString()
  const deadlineStr = formData.get("deadline")?.toString()
  const priority = formData.get("priority")?.toString() as any
  const companyId = formData.get("companyId")?.toString()

  if (!title || !deadlineStr || !companyId) {
    return { error: "Cím, Cég és Határidő megadása kötelező!" }
  }

  try {
    const deadline = new Date(deadlineStr)
    
    await prisma.task.create({
      data: {
        title,
        description,
        deadline,
        priority: priority || "NORMAL",
        status: "NEW",
        companyId,
      }
    })

  } catch (error) {
    console.error(error)
    return { error: "Hiba történt a feladat mentésekor." }
  }

  revalidatePath("/dashboard/tasks")
  redirect("/dashboard/tasks")
}

export async function updateTaskStatus(formData: FormData) {
  const session = await auth()
  if (!session?.user) return;

  const taskId = formData.get("taskId")?.toString()
  const newStatus = formData.get("status")?.toString() as any

  if (!taskId || !newStatus) return;

  try {
    const task = await prisma.task.findUnique({
      where: { id: taskId }
    })
    
    if (!task) return;

    // Security check: if CUSTOMER, they can only update tasks for their company
    if (session.user.role === "CUSTOMER" && task.companyId !== session.user.companyId) {
      return;
    }

    await prisma.task.update({
      where: { id: taskId },
      data: { status: newStatus }
    })

  } catch (error) {
    console.error(error)
    return;
  }

  revalidatePath("/dashboard/tasks")
  revalidatePath("/dashboard/todos")
}
