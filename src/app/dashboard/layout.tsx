import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { auth, signOut } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  return (
    <SidebarProvider>
      <AppSidebar role={session.user.role} user={session.user} />
      <main className="flex-1 flex flex-col bg-muted/20 min-h-screen">
        <header className="h-16 px-4 flex items-center justify-between border-b bg-background sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <div className="font-semibold text-sm text-muted-foreground">Jupi Ügyfélportál</div>
          </div>
          <div>
            <form action={async () => {
              "use server"
              await signOut({ redirectTo: "/login" })
            }}>
              <Button variant="ghost" size="sm" type="submit">Kijelentkezés</Button>
            </form>
          </div>
        </header>
        <div className="p-6 md:p-8 flex-1">
          {children}
        </div>
      </main>
    </SidebarProvider>
  )
}
