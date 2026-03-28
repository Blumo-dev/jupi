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

export default async function CustomersPage() {
  const session = await auth()
  
  if (!session?.user || session.user.role === "CUSTOMER") {
    redirect("/dashboard")
  }

  // Fetch all CUSTOMER users, including their requested Company association
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    include: {
      company: { select: { name: true, shortName: true } }
    },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Ügyfelek (Partnerek) Kezelése</h1>
          <p className="text-muted-foreground">Regisztrált vállalkozásokhoz kötött hozzáférések.</p>
        </div>
        <Link href="/dashboard/customers/new">
          <Button>Új Ügyfél Meghívása</Button>
        </Link>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm overflow-hidden mt-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Név</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Kapcsolódó Cég</TableHead>
              <TableHead>Rögzítve</TableHead>
              <TableHead className="text-right">Műveletek</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="border-primary/50 text-primary">
                    {user.company?.shortName || user.company?.name || "Nincs Kijelölve"}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString("hu-HU")}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">Szerkesztés</Button>
                </TableCell>
              </TableRow>
            ))}
            {customers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Még nem vettél fel Ügyfelet. Hozz létre először egy Céget, majd hívj meg hozzá ügyfeleket!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
