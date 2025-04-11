'use client'
import { useSession, signOut } from "@/lib/auth";
import {Dialog, DialogTrigger,DialogContent} from "@/components/ui/dialog";
import SignIn from "@/components/signin";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import Link from "next/link";
const email = 'kongtong23709@gmail.com'
export default function UserProfile() {
  const {
    data: session,
    isPending,
    error,
    refetch,
  } = useSession()
  const loggedIn = !!session
  return (
    <>
      {
       loggedIn &&
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className={'flex items-center gap-2'}>
              <Avatar>
                <AvatarImage alt={'User Avatar'} src={session.user.image!} className={'rounded-full'}/>
                <AvatarFallback>{session.user.name.slice(0,1)}</AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className={'items-center'}>
              <div className={'text-center'}>{session.user.name}</div>
              <div className={'text-center'}> {4} points</div>
              <DropdownMenuItem>
                  {/*show paddle dialog*/}
                  充值
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                  <Link href={`mailto:${email}`} className={'w-full'}>联系</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => signOut()}>
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
                    <div className={'flex items-center gap-2 w-10 h-10 bg-teal-100 rounded-full'}>

                    </div>
                </>
          </DialogTrigger>
          <DialogContent className={''}>
            <SignIn/>
          </DialogContent>
        </Dialog>
      }
    </>
  )

}