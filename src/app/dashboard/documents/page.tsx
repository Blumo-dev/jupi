import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Download } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const CATEGORIES: Record<string, string> = {
  INVOICE_IN: "Bejövő számla",
  INVOICE_OUT: "Kimenő számla",
  BANK: "Bankkivonat",
  NAV: "NAV határozat",
  CONTRACT: "Szerződés",
  PAYROLL: "Bérpapír",
  OTHER: "Egyéb"
}

export default async function DocumentsPage(props: { searchParams: Promise<{ companyId?: string }> }) {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  const role = session.user.role
  const sp = await props.searchParams
  const selectedCompanyId = sp.companyId

  let whereClause: any = {}
  
  if (role === "CUSTOMER") {
    // Ügyfelek csak a saját cégük fájljait látják
    whereClause.companyId = session.user.companyId
  } else if (selectedCompanyId) {
    // Adminok szűrhetnek konkrét cégre
    whereClause.companyId = selectedCompanyId
  }

  const documents = await prisma.document.findMany({
    where: whereClause,
    include: {
      uploader: { select: { name: true } },
      company: { select: { name: true, shortName: true } }
    },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Dokumentumtár</h1>
          <p className="text-muted-foreground">Feltöltött számlák, szerződések, bérpapírok kezelése.</p>
        </div>
        <Link href="/dashboard/documents/new">
          <Button>Új Fájl Feltöltése</Button>
        </Link>
      </div>
      
      <div className="bg-card rounded-lg border shadow-sm overflow-hidden mt-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fájlnév</TableHead>
              <TableHead>Kategória</TableHead>
              {role !== "CUSTOMER" && <TableHead>Cég / Ügyfél</TableHead>}
              <TableHead>Feltöltötte</TableHead>
              <TableHead>Dátum</TableHead>
              <TableHead className="text-right">Letöltés</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="font-medium max-w-[200px] truncate" title={doc.originalName}>
                  {doc.originalName}
                  {doc.notes && <p className="text-xs text-muted-foreground truncate">{doc.notes}</p>}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {CATEGORIES[doc.category] || doc.category}
                  </Badge>
                </TableCell>
                {role !== "CUSTOMER" && (
                  <TableCell className="text-muted-foreground text-sm">
                     {doc.company?.shortName || doc.company?.name || "-"}
                  </TableCell>
                )}
                <TableCell>{doc.uploader?.name}</TableCell>
                <TableCell>{new Date(doc.createdAt).toLocaleDateString("hu-HU")}</TableCell>
                <TableCell className="text-right">
                  <a href={`/uploads/${doc.storageKey}`} target="_blank" download>
                    <Button variant="ghost" size="sm" title="Letöltés">
                      <Download className="h-4 w-4" />
                    </Button>
                  </a>
                </TableCell>
              </TableRow>
            ))}
            {documents.length === 0 && (
              <TableRow>
                <TableCell colSpan={role !== "CUSTOMER" ? 6 : 5} className="text-center py-8 text-muted-foreground">
                  Nincs még feltöltött dokumentum ebben a nézetben.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
