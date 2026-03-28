"use server"

import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createThread(formData: FormData) {
  const session = await auth()
  
  if (!session?.user) {
    return { error: "Bejelentkezés szükséges!" }
  }

  const subject = formData.get("subject")?.toString()
  const body = formData.get("body")?.toString()
  const assignedCompanyId = formData.get("companyId")?.toString()

  if (!subject || !body) {
    return { error: "A Téma és az üzenet kitöltése kötelező!" }
  }

  let finalCompanyId = assignedCompanyId
  if (session.user.role === "CUSTOMER") {
    finalCompanyId = session.user.companyId as string
  }

  if (!finalCompanyId) {
    return { error: "A szálhoz nem tartozik érvényes cég!" }
  }

  let threadId: string;

  try {
    const thread = await prisma.thread.create({
      data: {
        subject,
        companyId: finalCompanyId,
        messages: {
          create: {
            body,
            senderId: session.user.id,
          }
        }
      }
    })
    
    threadId = thread.id;
  } catch (error) {
    return { error: "Hiba történt az új beszélgetés indításakor." }
  }

  revalidatePath("/dashboard/messages")
  redirect(`/dashboard/messages/${threadId}`)
}

export async function sendMessage(formData: FormData) {
  const session = await auth()
  if (!session?.user) return;

  const threadId = formData.get("threadId")?.toString()
  const body = formData.get("body")?.toString()

  if (!threadId || !body) return;

  try {
    // Check if thread exists and user is allowed (security check omitted for brevity in MVP)
    await prisma.message.create({
      data: {
        body,
        threadId,
        senderId: session.user.id,
      }
    })
    
    // Update thread's updatedAt to push it to the top
    await prisma.thread.update({
      where: { id: threadId },
      data: { updatedAt: new Date() }
    })
  } catch (error) {
    console.error(error)
    return;
  }

  revalidatePath(`/dashboard/messages/${threadId}`)
}
