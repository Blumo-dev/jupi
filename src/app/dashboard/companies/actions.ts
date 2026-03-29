"use server"

import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { randomUUID } from "crypto"
import { sendInviteEmail } from "@/lib/email"

export async function createCompany(formData: FormData) {
  const session = await auth()
  
  if (!session?.user || session.user.role !== "SUPER_ADMIN") {
    return { error: "Nincs jogosultságod ehhez a művelethez!" }
  }

  // Company data
  const name = formData.get("name")?.toString()
  const shortName = formData.get("shortName")?.toString()
  const taxNumber = formData.get("taxNumber")?.toString()
  const companyRegNumber = formData.get("companyRegNumber")?.toString()
  const email = formData.get("email")?.toString()
  const phone = formData.get("phone")?.toString()
  const kshNumber = formData.get("kshNumber")?.toString()
  const status = formData.get("status")?.toString() as "ACTIVE" | "PAUSED" | "CLOSED" | undefined

  // Contact Person data
  const contactName = formData.get("contactName")?.toString()
  const contactEmail = formData.get("contactEmail")?.toString()
  const contactPhone = formData.get("contactPhone")?.toString()
  const contactIdCardNumber = formData.get("contactIdCardNumber")?.toString()
  const contactAddress = formData.get("contactAddress")?.toString()
  const contactTaxId = formData.get("contactTaxId")?.toString()

  if (!name) {
    return { error: "A Cégnév megadása kötelező." }
  }

  try {
    const company = await prisma.company.create({
      data: {
        name,
        shortName,
        taxNumber,
        companyRegNumber,
        email,
        phone,
        kshNumber,
        status: status || "ACTIVE",
      }
    })

    if (contactEmail && contactName) {
      const existingUser = await prisma.user.findUnique({ where: { email: contactEmail } })
      if (!existingUser) {
        const newUser = await prisma.user.create({
          data: {
            name: contactName,
            email: contactEmail,
            role: "CUSTOMER",
            companyId: company.id,
            phone: contactPhone,
            idCardNumber: contactIdCardNumber,
            address: contactAddress,
            taxId: contactTaxId
          }
        })

        const token = randomUUID()
        await prisma.passwordResetToken.create({
          data: {
            email: contactEmail,
            token: token,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // 3 napos érvényesség
          }
        })

        const emailResponse = await sendInviteEmail({
          email: newUser.email,
          name: newUser.name || "",
          token,
        })

        if (emailResponse.error) {
          console.error("Az e-mail kiküldése sikertelen:", emailResponse.error)
        }
      }
    }

  } catch (error) {
    console.error(error)
    return { error: "Hiba történt a cég mentésekor." }
  }

  revalidatePath("/dashboard/companies")
  redirect("/dashboard/companies")
}

export async function updateCompany(companyId: string, formData: FormData) {
  const session = await auth()
  
  if (!session?.user || session.user.role !== "SUPER_ADMIN") {
    return { error: "Nincs jogosultságod ehhez a művelethez!" }
  }

  const name = formData.get("name")?.toString()
  const shortName = formData.get("shortName")?.toString()
  const taxNumber = formData.get("taxNumber")?.toString()
  const companyRegNumber = formData.get("companyRegNumber")?.toString()
  const email = formData.get("email")?.toString()
  const phone = formData.get("phone")?.toString()
  const kshNumber = formData.get("kshNumber")?.toString()
  const status = formData.get("status")?.toString() as "ACTIVE" | "PAUSED" | "CLOSED" | undefined

  const contactName = formData.get("contactName")?.toString()
  const contactEmail = formData.get("contactEmail")?.toString()
  const contactPhone = formData.get("contactPhone")?.toString()
  const contactIdCardNumber = formData.get("contactIdCardNumber")?.toString()
  const contactAddress = formData.get("contactAddress")?.toString()
  const contactTaxId = formData.get("contactTaxId")?.toString()
  const contactUserId = formData.get("contactUserId")?.toString()

  if (!name) {
    return { error: "A Cégnév megadása kötelező." }
  }

  try {
    await prisma.company.update({
      where: { id: companyId },
      data: {
        name, shortName, taxNumber, companyRegNumber, email, phone, kshNumber, status: status || "ACTIVE"
      }
    })

    if (contactUserId && contactName && contactEmail) {
      await prisma.user.update({
        where: { id: contactUserId },
        data: {
          name: contactName,
          email: contactEmail,
          phone: contactPhone,
          idCardNumber: contactIdCardNumber,
          address: contactAddress,
          taxId: contactTaxId
        }
      })
    } else if (!contactUserId && contactName && contactEmail) {
      const existingUser = await prisma.user.findUnique({ where: { email: contactEmail } })
      if (!existingUser) {
        const newUser = await prisma.user.create({
          data: {
            name: contactName,
            email: contactEmail,
            role: "CUSTOMER",
            companyId: companyId,
            phone: contactPhone,
            idCardNumber: contactIdCardNumber,
            address: contactAddress,
            taxId: contactTaxId
          }
        })
        const token = randomUUID()
        await prisma.passwordResetToken.create({
          data: { email: contactEmail, token: token, expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3) }
        })
        await sendInviteEmail({ email: newUser.email, name: newUser.name || "", token })
      }
    }

  } catch (error) {
    return { error: "Hiba történt a cég frissítésekor." }
  }

  revalidatePath("/dashboard/companies")
  revalidatePath(`/dashboard/companies/${companyId}`)
  return { success: true }
}

export async function deleteCompany(companyId: string) {
  const session = await auth()
  
  if (!session?.user || session.user.role !== "SUPER_ADMIN") {
    return { error: "Nincs jogosultságod ehhez a művelethez!" }
  }

  try {
    await prisma.user.deleteMany({
      where: { companyId }
    })
    
    await prisma.company.delete({
      where: { id: companyId }
    })
  } catch (error) {
    return { error: "Hiba történt a cég törlésekor." }
  }

  revalidatePath("/dashboard/companies")
  redirect("/dashboard/companies")
}
