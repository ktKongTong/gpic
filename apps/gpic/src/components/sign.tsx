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
      <div className={'bg-transparent'}>
        {
         loggedIn && <>
                <div className={'flex items-center gap-2'}>
                    <img src={session.user.image!} className={'w-10 h-10 rounded-full'}/>
                    <div>{session.user.name}</div>
                </div>
            </>
        }

        <Dialog>
          <DialogTrigger>
            {
              !loggedIn && <>
                    <div className={'flex items-center gap-2'}>
                        <Button onClick={() => showModal()} variant={'outline'} className={'bg-transparent hover:bg-transparent'}>
                            Signin
                        </Button>
                    </div>
                </>
            }
          </DialogTrigger>
          <DialogContent className={'text-white'}>
            <SignIn/>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )

}