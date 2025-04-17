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
  const [open, setOpen] = useState(true)
  const change = (open: boolean) => {
    if (!open) {
      router.back()
    }
    setOpen(open)
  }
  return (
    <Dialog
      defaultOpen={true}
      open={open}
      onOpenChange={change}
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
                  items.map((item) => <DropdownMenuItem className="p-0" key={item.url} >
                    <Link href={item.url} 
                    onClick={() => {
                      setItem(item)
                      setOpen(false)
                    }}
                    replace={true} className="w-full max-w-32 px-2 py-1.5 flex items-center justify-start gap-2">
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