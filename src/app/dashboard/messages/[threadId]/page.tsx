import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Send, ArrowLeft } from "lucide-react"
import { Input } from "@/components/ui/input"
import { sendMessage } from "../actions"

export default async function ThreadPage(props: { params: Promise<{ threadId: string }> }) {
  const session = await auth()
  if (!session?.user) redirect("/login")
  
  const params = await props.params
  const threadId = params.threadId

  const thread = await prisma.thread.findUnique({
    where: { id: threadId },
    include: {
      company: { select: { name: true } },
      messages: {
        include: { sender: { select: { name: true, role: true } } },
        orderBy: { createdAt: "asc" }
      }
    }
  })

  if (!thread) {
    return <div className="p-8">Nem található beszélgetés.</div>
  }

  const role = session.user.role
  const currentUserId = session.user.id

  if (role === "CUSTOMER" && thread.companyId !== session.user.companyId) {
    return <div className="p-8">Nincs jogosultságod a szál megtekintéséhez.</div>
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center gap-4 border-b pb-4 shrink-0">
        <Link href="/dashboard/messages">
          <Button variant="outline" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{thread.subject}</h1>
          <p className="text-sm text-muted-foreground">
            {role !== "CUSTOMER" ? `Ügyfél (Cég): ${thread.company.name}` : "Beérkező vagy elküldött kérések a könyvelő felé."}
          </p>
        </div>
      </div>
      
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-6 space-y-6">
        {thread.messages.map((msg) => {
          const isOwn = msg.senderId === currentUserId
          return (
            <div key={msg.id} className={`flex w-full ${isOwn ? "justify-end" : "justify-start"}`}>
              <div className={`flex flex-col max-w-[80%] md:max-w-[60%] ${isOwn ? "items-end" : "items-start"}`}>
                <div className="text-xs text-muted-foreground mb-1">
                  {msg.sender?.name} • {new Date(msg.createdAt).toLocaleString("hu-HU")}
                </div>
                <div className={`p-4 rounded-xl shadow-sm border ${isOwn ? "bg-primary text-primary-foreground rounded-tr-sm border-primary" : "bg-card text-card-foreground rounded-tl-sm"}`}>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.body}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Input Form at bottom */}
      <div className="border-t pt-4 shrink-0 bg-background sticky bottom-0">
        <form action={sendMessage} className="flex gap-2">
          <input type="hidden" name="threadId" value={thread.id} />
          <Input 
            name="body" 
            placeholder="Kezdj el gépelni egy válaszüzenetet..." 
            autoComplete="off" 
            className="flex-1"
          />
          <Button type="submit"><Send className="h-4 w-4 mr-2" /> Küldés</Button>
        </form>
      </div>
    </div>
  )
}
