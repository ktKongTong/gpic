import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link";
import { CoinsIcon, Key, UserIcon, Cookie} from "lucide-react";
export const items = [
  {
    title: "User",
    url: "/user/me",
    icon: UserIcon,
  },
  {
    title: "Session",
    url: "/user/session",
    icon: Cookie,
  },
  {
    title: "APIKey",
    url: "/user/apikey",
    icon: Key,
  },  
  {
    title: "Credit",
    url: "/user/credit",
    icon: CoinsIcon,
  },
]
export function AppSidebar() {
  return (
    <Sidebar variant={'sidebar'}
     innerClassName="bg-transparent" 
     className={'h-full min-h-full backdrop-blur-xl group-data-[side=left]:border-r-0'}>
      <SidebarContents/>
    </Sidebar>
  )
}

export function SidebarContents () {
  return <>
  <SidebarContent className={'border-none bg-transparent backdrop-blur-xl'}>
        <SidebarGroup>
          <SidebarGroupLabel>UserPanel</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      </>
}
