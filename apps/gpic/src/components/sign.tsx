'use client'
import {useSession, signOut, signIn, signUp} from "@/lib/auth";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import { User, VenetianMask, X} from "lucide-react";
import {cn} from "@/lib/utils";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {queryKeys} from "@/lib/query";
import { GitHubIcon } from "./icons/github";
import { GoogleIcon } from "./icons/google";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL

export default function UserProfile() {
  const { data: session, isPending } = useSession()
  const loggedIn = !!session
  const queryClient = useQueryClient()

  const signinMutation = useMutation({
    mutationFn: async (provider: "github" | "google") => {
      // if(provider === "anonymous") {
      //   const res = await signIn.anonymous();
      //   if (res.error) throw res.error;
      //   return res.data;
      // }
      const res = await signIn.social({
        provider: provider,
        callbackURL: window.location.origin,
        errorCallbackURL: window.location.origin+"/error",
      });
      if (res.error) throw res.error;
      return res.data;
    },
  });

  return (
    <>
      {
       loggedIn &&
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className={'flex items-center gap-2'}>
              <Avatar>
                <AvatarImage alt={'User Avatar'} src={session.user.image!} className={'rounded-full'}/>
                <AvatarFallback className={'bg-gray-100/40'}>{session.user.name.slice(0,1)}</AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className={'items-center border-none'}>
              <DropdownMenuItem asChild>
                  <Link href={'/user/me'}>Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                  <Link href={`mailto:${ADMIN_EMAIL}`} className={'w-full'}>Contact</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={async () => {
                await signOut()
                queryClient.invalidateQueries({queryKey: queryKeys.balance})
              }}>
                  Logout
              </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      }
      {
        !loggedIn &&
        <Dialog>
          <DialogTrigger>
            <>
              <div className={'inline-flex justify-center items-center gap-2 w-8 h-8 bg-gray-400/40 rounded-full'}>
                  <User className={'size-6'}/>
              </div>
            </>
          </DialogTrigger>

          <DialogContent className={'border-none'}>
              <DialogHeader>
                  <DialogTitle className="text-lg md:text-xl">Sign In</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 items-center justify-center justify-items-center">
                  <div className={cn("w-full gap-2 flex flex-col items-center", "justify-center")}>
                      <Button
                          variant="outline"
                          className={cn("aspect-square border-none")}
                          disabled={signinMutation.isPending}
                          onClick={() => signinMutation.mutate("google")}
                      ><GoogleIcon/> Sign in With Google</Button>
                      <Button
                          variant="outline"
                          className={cn("aspect-square border-none")}
                          disabled={signinMutation.isPending}
                          onClick={() => signinMutation.mutate("github")}
                      ><GitHubIcon/>Sign in With GitHub</Button>
                  </div>
              </div>
              <DialogFooter>
                  <div className="flex justify-center w-full border-t py-4">
                      <p className="text-center text-xs text-neutral-500">
                          Powered by{" "}
                          <Link
                              href="https://better-auth.com"
                              className="underline"
                              target="_blank"
                          >
                              <span className="dark:text-orange-200/90">better-auth.</span>
                          </Link>
                      </p>
                  </div>
              </DialogFooter>
          </DialogContent>

        </Dialog>
      }
    </>
  )

}