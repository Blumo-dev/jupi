"use client"

import { useState } from "react"
import { verifyAndSetPassword } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export function SetupForm({ token, email }: { token: string, email: string }) {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    try {
      const res = await verifyAndSetPassword(formData)
      if (res?.error) {
        toast.error(res.error)
        setLoading(false)
      }
    } catch {
      toast.error("Váratlan hiba")
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-primary/20">
      <CardHeader>
        <CardTitle className="text-secondary text-2xl font-bold">Fiók Aktiválása</CardTitle>
        <CardDescription>
          Üdvözlünk! Kérlek, adj meg egy jelszót a platform használatához.
          <br /><br /> Fiók: <strong>{email}</strong>
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <input type="hidden" name="token" value={token} />
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Új Jelszó</Label>
            <Input id="password" name="password" type="password" required />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? "Aktiválás..." : "Jelszó Beállítása és Tovább"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
