"use client"

import { useState } from "react"
import { createAdmin } from "../actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import Link from "next/link"

export function NewUserForm() {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    
    try {
      const res = await createAdmin(formData)
      if (res?.error) {
        toast.error(res.error)
        setLoading(false)
      }
    } catch {
      toast.error("Váratlan hiba történt.")
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Új Könyvelő Munkatárs (Admin)</CardTitle>
        <CardDescription>Belső munkatársak rögzítése a platform kezeléséhez.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Teljes Név *</Label>
            <Input id="name" name="name" required placeholder="Gábor Minta" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Cím (Belépési azonosító) *</Label>
            <Input id="email" name="email" type="email" required placeholder="gabor@konyveloiroda.hu" />
            <p className="text-xs text-muted-foreground mt-1">
              Ide érkezik a beállító link az új Munkatársnak.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href="/dashboard/users">
            <Button variant="outline" type="button">Hozzáadás Mégse</Button>
          </Link>
          <Button type="submit" disabled={loading}>
            {loading ? "Mentés folyamatban..." : "Munkatárs Létrehozása"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
