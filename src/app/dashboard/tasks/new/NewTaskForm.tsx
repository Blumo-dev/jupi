"use client"

import { useState } from "react"
import { createTask } from "../actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import Link from "next/link"

export function NewTaskForm({ companies }: { companies: { id: string, name: string }[] }) {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    
    try {
      const res = await createTask(formData)
      if (res?.error) {
        toast.error(res.error)
        setLoading(false)
      }
    } catch {
      toast.error("Váratlan hiba.")
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mt-4">
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="title">Feladat Rövid Címe *</Label>
            <Input id="title" name="title" required placeholder="Pl: 2026. Márciusi bejövő számlák feltöltése" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyId">Cél Cég (Kinek szól?) *</Label>
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
            
            <div className="space-y-2">
              <Label htmlFor="deadline">Határidő Dátuma *</Label>
              <Input id="deadline" name="deadline" type="date" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Prioritás (Sürgősség) *</Label>
            <Select name="priority" defaultValue="NORMAL">
              <SelectTrigger>
                <SelectValue placeholder="Normál" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">Ráér</SelectItem>
                <SelectItem value="NORMAL">Normál</SelectItem>
                <SelectItem value="HIGH">Fontos</SelectItem>
                <SelectItem value="URGENT">Azonnal / Sürgős!</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Részletes leírás (Opcionális)</Label>
            <Textarea 
              id="description" 
              name="description" 
              rows={4}
              placeholder="Ha kell bővebb megjegyzés, instrukciók a feladathoz..." 
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Link href="/dashboard/tasks">
            <Button variant="outline" type="button">Mégse</Button>
          </Link>
          <Button type="submit" disabled={loading}>
            {loading ? "Mentés..." : "Feladat Kiosztása"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
