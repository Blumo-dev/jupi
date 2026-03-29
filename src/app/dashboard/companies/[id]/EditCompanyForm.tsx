"use client"

import { useState } from "react"
import { updateCompany, deleteCompany } from "../actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import Link from "next/link"

export function EditCompanyForm({ company, contactUser }: { company: any, contactUser: any }) {
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    if (contactUser?.id) formData.append("contactUserId", contactUser.id)
    
    try {
      const res = await updateCompany(company.id, formData)
      if (res?.error) {
        toast.error(res.error)
      } else {
        toast.success("Változtatások sikeresen mentve!")
      }
    } catch (err) {
      toast.error("Váratlan hiba.")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Biztosan törölni szeretnéd ezt a céget? Ez a lépés végleges és minden adat (kapcsolattartó is) törlődik!")) {
      return
    }

    setDeleteLoading(true)
    try {
      const res = await deleteCompany(company.id)
      if (res?.error) {
        toast.error(res.error)
        setDeleteLoading(false)
      }
    } catch (err) {
      toast.error("Váratlan hiba.")
      setDeleteLoading(false)
    }
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="flex flex-row justify-between items-start">
        <div>
          <CardTitle>Cég és Kapcsolattartó Szerkesztése</CardTitle>
          <CardDescription>Módosítsd a partner vagy a kapcsolattartó adatait.</CardDescription>
        </div>
        <Button variant="destructive" type="button" onClick={handleDelete} disabled={deleteLoading || loading}>
          {deleteLoading ? "Törlés..." : "Cég Törlése"}
        </Button>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-8 mt-4">
          
          {/* Cég Alapadatok */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Cég Alapadatok</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Teljes Cégnév *</Label>
                <Input id="name" name="name" required defaultValue={company.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shortName">Rövid név</Label>
                <Input id="shortName" name="shortName" defaultValue={company.shortName || ""} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyRegNumber">Cégjegyzékszám</Label>
                <Input id="companyRegNumber" name="companyRegNumber" defaultValue={company.companyRegNumber || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxNumber">Adószám</Label>
                <Input id="taxNumber" name="taxNumber" defaultValue={company.taxNumber || ""} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Központi Email</Label>
                <Input id="email" name="email" type="email" defaultValue={company.email || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Státusz</Label>
                <Select name="status" defaultValue={company.status || "ACTIVE"}>
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
          </div>

          {/* Kapcsolattartó adatok */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Kapcsolattartó adatok</h3>
            {!contactUser && (
              <p className="text-sm text-amber-600 font-semibold mb-3">Nincs még kapcsolattartó felvíve. Ha most kitöltöd a nevet és emailt, a rendszer meghívót küld neki!</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactName">Kapcsolattartó Neve</Label>
                <Input id="contactName" name="contactName" defaultValue={contactUser?.name || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">Személyes Email címe</Label>
                <Input id="contactEmail" name="contactEmail" type="email" defaultValue={contactUser?.email || ""} readOnly={!!contactUser?.email} className={!!contactUser?.email ? "bg-muted" : ""} title={!!contactUser?.email ? "Az email cím utólag nem módosítható." : ""} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Telefonszám</Label>
                <Input id="contactPhone" name="contactPhone" defaultValue={contactUser?.phone || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactIdCardNumber">Személyigazolvány szám</Label>
                <Input id="contactIdCardNumber" name="contactIdCardNumber" defaultValue={contactUser?.idCardNumber || ""} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactAddress">Lakcím</Label>
                <Input id="contactAddress" name="contactAddress" defaultValue={contactUser?.address || ""} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactTaxId">Adóazonosító jel</Label>
                <Input id="contactTaxId" name="contactTaxId" defaultValue={contactUser?.taxId || ""} />
              </div>
            </div>
          </div>

          {/* Cég részleges adatok (Későbbieknek hely) */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Cég további / részleges adatai</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="kshNumber">KSH Statisztikai szám</Label>
                <Input id="kshNumber" name="kshNumber" defaultValue={company.kshNumber || ""} />
              </div>
            </div>
          </div>

        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href="/dashboard/companies">
            <Button variant="outline" type="button">Vissza a listához</Button>
          </Link>
          <Button type="submit" disabled={loading || deleteLoading}>
            {loading ? "Mentés..." : "Változtatások Mentése"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
