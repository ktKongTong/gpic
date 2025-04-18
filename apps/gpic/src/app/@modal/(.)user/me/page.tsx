'use client'
import {authClient, useSession} from "@/lib/auth";
import {useMutation, useQuery} from "@tanstack/react-query";
import {Label} from "@/components/ui/label";
import { AvatarFallback, AvatarImage,Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { GoogleIcon } from "@/components/icons/google";
import { GitHubIcon } from "@/components/icons/github";
import { PendableButton } from "@/components/pendable-button";

const nameFormSchema = z.object({
  name: z.string().min(1, {message: 'Name is required'}).max(36, {message: 'Name is too long, max 36 characters'})
})


const socials = [
{
  provider: 'github',
  label: 'GitHub',
  icon: <GitHubIcon className="size-4"/>,
},
{
  provider: 'google',
  label: 'Google',
  icon: <GoogleIcon className="size-4"/>,
}
]

export default function Page() {

  const {data: accounts, isSuccess} = useQuery({
    queryKey: ['user', 'accounts'],
    queryFn: async () => {
      const res = await authClient.listAccounts()
      if(res.error) throw res.error
      return res.data
    }
  })
  
  const {data: session, refetch} = useSession()


  const nameForm = useForm({
    resolver: zodResolver(nameFormSchema),
    defaultValues: {
      name: session?.user.name ?? '',
    }
  })

  useEffect(() => {
    if(session) {
      nameForm.setValue('name', session.user.name)
    }
  }, [session])

  const nameMutation = useMutation({
    mutationKey: ['user', 'update-name'],
    mutationFn: async (name: string) => {
      const res = await authClient.updateUser({
        name: name
      })
      if(res.error) throw res.error
      return res.data
    },
    onSuccess: () => {
      refetch()
    }
  })



  return <div className="flex flex-col overflow-y-scroll w-full gap-2">
    <div className="flex w-full justify-between">
      <Label className="text-2xl">👋 Hi, {session?.user?.name}</Label>      
      <Avatar className="size-12">
        <AvatarImage src={session?.user?.image!} className=""/>
        <AvatarFallback>{session?.user?.name?.[0]}</AvatarFallback>
      </Avatar>
    </div>
    <div className="flex flex-col w-full">
      <Label className="text-2xl">Update Name</Label> 
      <Label className="text-sm text-secondary">Update Name</Label>
      <Form {...nameForm}>
        <form onSubmit={nameForm.handleSubmit((data) => nameMutation.mutate(data.name))} className="flex flex-col w-full">
          <FormField
            control={nameForm.control}
            name="name"
            render={({field}) => (
              <FormItem
                className="w-full"
              >
                <Input {...field} className="w-full" />
                <FormMessage/>
              </FormItem>
            )}
          />
          <PendableButton className="w-16 self-end mt-2" size={'sm'} pending={nameMutation.isPending}>Save</PendableButton>
        </form>
      </Form>

    </div>

    <div className="flex flex-col w-full">
      <Label className="text-2xl">Link Account</Label>
      <Label className="text-sm text-secondary">Connect your account with a third-party service.</Label>
      <div className="flex-col w-full flex gap-2">
        {
          socials.map((social) => {
            const account = accounts?.find((account) => account.provider === social.provider)
            return <LinkAccountItem key={social.provider} account={account} {...social}/>
          })
        }
      </div>


    </div>
  </div>

}

type Account = {
  id: string,
  provider: string,
  scopes: string[],
  accountId: string,
}

type LinkAccountItemProps = {
  account?: Account,
  icon?: React.ReactNode,
  provider: string,
  label: string,
}

const LinkAccountItem = ({account, provider, label,icon}:LinkAccountItemProps) => {
  const linked = !!account
  const linkAccount = () => {
    authClient.linkSocial({
      provider: provider as any,
      callbackURL: '/',
    })
  }

  const unlinkAccount = () => {
    authClient.unlinkAccount({
      providerId: provider as any,
    })
  }

  return <div className="w-full rounded-lg flex items-center justify-between">
  <span className="inline-flex gap-2 text-sm items-center text-center">
    {icon}
    <span>{label}</span>
  </span>
  {!linked && <Button size='sm' className="w-20" onClick={() => linkAccount()} >Link</Button>}
  {linked && <Button size='sm' className="w-20" variant={'secondary'}   onClick={() => unlinkAccount()} >Unlink</Button>}
</div>
}
