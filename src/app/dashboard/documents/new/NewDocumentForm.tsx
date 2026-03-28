"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import Link from "next/link"

const CATEGORIES = {
  INVOICE_IN: "Bejövő számla",
  INVOICE_OUT: "Kimenő számla",
  BANK: "Bankkivonat",
  NAV: "NAV határozat / Levelezés",
  CONTRACT: "Szerződés",
  PAYROLL: "Bérszámfejtés / Bérpapír",
  OTHER: "Egyéb dokumentum"
}

export function NewDocumentForm({ companies, userRole }: { companies: { id: string, name: string }[], userRole: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      
      if (res.ok) {
        toast.success("Fájl sikeresen feltöltve!")
        router.push("/dashboard/documents")
        router.refresh()
      } else {
        toast.error(data.error || "Hiba történt a feltöltés során.")
      }
    } catch (err) {
      toast.error("Hálózati hiba a feltöltésnél.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mt-4">
      <CardHeader>
        <CardTitle className="text-primary">Fájl Feltöltése</CardTitle>
        <CardDescription>
          Küldj be egy új dokumentumot a platformra. Max 10MB méret ajánlott.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file">Válaszd ki a fájlt *</Label>
            <Input id="file" name="file" type="file" required className="cursor-pointer bg-muted/20" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Dokumentum Típus / Kategória *</Label>
              <Select name="category" required>
                <SelectTrigger>
                  <SelectValue placeholder="Válassz kategóriát" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CATEGORIES).map(([val, label]) => (
                    <SelectItem key={val} value={val}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {(userRole === "SUPER_ADMIN" || userRole === "ADMIN") && (
              <div className="space-y-2">
                <Label htmlFor="companyId">Cél Cég / Ügyfél *</Label>
                <Select name="companyId" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Melyik céghez szól?" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Megjegyzés a fájlhoz (Opcionális)</Label>
            <Textarea 
              id="notes" 
              name="notes" 
              placeholder="Ide írhatsz plusz információkat a fájl tartalmáról..." 
              className="resize-none"
              rows={3} 
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href="/dashboard/documents">
            <Button variant="outline" type="button">Mégse</Button>
          </Link>
          <Button type="submit" disabled={loading}>
            {loading ? "Fájl Mentése..." : "Feltöltés Indítása"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
