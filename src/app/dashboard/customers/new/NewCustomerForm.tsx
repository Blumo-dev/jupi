"use client"

import { useState } from "react"
import { createCustomer } from "../actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import Link from "next/link"

export function NewCustomerForm({ companies }: { companies: { id: string, name: string, shortName: string | null }[] }) {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    
    try {
      const res = await createCustomer(formData)
      if (res?.error) {
        toast.error(res.error)
        setLoading(false)
      }
    } catch (err) {
      toast.error("Váratlan hiba.")
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-xl mx-auto mt-4">
      <CardHeader>
        <CardTitle className="text-secondary">Új Ügyfél Meghívása</CardTitle>
        <CardDescription>
          Rendelj hozzá egy személyt egy már meglévő céges ügyfélfiókhoz.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyId">Kapcsolódó Cég Kiválasztása *</Label>
            <Select name="companyId" required>
              <SelectTrigger>
                <SelectValue placeholder="Melyik céghez adunk hozzáférést?" />
              </SelectTrigger>
              <SelectContent>
                {companies.length === 0 ? (
                  <SelectItem value="none" disabled>Nincs rögzített cég!</SelectItem>
                ) : (
                  companies.map(c => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} {c.shortName ? `(${c.shortName})` : ''}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">Az Ügyfél csak a kiválasztott cég dokumentumait látja.</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="name">Ügyfél (Személy) Neve *</Label>
            <Input id="name" name="name" required placeholder="Gipsz Jakab" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email cím (Bejelentkezéshez) *</Label>
            <Input id="email" name="email" type="email" required placeholder="jakab@ugyfel.hu" />
            <p className="text-[11px] text-muted-foreground mt-1">
              Erre a címre küldünk egy meghívó linket a jelszó beállításhoz.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href="/dashboard/customers">
            <Button variant="outline" type="button">Hozzáadás Mégse</Button>
          </Link>
          <Button type="submit" disabled={loading || companies.length === 0}>
            {loading ? "Meghívás / Mentés..." : "Ügyfél Létrehozása és Mentés"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
