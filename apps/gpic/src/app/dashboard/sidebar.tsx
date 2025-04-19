import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel, SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link";
import { CoinsIcon, Key, UserIcon, Cookie} from "lucide-react";
import React from "react";
export const items = [
  {
    title: "User",
    url: "/dashboard/user/me",
    icon: UserIcon,
  },
  {
    title: "Session",
    url: "/dashboard/user/session",
    icon: Cookie,
  },
  {
    title: "APIKey",
    url: "/dashboard/user/apikey",
    icon: Key,
  },  
  {
    title: "Credit",
    url: "/dashboard/user/credit",
    icon: CoinsIcon,
  },
]

export const taskItems = [
  {
    title: "Task",
    url: "/dashboard/task",
    icon: CoinsIcon,
  },
]
export function AppSidebar() {
  return (
    <Sidebar variant={'sidebar'}
     innerClassName="bg-transparent" 
     className={'backdrop-blur-xl group-data-[side=left]:border-r border-white/20'}>
      <SidebarContents/>
    </Sidebar>
  )
}

export function SidebarContents () {
  return <>
  <SidebarContent className={'border-none bg-transparent backdrop-blur-xl'}>
    <SidebarHeader className={'border border-white/30'}>
      <div className="select-none cursor-default text-2xl text-center items-center flex px-4 font-black h-[47px]">
        GPIC
      </div>
    </SidebarHeader>
  <SidebarGroup>
          <SidebarGroupLabel>Tasks</SidebarGroupLabel>
          <SidebarGroupContent>
          <SidebarMenu>
              {taskItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} replace={true}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>User</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} replace={true}>
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
