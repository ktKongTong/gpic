"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar, items } from "./sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import React, { useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import Header from "./header";

const UserDetailModalLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [open, setOpen] = useState(true)
  const change = (open: boolean) => {
    if (!open) {
      router.back()
    }
    setOpen(open)
  }
  return (

    <>
      <SidebarProvider className={'h-full w-full '}>
        <AppSidebar/>
        <div className={'flex-col w-full overflow-scroll'}>
          <Header/>
          <div className=" grow w-full mx-auto p-10 max-w-4xl z-10 h-full overflow-y-scroll">
            {children}
          </div>
        </div>
      </SidebarProvider>

    </>
  );
}
export default UserDetailModalLayout;