import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { updateTaskStatus } from "../tasks/actions"

export default async function TodosPage() {
  const session = await auth()
  
  if (!session?.user || session.user.role !== "CUSTOMER") {
    // Only CUSTOMER roles use the simplified "todos" view
    redirect("/dashboard")
  }

  const tasks = await prisma.task.findMany({
    where: { companyId: session.user.companyId as string },
    orderBy: [
      { status: "asc" },
      { deadline: "asc" }
    ]
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Teendőid (To-Do)</h1>
        <p className="text-muted-foreground">A könyvelőiroda által számodra kitűzött kérések és határidők.</p>
      </div>
      
      {tasks.length === 0 ? (
        <div className="bg-card p-8 rounded-lg text-center text-muted-foreground border">
          Hurrá! Jelenleg nincs egyetlen aktív kérés vagy teendő sem a könyvelő részéről.🎉
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {tasks.map((task) => {
            const isDone = task.status === "DONE"
            const isOverdue = !isDone && task.deadline && task.deadline < new Date()
            
            return (
              <div key={task.id} className={`p-5 rounded-xl border shadow-sm flex flex-col justify-between transition-all ${isDone ? "bg-muted/30 border-muted opacity-80" : "bg-card border-l-4"} ${isOverdue ? "border-l-destructive" : isDone ? "" : "border-l-primary"}`}>
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className={`font-semibold text-lg ${isDone ? "line-through text-muted-foreground" : "text-foreground"}`}>
                      {task.title}
                    </h3>
                    {!isDone && task.priority === "URGENT" && (
                      <Badge variant="destructive" className="shrink-0">SOS!</Badge>
                    )}
                  </div>
                  
                  {task.description && (
                    <p className={`text-sm ${isDone ? "text-muted-foreground" : "text-foreground/80"}`}>
                      {task.description}
                    </p>
                  )}
                  
                  <div className="text-sm font-medium mt-4">
                    <span className="text-muted-foreground mr-2">Határidő:</span>
                    <span className={`${isOverdue ? "text-destructive font-bold" : isDone ? "text-muted-foreground" : ""}`}>
                      {task.deadline ? new Date(task.deadline).toLocaleDateString("hu-HU") : "-"}
                    </span>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t flex items-center justify-between">
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${isDone ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}>
                    {isDone ? "Teljesítve" : "Intézés alatt"}
                  </span>
                  
                  {!isDone && (
                    <form action={updateTaskStatus}>
                      <input type="hidden" name="taskId" value={task.id} />
                      <input type="hidden" name="status" value="DONE" />
                      <Button type="submit" size="sm" className="bg-green-600 hover:bg-green-700">✓ Elvégeztem</Button>
                    </form>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
