"use client"

import { useState } from "react"
import { updateSystemSettings } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Separator } from "@/components/ui/separator"

export function SettingsForm({ initialSettings }: { initialSettings: any }) {
  const [loading, setLoading] = useState(false)
  const [smtpEnabled, setSmtpEnabled] = useState(initialSettings.smtpEnabled || false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    
    try {
      const res = await updateSystemSettings(formData)
      if (res?.error) {
        toast.error(res.error)
      } else {
        toast.success("Rendszerbeállítások sikeresen mentve!")
      }
    } catch (err) {
      toast.error("Váratlan hiba.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-10">
      
      {/* Általános Beállítások */}
      <Card>
        <CardHeader>
          <CardTitle>Általános Rendszerinformációk</CardTitle>
          <CardDescription>
            A portál alapvető megjelenési és nyelv beállításai.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="systemName">Rendszer Neve (Brand)</Label>
              <Input id="systemName" name="systemName" defaultValue={initialSettings.systemName || "Jupi"} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="systemTimezone">Alapértelmezett Időzóna</Label>
              <Select name="systemTimezone" defaultValue={initialSettings.systemTimezone || "Europe/Budapest"}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Europe/Budapest">Europe/Budapest</SelectItem>
                  <SelectItem value="UTC">UTC</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="systemLanguage">Alapértelmezett Nyelv</Label>
              <Select name="systemLanguage" defaultValue={initialSettings.systemLanguage || "hu"}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hu">Magyar (hu)</SelectItem>
                  {/* Később bővíthető */}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="systemTheme">Alapértelmezett Téma</Label>
              <Select name="systemTheme" defaultValue={initialSettings.systemTheme || "light"}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Világos (Light)</SelectItem>
                  {/* Később sötét mód támogatás esetén bővíthető */}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feladat Emlékeztetők */}
      <Card>
        <CardHeader>
          <CardTitle>Feladat Emlékeztetők</CardTitle>
          <CardDescription>
            Automatikus értesítések az el nem végzett vagy lejáró feladatokról.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="taskReminderEnabled" 
              name="taskReminderEnabled" 
              defaultChecked={initialSettings.taskReminderEnabled} 
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="taskReminderEnabled">Feladat emlékeztetők engedélyezése</Label>
          </div>
          <div className="space-y-2 w-full max-w-sm">
            <Label htmlFor="taskReminderDays">Emlékeztető küldése (hány nap után)</Label>
            <Input 
              id="taskReminderDays" 
              name="taskReminderDays" 
              type="number" 
              defaultValue={initialSettings.taskReminderDays || 3} 
              min={1} 
              max={30} 
            />
          </div>
        </CardContent>
      </Card>

      {/* Biztonság és Hozzáférés */}
      <Card>
        <CardHeader>
          <CardTitle>Biztonság és Hozzáférés</CardTitle>
          <CardDescription>
            Jelszókezelés és kétfaktoros hitelesítés szabályai.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2 w-full max-w-sm">
            <Label htmlFor="passwordExpiryDays">Jelszó lejárati ideje (napokban, 0 = nincs lejárat)</Label>
            <Input 
              id="passwordExpiryDays" 
              name="passwordExpiryDays" 
              type="number" 
              defaultValue={initialSettings.passwordExpiryDays || 0} 
              min={0}
            />
          </div>

          <div className="space-y-2 w-full max-w-sm">
            <Label htmlFor="twoFactorRequired">2FA Kötelezőség</Label>
            <Select name="twoFactorRequired" defaultValue={initialSettings.twoFactorRequired || "NONE"}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NONE">Nem kötelező (Egyéni döntés)</SelectItem>
                <SelectItem value="ADMIN">Csak Munkatársaknak (Adminoknak) kötelező</SelectItem>
                <SelectItem value="ALL">Mindenkinek (Ügyfeleknek is) kötelező</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="maintenanceMode" 
              name="maintenanceMode" 
              defaultChecked={initialSettings.maintenanceMode} 
              className="h-4 w-4 rounded border-gray-300 text-destructive focus:ring-destructive"
            />
            <Label htmlFor="maintenanceMode" className="text-destructive font-semibold">Karbantartási üzemmód bekapcsolása (Hozzáférés korlátozása)</Label>
          </div>
        </CardContent>
      </Card>

      {/* Levezés és SMTP */}
      <Card>
        <CardHeader>
          <CardTitle>Levelezés és SMTP Szerver</CardTitle>
          <CardDescription>
            Értesítő levelek kiküldéséhez használt beállítások. Ha az SMTP kikapcsolva, a rendszer a Resend API-t használja.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="emailNotificationsEnabled" 
              name="emailNotificationsEnabled" 
              defaultChecked={initialSettings.emailNotificationsEnabled} 
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="emailNotificationsEnabled">Email értesítések engedélyezése</Label>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="smtpEnabled" 
                name="smtpEnabled" 
                checked={smtpEnabled}
                onChange={(e) => setSmtpEnabled(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="smtpEnabled" className="font-semibold">Saját SMTP szerver használata</Label>
            </div>

            {smtpEnabled && (
              <div className="space-y-4 pt-2 border-l-2 pl-4 border-primary/20 bg-muted/20 p-4 rounded-r-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtpHost">SMTP Host</Label>
                    <Input id="smtpHost" name="smtpHost" defaultValue={initialSettings.smtpHost || ""} placeholder="smtp.mailtrap.io" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPort">Port</Label>
                    <Input id="smtpPort" name="smtpPort" type="number" defaultValue={initialSettings.smtpPort || 587} placeholder="587" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtpUser">Felhasználónév (SMTP User)</Label>
                    <Input id="smtpUser" name="smtpUser" defaultValue={initialSettings.smtpUser || ""} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPassword">Jelszó (SMTP Password)</Label>
                    <Input id="smtpPassword" name="smtpPassword" type="password" defaultValue={initialSettings.smtpPassword || ""} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtpFromName">Feladó Neve</Label>
                    <Input id="smtpFromName" name="smtpFromName" defaultValue={initialSettings.smtpFromName || "Saját SaaS"} placeholder="Pl. Könyvelőiroda Neve" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpFromEmail">Feladó Email Címe</Label>
                    <Input id="smtpFromEmail" name="smtpFromEmail" type="email" defaultValue={initialSettings.smtpFromEmail || ""} placeholder="info@cegem.hu" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="submit" size="lg" disabled={loading} className="px-10">
          {loading ? "Rendszeradatok mentése..." : "Minden beállítás mentése"}
        </Button>
      </div>

    </form>
  )
}
