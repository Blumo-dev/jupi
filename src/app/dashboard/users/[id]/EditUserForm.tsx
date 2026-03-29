"use client"

import { useState } from "react"
import { updateUser, deleteUser, resendInvite } from "../actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import Link from "next/link"

export function EditUserForm({
  user,
  isCurrentUser,
  isActivated,
}: {
  user: { id: string; name: string | null; email: string; role: string; createdAt: Date }
  isCurrentUser: boolean
  isActivated: boolean
}) {
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    try {
      const res = await updateUser(user.id, formData)
      if (res?.error) {
        toast.error(res.error)
      } else {
        toast.success("Módosítások mentve!")
      }
    } catch {
      toast.error("Váratlan hiba.")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm(`Biztosan törölni szeretnéd ${user.name || user.email} fiókját? Ez visszavonhatatlan!`)) return
    setDeleteLoading(true)
    try {
      const res = await deleteUser(user.id)
      if (res?.error) {
        toast.error(res.error)
        setDeleteLoading(false)
      }
    } catch {
      toast.error("Váratlan hiba.")
      setDeleteLoading(false)
    }
  }

  const handleResend = async () => {
    setResendLoading(true)
    try {
      const res = await resendInvite(user.id)
      if (res?.error) {
        toast.error(res.error)
      } else {
        toast.success("Meghívó újraküldve!")
      }
    } catch {
      toast.error("Váratlan hiba.")
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader className="flex flex-row justify-between items-start">
        <div>
          <CardTitle>Munkatárs Szerkesztése</CardTitle>
          <CardDescription className="mt-1">
            {user.email}
            {" — "}
            {isActivated ? (
              <Badge variant="default" className="ml-1">Aktív fiók</Badge>
            ) : (
              <Badge variant="secondary" className="ml-1">Még nem aktivált</Badge>
            )}
          </CardDescription>
        </div>
        {!isCurrentUser && (
          <Button variant="destructive" type="button" onClick={handleDelete} disabled={deleteLoading || loading}>
            {deleteLoading ? "Törlés..." : "Törlés"}
          </Button>
        )}
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Teljes Név *</Label>
            <Input id="name" name="name" required defaultValue={user.name || ""} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email cím (nem módosítható)</Label>
            <Input id="email" name="email" type="email" defaultValue={user.email} readOnly className="bg-muted" />
          </div>

          {!isCurrentUser && (
            <div className="space-y-2">
              <Label htmlFor="role">Szerepkör</Label>
              <Select name="role" defaultValue={user.role}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin (Könyvelő)</SelectItem>
                  <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label>Rögzítve</Label>
            <p className="text-sm text-muted-foreground">
              {new Date(user.createdAt).toLocaleDateString("hu-HU", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>

          {!isActivated && (
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-800">
              <p className="text-sm text-amber-700 dark:text-amber-400 font-medium">Ez a felhasználó még nem aktiválta a fiókját.</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2 border-amber-400 text-amber-700 hover:bg-amber-100 dark:text-amber-400"
                onClick={handleResend}
                disabled={resendLoading}
              >
                {resendLoading ? "Küldés..." : "Meghívó Újraküldése"}
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href="/dashboard/users">
            <Button variant="outline" type="button">Vissza</Button>
          </Link>
          <Button type="submit" disabled={loading || deleteLoading}>
            {loading ? "Mentés..." : "Módosítások Mentése"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
