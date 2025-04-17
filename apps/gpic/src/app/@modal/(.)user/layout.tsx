"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar, items } from "./sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";

const UserDetailModalLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  return (
    <Dialog
      defaultOpen={true}
      onOpenChange={(open) => { if (!open) {
        router.back()
      }}}
    >
      <DialogContent
        data-cy="user-modal"
        className="backdrop-blur-sm max-h-[85vh] p-0 bg-background/50 border-none max-w-[90vw] sm:max-w-[90vw] flex-col rounded-lg"
        withX={false}
      >
        <SidebarProvider className={'h-full min-h-96'}>
          <SidebarContent>
            {children}
          </SidebarContent>
        </SidebarProvider>
      </DialogContent>

    </Dialog>
  );
};

const SidebarContent = ({ children }: { children: React.ReactNode }) => {
  const { isMobile } = useSidebar()
  const [item, setItem] = useState(items[0])
  const [open, setOpen] = useState(false)
  return (
    <>
            <AppSidebar />
          <div className={'p-4 w-full max-h-[400px] h-full overflow-y-hidden flex flex-col gap-1 items-start'}>
            {
              isMobile && <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger>
                <div className="inline-flex items-center text-sm font-medium border gap-1 rounded-lg p-1 mb-2">
                  <item.icon className="h-4 w-4" /> 
                  <span>{item.title}</span>
                  <ChevronDownIcon className="h-4 w-4" />
                </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="border-none">
                {
                  items.map((item) => <DropdownMenuItem key={item.url} onClick={() => {
                    setItem(item)
                    setOpen(false)
                  }}>
                    <Link href={item.url} className="w-full inline-flex items-center justify-start gap-2">
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </DropdownMenuItem>)
                }
                </DropdownMenuContent>
              </DropdownMenu>
            }
            {children}
          </div>
    </>
  );
}

export default UserDetailModalLayout;