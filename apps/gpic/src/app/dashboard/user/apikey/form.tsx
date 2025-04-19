
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader} from "@/components/ui/dialog";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import { z } from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Copy, Eye, EyeOff, Info} from "lucide-react";
import {Select, SelectContent, SelectItem, SelectValue, SelectTrigger} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const apikeyForm = z.object({
    name: z.string(),
    expiredIn: z.string(),
  
    // permission
  })
  export const APIKeyForm = () => {
    const client = useQueryClient()
    const form = useForm<z.infer<typeof apikeyForm>>({
      resolver: zodResolver(apikeyForm),
      defaultValues: {
        name: '',
        expiredIn: String(0),
      }
    })
    const {mutate, data, isSuccess, reset} = useMutation({
      mutationKey: ['user', 'apikey'],
      mutationFn: async () => {
        let expiresIn : number | null = Number(form.getValues('expiredIn'))
        if (expiresIn == 0) {
          expiresIn = null
        }
        const res = await authClient.apiKey.create({
          name: form.getValues('name'),
          prefix: "gpic_",
          expiresIn,
        })
        if(res.error) throw res.error
        return res.data
      },
      onSuccess: (data) => {
        client.invalidateQueries({queryKey: ['user', 'apikey']})
      }
    })
    // highlight-start
    const [showKey, setShowKey] = useState(false);
  
    const copyToClipboard = () => {
      if (data?.key) {
        navigator.clipboard.writeText(data.key);
        // Optionally add a toast notification for feedback
      }
    };
    // highlight-end
  
      const [open, setOpen] = useState(false);
    useEffect(() => {
      form.reset()
      reset()
    },[open])
    
    return <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild><Button>Create</Button></DialogTrigger>
      <DialogContent className="border-none">
  
      <DialogHeader>
      {!isSuccess && <DialogTitle>Create an API Key</DialogTitle>}
      {/*// highlight-next-line*/}
      {isSuccess && <DialogTitle>View API Key</DialogTitle>}
      </DialogHeader>
        {
          !isSuccess && <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => mutate())}>
              <FormField
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="name" {...field} />
                    </FormControl>
                    <FormDescription>api key name</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name={'expiredIn'} render={
              ({formState, field, fieldState}) =>
              
      <FormItem>
  <FormLabel>Expired In</FormLabel>
      <FormControl>
      <Select value={String(field.value)} onValueChange={field.onChange}>
        <SelectTrigger><SelectValue/></SelectTrigger>
        <SelectContent>
          <SelectItem value={String(7 * 24 * 3600 * 1000)}>7 days</SelectItem>
          <SelectItem value={String(30 * 24 * 3600 * 1000)}>30 days</SelectItem>
          <SelectItem value={String(365 * 24 * 3600 * 1000)}>1 year</SelectItem>
          <SelectItem  value={'0'}>never expire</SelectItem>
        </SelectContent>
      </Select>
      </FormControl>
      <FormDescription>Expire time</FormDescription>
      <FormMessage />
    </FormItem>
    }/>
                <Button>Submit</Button>
            </form>
          </Form>
        }
        {
          isSuccess && data?.key &&
          // highlight-start
          <div className="space-y-4">
             <Alert className="bg-transparent border-yellow-300/30">
               <Info className="h-4 w-4  stroke-yellow-300" />
               <AlertTitle className="text-yellow-300">Heads up!</AlertTitle>
               <AlertDescription className="text-yellow-300">
                 You can only see this key once. Store it safely.
               </AlertDescription>
             </Alert>
            <div>
              <div className="relative mt-1">
                <Input
                  id="apiKey"
                  type={showKey ? 'text' : 'password'}
                  readOnly
                  value={data.key}
                  className="pr-20"
                />
                <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-2">
                   <Button variant="ghost" className=" size-8 hover:text-white hover:bg-white/10" size="icon" onClick={() => setShowKey(!showKey)}>
                     {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                     <span className="sr-only">{showKey ? 'Hide key' : 'Show key'}</span>
                   </Button>
                   <Button variant="ghost" className="size-8 hover:text-white hover:bg-white/10" size="icon" onClick={copyToClipboard}>
                     <Copy className="h-4 w-4" />
                     <span className="sr-only">Copy key</span>
                   </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" onClick={() => {
                  setOpen(false)
  
                }}>Done</Button>
              </DialogClose>
            </DialogFooter>
          </div>
          // highlight-end
        }
      </DialogContent>
    </Dialog>
  }
  