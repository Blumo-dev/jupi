"use client"

import { useState } from "react"
import { loginAction } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function LoginForm({ systemName }: { systemName: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    // Redirection is handled locally if successful, but AuthError is caught in action
    formData.append("redirectTo", "/dashboard")

    const res = await loginAction(formData)
    
    // If we have a result here, it means there was an error
    if (res?.error) {
      toast.error(res.error)
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-primary/20">
      <CardHeader className="space-y-2">
        <CardTitle className="text-3xl font-bold tracking-tight text-center text-primary">{systemName} Portal</CardTitle>
        <CardDescription className="text-center">
          Jelentkezz be a fiókodba a folytatáshoz
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email cím</Label>
            <Input id="email" name="email" type="email" placeholder="admin@cegem.hu" required />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Jelszó</Label>
              <a href="#" className="text-sm font-medium text-primary hover:underline">
                Elfelejtetted?
              </a>
            </div>
            <Input id="password" name="password" type="password" required />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? "Bejelentkezés..." : "Bejelentkezés"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
