import { auth } from "@/lib/auth"

export default async function DashboardPage() {
  const session = await auth()
  const role = session?.user?.role || "Ismeretlen"

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-primary">Áttekintés</h1>
      <p className="text-muted-foreground">Üdvözlünk az irányítópulton, bejelentkezve mint: <strong className="text-foreground">{role}</strong>.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {role === "SUPER_ADMIN" && (
          <div className="p-6 bg-card rounded-lg shadow-sm border border-primary/20 hover:border-primary/50 transition-colors">
            <h2 className="text-xl font-bold mb-2 text-primary">Rendszer Cégek</h2>
            <p className="text-muted-foreground text-sm">A könyvelőirodák (Cégek) központi kezelése, fiókok aktiválása és felfüggesztése.</p>
          </div>
        )}
        {role === "ADMIN" && (
          <div className="p-6 bg-card rounded-lg shadow-sm border border-primary/20 hover:border-primary/50 transition-colors">
            <h2 className="text-xl font-bold mb-2 text-primary">Saját Ügyfelek</h2>
            <p className="text-muted-foreground text-sm">Az aktuális cég ügyfélfiókjainak kezelése, teljesítmény és határidők nyomon követése.</p>
          </div>
        )}
        {role === "CUSTOMER" && (
          <div className="p-6 bg-card rounded-lg shadow-sm border border-primary/20 hover:border-primary/50 transition-colors">
            <h2 className="text-xl font-bold mb-2 text-primary">Dokumentumtár</h2>
            <p className="text-muted-foreground text-sm">Számlák, szerződések és könyvelési anyagok biztonságos le- és feltöltése.</p>
          </div>
        )}
      </div>
    </div>
  )
}
