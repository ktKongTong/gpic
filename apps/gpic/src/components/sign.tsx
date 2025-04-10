'use client'
import {authClient,useSession, signIn} from "@/lib/auth";
import {Button} from "@/components/ui/button";
import {Dialog, DialogTrigger,DialogContent} from "@/components/ui/dialog";
import SignIn from "@/components/signin";

export default function UserProfile() {
  const {
    data: session,
    isPending,
    error,
    refetch,
  } = useSession()

  const loggedIn = !!session
  const showModal = () => {

    // signIn.social('google')
  }
  return (
    <>
        {
         loggedIn && <>
                <div className={'flex items-center gap-2'}>
                    <img src={session.user.image!} className={'w-10 h-10 rounded-full'}/>
                </div>
            </>
        }

        <Dialog>
          <DialogTrigger>
            {
              !loggedIn && <>
                    <div className={'flex items-center gap-2 w-10 h-10 bg-teal-100 rounded-full'}>

                    </div>
                </>
            }
          </DialogTrigger>
          <DialogContent className={'text-white dark'}>
            <SignIn/>
          </DialogContent>
        </Dialog>
    </>
  )

}