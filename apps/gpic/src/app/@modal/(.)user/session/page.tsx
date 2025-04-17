'use client'
import {authClient, useSession} from "@/lib/auth";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import { DialogDescription, DialogHeader ,DialogTitle} from "@/components/ui/dialog";
import {UAParser} from "ua-parser-js";
import { Ellipsis, Laptop } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
export default function Page() {

  const {data: sessions} = useQuery({
    queryKey: ['user', 'sessions'],
    queryFn: async () => {
      const res = await authClient.listSessions()
      return res.data ?? []
    }
  })
  return <>
      <DialogHeader className="items-start">
      <DialogTitle>Sessions</DialogTitle>
      <DialogDescription>Manage your active sessions and revoke access.</DialogDescription>
      </DialogHeader>
    <div className="flex flex-col gap-2 w-full">
      {
        sessions?.map(session => <SessionItem session={session} key={session.id} />)
      }
    </div>
  </>

}

type Session = {
  id: string,
  expiresAt: Date,
  ipAddress?: string | null,
  userAgent?: string | null,
  createdAt: Date,
  updatedAt: Date,
  token: string,
  userId: string,
}

const SessionItem = ({session}:{session: Session}) => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const currenetSession = useSession()
  const iSCurrentSession = session.id === currenetSession.data?.session.id
  const {mutate, data, isSuccess, isPending} = useMutation({
    mutationKey: ['user', 'sessions', 'revoke'],
    mutationFn: async () => {
      const res = await authClient.revokeSession({
        token: session.token
      })
      if(res.error) throw res.error
      return res.data
    },
    onSuccess: () => {
      if(session.id === currenetSession.data?.session.id) {
        authClient.signOut()
        router.refresh()
      }
      queryClient.invalidateQueries({ queryKey: ['user','sessions'] })
    }
  })

  return <div className="flex rounded-xl bg-card/40 items-center gap-2 p-2">
    <Laptop className="w-4 h-4" />
    <div>
      <div className=" font-medium text-md">{
        iSCurrentSession ? "Current Session"
        : getFriendlyUA(session.userAgent?? '')
        }</div>
      {/* <div className="text-muted-foreground text-xs">{getFriendlyUA(session.userAgent?? '')}</div> */}
    </div>
    <Button variant="ghost" size="sm" className="ml-auto" onClick={() => {mutate()}}>
      <span className={cn(isPending && 'hidden')}>Revoke</span>
      <span className={cn(!isPending && 'hidden')}><Ellipsis/></span>
    </Button>

  </div>
}

const getFriendlyUA = (userAgent: string) => {
  let parser = new UAParser(userAgent);
  const {os, browser} = parser.getResult()
  if(os.name) {
    return `${os.name} ${browser.name ?? 'Unknown'}`
  }
  if(browser.name) {
    return  `${os.name ?? 'Unknown'} ${browser.name}`
  }
  return 'Unknown'
}