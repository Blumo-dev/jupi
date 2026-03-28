"use client"

import { useState } from "react"
import { createThread } from "../actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import Link from "next/link"

export function NewMessageForm({ companies, userRole }: { companies: { id: string, name: string }[], userRole: string }) {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    
    try {
      const res = await createThread(formData)
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
    <Card className="max-w-2xl mt-4">
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="subject">Tárgy / Kérés Röviden *</Label>
            <Input id="subject" name="subject" required placeholder="Pl: 2026. márciusi bérszámfejtések" />
          </div>

          {(userRole === "SUPER_ADMIN" || userRole === "ADMIN") && (
            <div className="space-y-2">
              <Label htmlFor="companyId">Érintett Cég (Kinek szól az üzenet?) *</Label>
              <Select name="companyId" required>
                <SelectTrigger>
                  <SelectValue placeholder="Válassz ügyfelet" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="body">Első Üzeneted *</Label>
            <Textarea 
              id="body" 
              name="body" 
              required
              rows={5}
              placeholder="Írd le részletesen, miből áll a kérés vagy a probléma..." 
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Link href="/dashboard/messages">
            <Button variant="outline" type="button">Vissza</Button>
          </Link>
          <Button type="submit" disabled={loading}>
            {loading ? "Küldés..." : "Beszélgetés Indítása"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
