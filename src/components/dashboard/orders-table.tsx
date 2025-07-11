"use client"

import * as React from "react"
import {
  File,
  PlusCircle,
  MoreHorizontal,
  Download
} from "lucide-react"
import { format, parseISO } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { mockOrders, drivers, brands, fleets } from "@/lib/data"
import { Order } from "@/lib/types"
import { CreateOrderDialog } from "./create-order-dialog"
import { useRole } from "@/contexts/role-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

export function OrdersTable() {
  const { role } = useRole()
  const [orders, setOrders] = React.useState<Order[]>(mockOrders);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const addOrder = (newOrder: Omit<Order, 'id'>) => {
    const orderWithId = { ...newOrder, id: (orders.length + 1).toString() };
    setOrders(prevOrders => [orderWithId, ...prevOrders]);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>Orders</CardTitle>
                <CardDescription>
                    Manage your orders and view their sales performance.
                </CardDescription>
            </div>
            <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="h-8 gap-1">
                    <Download className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Export
                    </span>
                </Button>
                {role !== 'Data Entry' && (
                    <CreateOrderDialog 
                        isOpen={isDialogOpen} 
                        setIsOpen={setIsDialogOpen}
                        onAddOrder={addOrder} 
                        existingOrders={orders}
                    >
                        <Button size="sm" className="h-8 gap-1 bg-primary hover:bg-primary/90">
                            <PlusCircle className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Add Order
                            </span>
                        </Button>
                    </CreateOrderDialog>
                )}
            </div>
        </div>
        <div className="mt-4 flex items-center gap-2 flex-wrap">
            <Input placeholder="Filter by Order #" className="max-w-xs h-9"/>
            <Select>
                <SelectTrigger className="w-[160px] h-9">
                    <SelectValue placeholder="Filter by driver" />
                </SelectTrigger>
                <SelectContent>
                    {drivers.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
            </Select>
            <Select>
                <SelectTrigger className="w-[160px] h-9">
                    <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Pickup">Pickup</SelectItem>
                    <SelectItem value="Delivery">Delivery</SelectItem>
                </SelectContent>
            </Select>
            <Select>
                <SelectTrigger className="w-[160px] h-9">
                    <SelectValue placeholder="Filter by brand" />
                </SelectTrigger>
                <SelectContent>
                    {brands.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                </SelectContent>
            </Select>
            <Select>
                <SelectTrigger className="w-[160px] h-9">
                    <SelectValue placeholder="Filter by fleet" />
                </SelectTrigger>
                <SelectContent>
                    {fleets.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                </SelectContent>
            </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead className="hidden md:table-cell">Type</TableHead>
              <TableHead className="hidden md:table-cell">Fleet</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.orderNumber}</TableCell>
                <TableCell>
                  <Badge variant={order.status === 'Completed' ? 'default' : order.status === 'Pending' ? 'secondary' : 'destructive'} 
                         className={order.status === 'Completed' ? 'bg-green-600' : order.status === 'Pending' ? 'bg-yellow-500' : 'bg-red-600'}>
                      {order.status}
                  </Badge>
                </TableCell>
                <TableCell>{order.driver}</TableCell>
                <TableCell className="hidden md:table-cell">{order.type}</TableCell>
                <TableCell className="hidden md:table-cell">{order.fleet}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {format(parseISO(order.date.toISOString()), 'MM/dd/yyyy')}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      {role === 'Admin' && (
                        <DropdownMenuItem className="text-destructive">
                          Cancel Order
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
