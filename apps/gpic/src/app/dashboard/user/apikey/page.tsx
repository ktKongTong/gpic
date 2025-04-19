'use client'
import {authClient} from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import {Label} from "@/components/ui/label";
import { APIKeyForm } from "./form";
import { APIKeyItem } from "./item";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Page() {

  const {data: apikeys, isSuccess} = useQuery({
    queryKey: ['user', 'apikey'],
    queryFn: async () => {
      const res = await authClient.apiKey.list()
      if(res.error) throw res.error
      return res.data
    }
  })

  return <>
    <div className={'flex justify-between items-center mb-2 w-full'}>
      <Label className={'text-3xl'}>APIKey</Label>
      <APIKeyForm/>
    </div>
    <Table className="p-2 rounded-lg ">
  <TableHeader className="sticky backdrop-blur-md top-0 rounded-t-lg overflow-hidden">
    <TableRow>
      <TableHead className="w-[100px] text-ellipsis">Name</TableHead>
      <TableHead>CreatedAt</TableHead>
      <TableHead>Key</TableHead>
      <TableHead className="text-right">Menu</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody className="overflow-y-scroll w-full relative">
  {
       apikeys?.map((apikey) => {
        // @ts-ignore
        return <APIKeyItem key={apikey.id} apikey={apikey}/> 
       })
     }
  </TableBody>
    </Table>
  </>

}
