import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { randomUUID } from "crypto"
import { writeFile } from "fs/promises"
import path from "path"

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Nincs jogosultság." }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File
    const category = formData.get("category")?.toString()
    const companyId = formData.get("companyId")?.toString()
    const notes = formData.get("notes")?.toString()

    if (!file || !category) {
      return NextResponse.json({ error: "A fájl és a kategória megadása kötelező!" }, { status: 400 })
    }

    // Identify target companyId
    let targetCompanyId = companyId
    if (session.user.role === "CUSTOMER") {
      targetCompanyId = session.user.companyId as string
    }

    if (!targetCompanyId) {
      return NextResponse.json({ error: "Érvénytelen Cég azonosító." }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const storageKey = `${randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`
    
    // Save locally to public/uploads
    const uploadDir = path.join(process.cwd(), "public/uploads")
    const filePath = path.join(uploadDir, storageKey)
    await writeFile(filePath, buffer)

    // Create DB Document
    const document = await prisma.document.create({
      data: {
        originalName: file.name,
        storageKey,
        size: file.size,
        type: file.type,
        category: category as any,
        notes,
        uploaderId: session.user.id,
        companyId: targetCompanyId,
      }
    })

    return NextResponse.json({ success: true, document })

  } catch (error) {
    console.error("Upload Error:", error)
    return NextResponse.json({ error: "Fájl feltöltése sikertelen." }, { status: 500 })
  }
}
