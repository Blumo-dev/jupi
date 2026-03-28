import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const STATUS_MAP: Record<string, { label: string, color: string }> = {
  NEW: { label: "Új", color: "bg-blue-100 text-blue-800" },
  IN_PROGRESS: { label: "Folyamatban", color: "bg-yellow-100 text-yellow-800" },
  WAITING_CUSTOMER: { label: "Ügyfélre Vár", color: "bg-orange-100 text-orange-800" },
  DONE: { label: "Kész", color: "bg-green-100 text-green-800" },
  EXPIRED: { label: "Lejárt", color: "bg-red-100 text-red-800" }
}

const PRIORITY_MAP: Record<string, string> = {
  LOW: "Alacsony",
  NORMAL: "Normál",
  HIGH: "Magas",
  URGENT: "Sürgős!"
}

export default async function TasksPage(props: { searchParams: Promise<{ companyId?: string }> }) {
  const session = await auth()
  
  if (!session?.user || session.user.role === "CUSTOMER") {
    redirect("/dashboard")
  }

  const role = session.user.role
  const sp = await props.searchParams

  const tasks = await prisma.task.findMany({
    where: sp.companyId ? { companyId: sp.companyId } : {},
    include: {
      company: { select: { name: true, shortName: true } }
    },
    orderBy: [
      { status: "asc" }, // Groups NEW/IN_PROGRESS before DONE
      { deadline: "asc" }
    ]
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Kiadott Feladatok</h1>
          <p className="text-muted-foreground">Könyvelői adminisztráció, határidők és bekérések követése.</p>
        </div>
        <Link href="/dashboard/tasks/new">
          <Button>Új Határidő / Feladat</Button>
        </Link>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm mt-8 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Feladat / Kérés</TableHead>
              <TableHead>Érintett Cég</TableHead>
              <TableHead>Határidő</TableHead>
              <TableHead>Prioritás</TableHead>
              <TableHead>Állapot</TableHead>
              <TableHead className="text-right">Műveletek</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium max-w-[200px] truncate" title={task.title}>
                  {task.title}
                  {task.description && <p className="text-xs text-muted-foreground truncate">{task.description}</p>}
                </TableCell>
                <TableCell className="text-sm">
                   {task.company?.shortName || task.company?.name || "-"}
                </TableCell>
                <TableCell>
                  <span className={task.deadline && task.deadline < new Date() && task.status !== "DONE" ? "text-destructive font-bold" : ""}>
                    {task.deadline ? new Date(task.deadline).toLocaleDateString("hu-HU") : "Nincs megadva"}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant={task.priority === "URGENT" || task.priority === "HIGH" ? "destructive" : "secondary"}>
                    {PRIORITY_MAP[task.priority] || task.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${STATUS_MAP[task.status]?.color || "bg-secondary text-secondary-foreground"}`}>
                    {STATUS_MAP[task.status]?.label || task.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">Részletek</Button>
                </TableCell>
              </TableRow>
            ))}
            {tasks.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Nincs aktív kiosztott feladat! Adj hozzá egy újat.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
