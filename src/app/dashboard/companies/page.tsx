import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default async function CompaniesPage() {
  const session = await auth()
  
  if (session?.user.role === "CUSTOMER") {
    redirect("/dashboard")
  }

  const companies = await prisma.company.findMany({
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Cégek Kezelése</h1>
          <p className="text-muted-foreground">Regisztrált partnerek (könyvelőirodák vagy cégek) listája.</p>
        </div>
        <Link href="/dashboard/companies/new">
          <Button>Új Cég Hozzáadása</Button>
        </Link>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm mt-8 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cégnév</TableHead>
              <TableHead>Adószám</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Státusz</TableHead>
              <TableHead className="text-right">Műveletek</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((company: any) => (
              <TableRow key={company.id}>
                <TableCell className="font-medium">{company.name}</TableCell>
                <TableCell>{company.taxNumber || "-"}</TableCell>
                <TableCell>{company.email || "-"}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-xs font-semibold
                    ${company.status === "ACTIVE" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" : 
                    company.status === "PAUSED" ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300" : 
                    "bg-destructive/20 text-destructive"}`}>
                    {company.status === "ACTIVE" ? "Aktív" : company.status === "PAUSED" ? "Szünetel" : "Lezárt"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">Szerkeszt</Button>
                </TableCell>
              </TableRow>
            ))}
            {companies.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Még nem rögzítettél cégeket a platformon.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
