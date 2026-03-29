import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendInviteEmail({
  email,
  name,
  token,
}: {
  email: string
  name: string
  token: string
}) {
  // VERCEL_PROJECT_PRODUCTION_URL: a Vercel által automatikusan beillesztett, állandó production domain (pl. jupi.vercel.app)
  // Ez nem változik deploy-onként, ellentétben a VERCEL_URL-lel.
  const baseUrl =
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : null) ??
    process.env.NEXT_PUBLIC_APP_URL ??
    "http://localhost:3000"
  const setupUrl = `${baseUrl}/setup-password?token=${token}`

  // Ha fejlesztői környezetben vagyunk, vagy nincs beállítva a Resend API kulcs, csak írjuk ki a terminálba (Fallback kód)
  if (process.env.NODE_ENV !== "production" || !process.env.RESEND_API_KEY) {
    console.log("-----------------------------------------")
    console.log(`[EMAIL SIMULATION] Levél kiküldve: ${email}`)
    console.log(`Kedves ${name}! Meghívót kaptál a Jupi Ügyfélportálra.`)
    console.log(`Jelszó beállítása: ${setupUrl}`)
    console.log("-----------------------------------------")
    return { success: true }
  }

  try {
    const { data, error } = await resend.emails.send({
      // Fontos: Amíg nincs a Resend-en validálva a saját domained (pl. info@jupi.hu), addig a Resend alapértékét kell használni!
      // Ha már ráraktad a domain-t, akkor írd át erre: "Jupi Könyvelés <info@sajatdomain.com>"
      from: "Jupi Ügyfélportál <onboarding@resend.dev>",
      to: email,
      subject: "Meghívó: Fiók beállítása a Jupi Ügyfélportálon",
      html: `
        <div style="font-family: Arial, sans-serif; max-w-2xl; margin: 0 auto; padding: 20px; color: #333;">
          <h2 style="color: #0f172a;">Üdvözlünk a Jupi Ügyfélportálon, ${name}!</h2>
          <p style="font-size: 16px; line-height: 1.5;">
            Az ügyintéződ létrehozott neked egy hozzáférést a modern felhőalapú könyvelői ügyfélportálunkhoz.
            Itt mindent egy helyen kezelhetsz: dokumentumok feltöltése, üzenetváltás és feladatok nyomon követése.
          </p>
          <p style="font-size: 16px; margin-top: 20px;">
            A továbblépéshez mindössze egy saját, titkos jelszót kell beállítanod a lenti gombra kattintva:
          </p>
          <div style="margin: 30px 0;">
            <a href="${setupUrl}" style="background-color: #0d9488; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Jelszó Beállítása
            </a>
          </div>
          <p style="font-size: 14px; color: #666; margin-top: 40px;">
            Ha ez a gomb nem működik, másold be ezt a linket a böngésződbe:<br/>
            <a href="${setupUrl}" style="color: #0d9488;">${setupUrl}</a>
          </p>
          <hr style="border: none; border-top: 1px solid #eaeaea; margin: 30px 0;" />
          <p style="font-size: 12px; color: #999;">
            Ezt egy automatikus rendszerüzenet, kérlek ne válaszolj rá.<br/>
            &copy; 2026 Jupi Könyvelőiroda. Minden jog fenntartva.
          </p>
        </div>
      `,
    })

    if (error) {
      console.error("Resend API Hiba:", error)
      return { error: error.message }
    }

    return { success: true, data }
  } catch (err: any) {
    console.error("Váratlan hiba az email küldésekor:", err)
    return { error: "Szerverhiba az e-mail elküldése során." }
  }
}
