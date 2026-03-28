"use client"

import { Calendar, Inbox, Home, Users, Building2, FolderKanban, FileText, Settings } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader
} from "@/components/ui/sidebar"

export function AppSidebar({ role, user }: { role: string, user: any }) {
  const items = []
  
  if (role === "SUPER_ADMIN") {
    items.push(
      { title: "Áttekintés", url: "/dashboard", icon: Home },
      { title: "Cégek", url: "/dashboard/companies", icon: Building2 },
      { title: "Munkatársak", url: "/dashboard/users", icon: Users },
      { title: "Ügyfelek", url: "/dashboard/customers", icon: Users },
      { title: "Üzenetek", url: "/dashboard/messages", icon: Inbox },
      { title: "Dokumentumtár", url: "/dashboard/documents", icon: FileText },
      { title: "Rendszer", url: "/dashboard/settings", icon: Settings },
    )
  } else if (role === "ADMIN") {
    items.push(
      { title: "Áttekintés", url: "/dashboard", icon: Home },
      { title: "Cégek", url: "/dashboard/companies", icon: Building2 },
      { title: "Ügyfelek", url: "/dashboard/customers", icon: Users },
      { title: "Üzenetek", url: "/dashboard/messages", icon: Inbox },
      { title: "Dokumentumtár", url: "/dashboard/documents", icon: FileText },
    )
  } else {
    items.push(
      { title: "Áttekintés", url: "/dashboard", icon: Home },
      { title: "Dokumentumtár", url: "/dashboard/documents", icon: FileText },
      { title: "Üzenetek", url: "/dashboard/messages", icon: Inbox },
      { title: "Határidők", url: "/dashboard/todos", icon: Calendar },
    )
  }

  return (
    <Sidebar>
      <SidebarHeader className="h-16 flex items-center justify-center border-b">
        <span className="text-2xl font-bold tracking-tight text-primary">JUPI</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigáció</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <a href={item.url}>
                    <SidebarMenuButton>
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </a>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t">
        <div className="flex flex-col">
            <span className="text-sm font-semibold truncate leading-tight">{user.name || "Névtelen Felhasználó"}</span>
            <span className="text-xs text-muted-foreground truncate">{user.email}</span>
            <span className="text-[10px] mt-1 uppercase text-primary font-bold">{role.replace("_", " ")}</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
