"use client"

import * as React from "react"
import {
  File,
  PlusCircle,
  MoreHorizontal,
  Download
} from "lucide-react"
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
import { ClientDate } from "../client-date"

export function OrdersTable() {
  const { role } = useRole()
  const [orders, setOrders] = React.useState<Order[]>(mockOrders);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const addOrder = (newOrder: Omit<Order, 'id'>) => {
    const orderWithId = { ...newOrder, id: (orders.length + 1).toString() };
    setOrders(prevOrders => [orderWithId, ...prevOrders]);
  };
  
  const canAddOrder = role === 'Admin' || role === 'Data Entry';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>Órdenes</CardTitle>
                <CardDescription>
                    Administra las órdenes y visualiza su estado.
                </CardDescription>
            </div>
            <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" className="h-8 gap-1">
                    <Download className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Exportar
                    </span>
                </Button>
                {canAddOrder && (
                    <CreateOrderDialog 
                        isOpen={isDialogOpen} 
                        setIsOpen={setIsDialogOpen}
                        onAddOrder={addOrder} 
                        existingOrders={orders}
                    >
                        <Button size="sm" className="h-8 gap-1 bg-primary hover:bg-primary/90">
                            <PlusCircle className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                            Agregar Orden
                            </span>
                        </Button>
                    </CreateOrderDialog>
                )}
            </div>
        </div>
        <div className="mt-4 flex items-center gap-2 flex-wrap">
            <Input placeholder="Filtrar por No. Orden..." className="max-w-xs h-9"/>
            <Select>
                <SelectTrigger className="w-[180px] h-9">
                    <SelectValue placeholder="Filtrar por motorista" />
                </SelectTrigger>
                <SelectContent>
                    {drivers.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
            </Select>
            <Select>
                <SelectTrigger className="w-[160px] h-9">
                    <SelectValue placeholder="Filtrar por marca" />
                </SelectTrigger>
                <SelectContent>
                    {brands.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                </SelectContent>
            </Select>
            <Select>
                <SelectTrigger className="w-[160px] h-9">
                    <SelectValue placeholder="Filtrar por flota" />
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
              <TableHead>No. Orden</TableHead>
              <TableHead>Motorista</TableHead>
              <TableHead>Marca</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Flota</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Creado por</TableHead>
              <TableHead>
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.orderNumber}</TableCell>
                <TableCell>{order.driver}</TableCell>
                <TableCell>{order.brand}</TableCell>
                <TableCell>{order.type}</TableCell>
                <TableCell>{order.fleet}</TableCell>
                <TableCell>
                  <ClientDate date={order.date} formatString="MM/dd/yyyy" />
                </TableCell>
                <TableCell>{order.enteredBy}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem>Ver Detalles</DropdownMenuItem>
                      {role === 'Admin' && (
                        <DropdownMenuItem className="text-destructive">
                          Cancelar Orden
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
