"use client"

import { useState } from "react"
import { createSuperAdmin } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export function InitForm() {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    try {
      const res = await createSuperAdmin(formData)
      if (res?.error) {
        toast.error(res.error)
      } else {
        toast.success("Super Admin sikeresen létrehozva!")
      }
    } catch (err) {
      toast.error("Váratlan hiba történt az inizializáció során.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-20 shadow-lg">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl text-center text-primary">Jupi Init</CardTitle>
        <CardDescription className="text-center">
          Első indítás. Hozd létre a rendszergazdai (Super Admin) fiókodat. Ez a felület a létrehozás után végleg lezáródik.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Teljes Név</Label>
            <Input id="name" name="name" placeholder="Vezeték és Keresztnév" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email cím (Login identifier)</Label>
            <Input id="email" name="email" type="email" placeholder="admin@cegem.hu" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Jelszó</Label>
            <Input id="password" name="password" type="password" required />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? "Létrehozás folyamatban..." : "Rendszer Aktiválása"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
