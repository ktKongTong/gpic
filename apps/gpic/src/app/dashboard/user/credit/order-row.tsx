import {TableCell, TableRow} from "@/components/ui/table";
import Link from "next/link";

interface OrderRowProps {
  order: Order;
}
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

export function OrderRow({ order }: OrderRowProps) {
  const isPositive = order.amount > 0;
  return (
    <TableRow>
      <TableCell className={`font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? `+${order.amount}` : order.amount}
      </TableCell>
      <TableCell className="text-sm text-secondary-foreground">{formatDate(order.createdAt)}</TableCell>
      <TableCell>
        {order.taskId ? (
          <Link href={`/dashboard/task/${order.taskId}`} className="text-blue-600 hover:underline text-xs font-mono" target="_blank" rel="noopener noreferrer">
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

