
"use client"

import * as React from "react"
import Link from "next/link"
import { format } from "date-fns"
import Papa from "papaparse"
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
  DropdownMenuSeparator,
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
import { CancelOrderDialog } from "./cancel-order-dialog";
import { useRole } from "@/contexts/role-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { ClientDate } from "../client-date"
import { useToast } from "@/hooks/use-toast"

export function OrdersTable() {
  const { role, user } = useRole()
  const { toast } = useToast();
  const [orders, setOrders] = React.useState<Order[]>(mockOrders);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = React.useState(false);
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  
  const [filters, setFilters] = React.useState({
    orderNumber: '',
    driver: '',
    brand: '',
    fleet: '',
  });

  const handleFilterChange = (filterName: keyof typeof filters, value: string) => {
    // If the "all" option is selected, reset the specific filter
    if (value.startsWith('all-')) {
      setFilters(prev => ({ ...prev, [filterName]: '' }));
    } else {
      setFilters(prev => ({ ...prev, [filterName]: value }));
    }
  };

  const filteredOrders = React.useMemo(() => {
    // Start with all orders, then filter based on role
    let roleFilteredOrders = orders;
    if (role === 'Fleet Supervisor' && user.fleet) {
        roleFilteredOrders = orders.filter(order => order.fleet === user.fleet);
    }

    return roleFilteredOrders.filter(order => {
      return (
        (filters.orderNumber === '' || order.orderNumber.toLowerCase().includes(filters.orderNumber.toLowerCase())) &&
        (filters.driver === '' || order.driver === filters.driver) &&
        (filters.brand === '' || order.brand === filters.brand) &&
        (filters.fleet === '' || order.fleet === filters.fleet)
      );
    }).sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [orders, filters, role, user.fleet]);

  const handleAddOrder = (newOrder: Omit<Order, 'id'>) => {
    const orderWithId = { ...newOrder, id: (orders.length + 1).toString() };
    setOrders(prevOrders => [orderWithId, ...prevOrders]);
  };
  
  const handleUpdateOrder = (updatedOrder: Omit<Order, 'id'>) => {
      if(!selectedOrder) return;
      setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...selectedOrder, ...updatedOrder } : o));
      setSelectedOrder(null);
  };
  
  const handleCancelOrder = () => {
    if (selectedOrder) {
      setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, status: 'Cancelled' } : o));
      toast({
        title: "Orden Cancelada",
        description: `La orden ${selectedOrder.orderNumber} ha sido cancelada.`,
      });
      setIsCancelDialogOpen(false);
      setSelectedOrder(null);
    }
  };
  
  const handleExport = () => {
    const dataToExport = filteredOrders.map(o => ({
      'Fecha': format(o.date, 'yyyy-MM-dd'),
      'Motorista': o.driver,
      'Flota': o.fleet,
      'No. Orden': o.orderNumber,
      'Tipo de Pedido': o.type,
      'Marca': o.brand,
      'Cantidad': o.quantity,
      'Estado': o.status,
      'Ingresado Por': o.enteredBy,
      'Observaciones': o.observations,
    }));
    
    const csv = Papa.unparse(dataToExport);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'ordenes.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
        title: "Exportación Exitosa",
        description: `${filteredOrders.length} órdenes han sido exportadas a ordenes.csv`,
    });
  }

  const openEditDialog = (order: Order) => {
    setSelectedOrder(order);
    setIsCreateDialogOpen(true);
  };

  const openCancelDialog = (order: Order) => {
    setSelectedOrder(order);
    setIsCancelDialogOpen(true);
  };

  const closeCreateDialog = () => {
    setSelectedOrder(null);
    setIsCreateDialogOpen(false);
  }

  const getStatusVariant = (status: Order['status']) => {
    switch (status) {
      case 'Completed':
        return 'default';
      case 'Pending':
        return 'secondary';
      case 'Cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const canAddOrder = role === 'Admin' || role === 'Data Entry';

  return (
    <>
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
                <Button size="sm" variant="outline" className="h-8 gap-1" onClick={handleExport}>
                    <Download className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Exportar
                    </span>
                </Button>
                {canAddOrder && (
                  <Button size="sm" className="h-8 gap-1 bg-primary hover:bg-primary/90" onClick={() => setIsCreateDialogOpen(true)}>
                      <PlusCircle className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Agregar Orden
                      </span>
                  </Button>
                )}
            </div>
        </div>
        <div className="mt-4 flex items-center gap-2 flex-wrap">
            <Input 
                placeholder="Filtrar por No. Orden..." 
                className="max-w-xs h-9"
                value={filters.orderNumber}
                onChange={e => handleFilterChange('orderNumber', e.target.value)}
            />
            <Select value={filters.driver} onValueChange={value => handleFilterChange('driver', value)}>
                <SelectTrigger className="w-[180px] h-9">
                    <SelectValue placeholder="Filtrar por motorista" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all-drivers">Todos</SelectItem>
                    {drivers.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
            </Select>
            <Select value={filters.brand} onValueChange={value => handleFilterChange('brand', value)}>
                <SelectTrigger className="w-[160px] h-9">
                    <SelectValue placeholder="Filtrar por marca" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all-brands">Todas</SelectItem>
                    {brands.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                </SelectContent>
            </Select>
            <Select value={filters.fleet} onValueChange={value => handleFilterChange('fleet', value)}>
                <SelectTrigger className="w-[160px] h-9">
                    <SelectValue placeholder="Filtrar por flota" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all-fleets">Todas</SelectItem>
                    {fleets.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                </SelectContent>
            </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Motorista</TableHead>
              <TableHead>Flota</TableHead>
              <TableHead>No. Orden</TableHead>
              <TableHead>Tipo de Pedido</TableHead>
              <TableHead>Creado por</TableHead>
              <TableHead>
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id} className={order.status === 'Cancelled' ? 'text-muted-foreground' : ''}>
                <TableCell>
                  <ClientDate date={order.date} formatString="MM/dd/yyyy" />
                </TableCell>
                <TableCell>{order.driver}</TableCell>
                <TableCell>{order.fleet}</TableCell>
                <TableCell className="font-medium">{order.orderNumber}</TableCell>
                <TableCell>{order.type}</TableCell>
                <TableCell>{order.enteredBy}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost" disabled={order.status === 'Cancelled'}>
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href={`/orders/${order.id}`}>Ver Detalles</Link>
                      </DropdownMenuItem>
                       <DropdownMenuItem onClick={() => openEditDialog(order)}>
                        Editar
                      </DropdownMenuItem>
                      {role === 'Admin' && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => openCancelDialog(order)}>
                            Cancelar Orden
                          </DropdownMenuItem>
                        </>
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

    <CreateOrderDialog
        isOpen={isCreateDialogOpen}
        setIsOpen={closeCreateDialog}
        onSave={selectedOrder ? handleUpdateOrder : handleAddOrder}
        existingOrders={orders}
        order={selectedOrder}
    />
    
    <CancelOrderDialog
        isOpen={isCancelDialogOpen}
        setIsOpen={setIsCancelDialogOpen}
        onConfirm={handleCancelOrder}
        orderNumber={selectedOrder?.orderNumber}
    />
    </>
  )
}
