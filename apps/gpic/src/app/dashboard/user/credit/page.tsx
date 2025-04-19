'use client'
import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { api } from "@/lib/api"
import { queryKeys } from "@/lib/query"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { toast } from "sonner"
import { useBalance } from "@/hooks/use-balance"
import { Recharge } from "./recharge"
import { Label } from "@/components/ui/label"
import {Coins} from "lucide-react";

type Order = {
  id: string
  amount: number
  createdAt: string
  updatedAt: string
  taskId?: string
  msg?: string
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function Page() {
    const queryClient = useQueryClient()
    const [redeemCode, setRedeemCode] = useState('')

    const { balance, isPending: isBalancePending } = useBalance()
    const { data: orders, isPending: isOrdersPending } = useQuery({
      queryKey: queryKeys.orders,
      queryFn: async () => {
        const res = await api.getOrders()
        return res as Order[]
      },
    })

    const redeemMutation = useMutation({
      mutationFn: async (code: string) => {
        const res = api.redeemCode(code)
        return res
      },
      onSuccess: (data) => {
        toast.success('Code redeemed successfully!')
        setRedeemCode('')
        queryClient.invalidateQueries({ queryKey: queryKeys.balance })
        queryClient.invalidateQueries({ queryKey: queryKeys.orders })
      },
    })

    const handleRedeemSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (!redeemCode.trim()) {
        toast.warning('Please enter a redeem code.')
        return
      }
      redeemMutation.mutate(redeemCode.trim())
    }


    return <>

      <div className={'flex justify-between items-center'}>
        <div>
          <Label className={'text-3xl font-bold'}>Credit</Label>
          <Label className={'text-sm'}>Add credit and check orders</Label>
        </div>
        <span className={'inline-flex gap-2 text-xl '}>
          <Coins/>
            {isBalancePending ? (
              <Skeleton className="h-7 w-2" />
            ) : (
              <span className="text-xl font-bold">{balance ?? 0}</span>
            )}
          Credits
        </span>
      </div>


      <div className="flex flex-col gap-4 mt-2 w-full h-fit overflow-y-scroll relative">

        <div className="w-full">
            <h3 className="text-xl font-semibold mb-2">Redeem Code</h3>
          <div className={'text-secondary-foreground text-xs mb-2'}>concat to get a redeem code before payment method prepared</div>
            <form onSubmit={handleRedeemSubmit} className="flex gap-2">
                <Input
                    type="text"
                    placeholder="Enter your code"
                    value={redeemCode}
                    onChange={(e) => setRedeemCode(e.target.value)}
                    disabled={redeemMutation.isPending}
                    className="flex-grow  placeholder:text-secondary-foreground"
                />
                <Button type="submit" disabled={redeemMutation.isPending}>
                    {redeemMutation.isPending ? 'Redeeming...' : 'Redeem'}
                </Button>
            </form>
        </div>
        {/* Recharge Section */}
        <div className="w-full">
            <h3 className="text-lg font-semibold mb-3">Recharge Credits</h3>
            <Recharge/>
        </div>
        <Table
          containerClassName="overflow-x-unset"
          className="h-fit overflow-y-auto">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[100px]">Task ID</TableHead>
              <TableHead>msg</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isOrdersPending ? (
              Array.from({ length: 3 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                </TableRow>
              ))
            ) : orders && orders.length > 0 ? (
              orders.map((order) => (
                <OrderRow key={order.id} order={order} />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24 text-secondary-foreground">
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  }

interface OrderRowProps {
    order: Order;
}

function OrderRow({ order }: OrderRowProps) {
    const isPositive = order.amount > 0;
    return (
        <TableRow>
            <TableCell className={`font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? `+${order.amount}` : order.amount}
            </TableCell>
            <TableCell className="text-sm text-secondary-foreground">{formatDate(order.createdAt)}</TableCell>
            <TableCell>
                {order.taskId ? (
                <Link href={`/task/${order.taskId}`} className="text-blue-600 hover:underline text-xs font-mono" target="_blank" rel="noopener noreferrer">
                    {order.taskId.substring(0, 8)}...
                </Link>
                ) : (
                <span className="text-secondary-foreground">-</span>
                )}
            </TableCell>
            <TableCell className="text-sm text-ellipsis line-clamp-1 max-w-30">
            {order.msg ?? <span className="text-secondary-foreground">-</span>}

            </TableCell>
        </TableRow>
    );
}
  
