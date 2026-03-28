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

export default async function UsersPage() {
  const session = await auth()
  
  if (session?.user.role !== "SUPER_ADMIN") {
    redirect("/dashboard")
  }

  const users = await prisma.user.findMany({
    where: {
      role: { in: ["SUPER_ADMIN", "ADMIN"] }
    },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Rendszergazdák (Könyvelők)</h1>
          <p className="text-muted-foreground">A platform belső hozzáférésével rendelkező munkatársak.</p>
        </div>
        <Link href="/dashboard/users/new">
          <Button>Új Munkatárs Hozzáadása</Button>
        </Link>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Név</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Szerepkör</TableHead>
              <TableHead>Rögzítve</TableHead>
              <TableHead className="text-right">Műveletek</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === "SUPER_ADMIN" ? "default" : "secondary"}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString("hu-HU")}</TableCell>
                <TableCell className="text-right">
                  {user.id !== session.user.id && (
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">Felfüggesztés</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
