"use client"

import { useState } from "react"
import { createCompany } from "../actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import Link from "next/link"

export function NewCompanyForm() {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    
    try {
      const res = await createCompany(formData)
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
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Új Cég / Könyvelőiroda Rögzítése</CardTitle>
        <CardDescription>Add meg a platformhoz csatlakozó új partner adatait.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Teljes Cégnév *</Label>
              <Input id="name" name="name" required placeholder="Példa Kft." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="shortName">Rövid név</Label>
              <Input id="shortName" name="shortName" placeholder="Példa" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="taxNumber">Adószám</Label>
              <Input id="taxNumber" name="taxNumber" placeholder="12345678-1-12" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyRegNumber">Cégjegyzékszám</Label>
              <Input id="companyRegNumber" name="companyRegNumber" placeholder="01-09-123456" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Központi Email</Label>
              <Input id="email" name="email" type="email" placeholder="info@pelda.hu" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Státusz</Label>
              <Select name="status" defaultValue="ACTIVE">
                <SelectTrigger>
                  <SelectValue placeholder="Válassz státuszt" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Aktív</SelectItem>
                  <SelectItem value="PAUSED">Szünetelő</SelectItem>
                  <SelectItem value="CLOSED">Lezárt</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href="/dashboard/companies">
            <Button variant="outline" type="button">Mégse</Button>
          </Link>
          <Button type="submit" disabled={loading}>
            {loading ? "Mentés..." : "Cég Mentése"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
