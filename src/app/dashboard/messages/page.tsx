import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { MessageSquare } from "lucide-react"

export default async function MessagesPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  const role = session.user.role

  let whereClause = {}
  if (role === "CUSTOMER") {
    whereClause = { companyId: session.user.companyId }
  }

  const threads = await prisma.thread.findMany({
    where: whereClause,
    include: {
      company: { select: { name: true, shortName: true } },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1
      }
    },
    orderBy: { updatedAt: "desc" }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Üzenetek & Kérések</h1>
          <p className="text-muted-foreground">Közvetlen kapcsolattartás és információcserék az ügyfelekkel.</p>
        </div>
        <Link href="/dashboard/messages/new">
          <Button>Párbeszéd Indítása</Button>
        </Link>
      </div>
      
      <div className="flex flex-col gap-4 mt-8">
        {threads.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground bg-card rounded-lg border shadow-sm">
            Nincs még aktív beszélgetés.
          </div>
        ) : (
          threads.map(thread => (
            <Link key={thread.id} href={`/dashboard/messages/${thread.id}`} className="block">
              <div className="bg-card hover:bg-muted/40 transition-colors p-4 md:p-6 rounded-lg border shadow-sm flex items-start gap-4 cursor-pointer">
                <div className="bg-primary/10 text-primary p-3 rounded-full shrink-0">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-lg text-foreground truncate">{thread.subject}</h3>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                      {new Date(thread.updatedAt).toLocaleDateString("hu-HU")}
                    </span>
                  </div>
                  
                  {role !== "CUSTOMER" && (
                     <Badge variant="outline" className="mb-2 border-primary/40 text-primary">{thread.company.shortName || thread.company.name}</Badge>
                  )}
                  
                  <p className="text-sm text-muted-foreground truncate">
                    {thread.messages[0]?.body || "..."}
                  </p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
