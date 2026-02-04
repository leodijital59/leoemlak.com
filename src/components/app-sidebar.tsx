import * as React from "react"
import {
  IconBuildingCommunity,
  IconCategory,
  IconDashboard,
  IconInnerShadowTop,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

import {Link} from "@tanstack/react-router";
import type {NavItem} from "@/components/nav-main";
import { NavMain  } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { authClient } from "@/auth";

const navigation: {
  main: NavItem[]
  secondary: { title: string; url: string; icon: typeof IconSettings }[]
} = {
  main: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: IconDashboard,
    },
    {
      title: "İlanlar",
      url: "/admin/properties",
      icon: IconBuildingCommunity,
    },
    {
      title: "Kategoriler",
      url: "/admin/categories",
      icon: IconCategory,
    },
    {
      title: "Kullanıcılar",
      url: "/admin/users",
      icon: IconUsers,
      role: "admin"
    },
  ],
  secondary: [
    {
      title: "Ayarlar",
      url: "#",
      icon: IconSettings,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data } = authClient.useSession();
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to="/" target="_blank">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">LeoEmlak</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigation.main} role={data?.user.role} />
        <NavSecondary items={navigation.secondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
