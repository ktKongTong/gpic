import {PendableButton} from "@/components/pendable-button";

type APIKey = {
    name: string | null;
    start: string | null;
    prefix: string | null;
    userId: string,
    refillInterval: number ,
    refillAmount: number,
    lastRefillAt: Date | null,
    enabled: boolean,
    rateLimitEnabled: boolean,
    rateLimitTimeWindow: number,
    rateLimitMax: number,
    requestCount: number,
    remaining: number | null,
    lastRequest: number | null,
    expiresAt: Date | null,
    createdAt: Date,
    updatedAt: Date,
    id: string,
  }
  
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { TableCell, TableRow } from "@/components/ui/table";
import { authClient } from "@/lib/auth";
import { DropdownMenu, DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Ellipsis } from "lucide-react";
  
  
 export const APIKeyItem = ({apikey}:{apikey: APIKey}) => {
    const queryClient = useQueryClient();
    const enableToggleMutation = useMutation({
     mutationFn: async (apiKey: APIKey) => {
       const res = await authClient.apiKey.update({ keyId: apiKey.id, enabled: !apiKey.enabled });
       if (res.error) throw res.error;
       return res.data;
     },
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['user', 'apikey'] });
     }
   })
  
    return (
      <TableRow>
        
      <TableCell> <Label className="font-medium text-white">{apikey.name}</Label></TableCell>
      
      <TableCell>
      <span className="text-xs font-mono mt-1">
           {apikey.start}...
          </span>
      </TableCell>
      <TableCell className="font-medium">
      <span className="text-xs mt-1">
            {new Date(apikey.createdAt).toLocaleDateString()}
          </span>
      </TableCell>
      <TableCell className="text-right">
      <Dialog>
            <DropdownMenu>
                <DropdownMenuTrigger asChild> 
                  <Button variant={'ghost'} size={'icon'} className="">
                    <Ellipsis />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-black/50 shadow-sm rounded-md p-2">
                <DeleteConfirmation apikey={apikey}/>
                <DropdownMenuItem disabled={enableToggleMutation.isPending} onClick={() => {
                  enableToggleMutation.mutate(apikey)
                  }}>
                      {apikey.enabled ? 'Disable' : 'Enable'}
                </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
          </Dialog>
      </TableCell>
    </TableRow>
        
    );
  }
  
  const DeleteConfirmation = ({apikey}:{apikey: APIKey}) => {
    const queryClient = useQueryClient();
    const deleteMutation = useMutation({
      mutationFn: async (id: string) => {
        const res = await authClient.apiKey.delete({ keyId: id });
        if (res.error) throw res.error;
        return res.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['user', 'apikey'] });
      }
    })
    return <>
    <DialogTrigger asChild><DropdownMenuItem>Delete</DropdownMenuItem></DialogTrigger>
      <DialogContent className="p-4">
        <DialogTitle>Confirm Deletion</DialogTitle>
        <p>Are you sure you want to delete this API Key?</p>
        <div className="mt-4">
          <PendableButton pending={deleteMutation.isPending} variant="outline" className="mr-2" onClick={() => deleteMutation.mutate(apikey.id)}>Delete</PendableButton>
          <Button variant="outline" onClick={() => deleteMutation.reset()}>Cancel</Button>
        </div>
      </DialogContent>
    </>
  }