
"use client"

import * as React from "react"
import { format } from "date-fns"
import Papa from "papaparse"
import {
  PlusCircle,
  MoreHorizontal,
  Download,
  Calendar as CalendarIcon,
  Trash2,
  Edit,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Order, Driver } from "@/lib/types"
import { CreateOrderDialog } from "./create-order-dialog"
import { DeleteOrderDialog } from "./delete-order-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { ClientDate } from "../client-date"
import { useToast } from "@/hooks/use-toast"
import { DateRange } from "react-day-picker"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { cn } from "@/lib/utils"
import { Calendar } from "../ui/calendar"
import { useData } from "@/contexts/data-context"
import { useRouter } from "next/navigation"

export function OrdersTable() {
  const { role, user, toast, brands, fleets, orders, addOrder, updateOrder, deleteOrder, addDriver } = useData();
  const router = useRouter();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  
  const [filters, setFilters] = React.useState({
    searchTerm: '',
    driver: '',
    brand: '',
    fleet: '',
  });
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(undefined);
  
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const brandNames = brands.map(b => b.name);
  const fleetNames = fleets.map(f => f.name);
  const drivers = [...new Set(orders.map(o => o.driver))];

  const handleFilterChange = (filterName: keyof typeof filters, value: string) => {
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
    
    if (value.startsWith('all-')) {
      setFilters(prev => ({ ...prev, [filterName]: '' }));
    } else {
      setFilters(prev => ({ ...prev, [filterName]: value }));
    }
  };
  
  const handleDateChange = (range: DateRange | undefined) => {
    setDateRange(range);
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  }

  const filteredOrders = React.useMemo(() => {
    let roleFilteredOrders = orders;
    if (role === 'Fleet Supervisor' && user?.fleet) {
        roleFilteredOrders = orders.filter(order => order.fleet === user.fleet);
    }

    const lowercasedSearchTerm = filters.searchTerm.toLowerCase();

    return roleFilteredOrders.filter(order => {
      const orderDate = order.date;
      const dateMatch =
        (!dateRange?.from || orderDate >= dateRange.from) &&
        (!dateRange?.to || orderDate <= dateRange.to);
      
      const searchMatch = lowercasedSearchTerm === '' ||
        order.orderNumber.toLowerCase().includes(lowercasedSearchTerm) ||
        order.driver.toLowerCase().includes(lowercasedSearchTerm);

      return (
        dateMatch &&
        searchMatch &&
        (filters.driver === '' || order.driver === filters.driver) &&
        (filters.brand === '' || order.brand === filters.brand) &&
        (filters.fleet === '' || order.fleet === filters.fleet)
      );
    });
  }, [orders, filters, role, user?.fleet, dateRange]);
  
  const pageCount = Math.ceil(filteredOrders.length / pagination.pageSize);

  const paginatedOrders = React.useMemo(() => {
    const start = pagination.pageIndex * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredOrders.slice(start, end);
  }, [filteredOrders, pagination]);

  const handleAddOrder = async (newOrder: Omit<Order, 'id' | 'enteredBy'>, newDriverData?: Omit<Driver, 'id'>) => {
    if(!user) return;

    if (newDriverData) {
        const driverId = await addDriver(newDriverData);
        if (!driverId) {
            toast({ variant: "destructive", title: "Error", description: "No se pudo crear el nuevo motorista." });
            return;
        }
    }

    await addOrder(newOrder);
  };
  
  const handleUpdateOrder = async (updatedOrderData: Omit<Order, 'id' | 'enteredBy'>) => {
      if(!selectedOrder || !user) return;
      await updateOrder(selectedOrder.id, updatedOrderData);
      setSelectedOrder(null);
  };
  
  const handleDeleteOrder = async () => {
    if (!selectedOrder || !user) return;
    const orderToDelete = selectedOrder;
    await deleteOrder(orderToDelete.id);
    toast({
      title: "Orden Eliminada",
      description: `La orden ${orderToDelete.orderNumber} ha sido eliminada.`,
    });
    setIsDeleteDialogOpen(false);
    setSelectedOrder(null);
  };

  const handleExport = () => {
    if (filteredOrders.length === 0) {
      toast({
        variant: "destructive",
        title: "No hay datos para exportar",
        description: "Ajusta los filtros o añade nuevas órdenes.",
      });
      return;
    }

    const dataToExport = filteredOrders.map(o => ({
      'Fecha': format(o.date, 'yyyy-MM-dd'),
      'Motorista': o.driver,
      'Flota': o.fleet,
      'No. Orden': o.orderNumber,
      'Tipo de Pedido': o.type,
      'Marca': o.brand,
      'Cantidad': o.quantity,
      'Ingresado Por': o.enteredBy,
      'Observaciones': o.observations,
    }));
    
    const csv = Papa.unparse(dataToExport, { delimiter: ';' });
    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
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
  
  const openDeleteDialog = (order: Order) => {
    setSelectedOrder(order);
    setIsDeleteDialogOpen(true);
  };

  const closeCreateDialog = () => {
    setSelectedOrder(null);
    setIsCreateDialogOpen(false);
  }

  const canAddOrder = role === 'Admin' || role === 'Data Entry';
  const canEditOrDelete = role === 'Admin' || role === 'Data Entry';
  const isAdminView = role === 'Admin';
  const isSupervisorView = role === 'Fleet Supervisor';
  const isDataEntryView = role === 'Data Entry';

  return (
    <TooltipProvider>
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4">
            <div className="flex-1">
                <CardTitle>Órdenes</CardTitle>
                <CardDescription>
                    Administra las órdenes y visualiza su estado.
                </CardDescription>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button size="sm" variant="outline" className="h-8 gap-1 flex-1 sm:flex-initial" onClick={handleExport}>
                    <Download className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Exportar
                    </span>
                </Button>
                {canAddOrder && (
                  <Button size="sm" className="h-8 gap-1 bg-primary hover:bg-primary/90 flex-1 sm:flex-initial" onClick={() => setIsCreateDialogOpen(true)}>
                      <PlusCircle className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Agregar Orden
                      </span>
                  </Button>
                )}
            </div>
        </div>
        <div className="mt-4 flex flex-col sm:flex-row items-center gap-2 flex-wrap">
            <Input 
                placeholder="Buscar por No. Orden o Motorista..." 
                className="w-full sm:max-w-xs h-9"
                value={filters.searchTerm}
                onChange={e => handleFilterChange('searchTerm', e.target.value)}
            />
             <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-full sm:w-[260px] justify-start text-left font-normal h-9",
                    !dateRange && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Seleccionar rango</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={handleDateChange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
            <Select value={filters.driver} onValueChange={value => handleFilterChange('driver', value)}>
                <SelectTrigger className="w-full sm:w-[180px] h-9">
                    <SelectValue placeholder="Filtrar por motorista" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all-drivers">Todos</SelectItem>
                    {drivers.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
            </Select>
            <Select value={filters.brand} onValueChange={value => handleFilterChange('brand', value)}>
                <SelectTrigger className="w-full sm:w-[160px] h-9">
                    <SelectValue placeholder="Filtrar por marca" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all-brands">Todas</SelectItem>
                    {brandNames.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                </SelectContent>
            </Select>
            {role !== 'Fleet Supervisor' && (
              <Select value={filters.fleet} onValueChange={value => handleFilterChange('fleet', value)}>
                  <SelectTrigger className="w-full sm:w-[160px] h-9">
                      <SelectValue placeholder="Filtrar por flota" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="all-fleets">Todas</SelectItem>
                      {fleetNames.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                  </SelectContent>
              </Select>
            )}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden md:table-cell">Fecha</TableHead>
              <TableHead>Motorista</TableHead>
              <TableHead>No. Orden</TableHead>
              <TableHead className="hidden sm:table-cell">Marca</TableHead>
              <TableHead className="hidden lg:table-cell">Tipo de Pedido</TableHead>
              {!isSupervisorView && <TableHead className="hidden md:table-cell">Flota</TableHead>}
              {isAdminView || isDataEntryView ? (
                <>
                  <TableHead className="text-center">Cantidad</TableHead>
                  <TableHead className="hidden lg:table-cell">Ingresado Por</TableHead>
                </>
              ) : (
                <>
                  <TableHead className="text-center">Cantidad</TableHead>
                  <TableHead className="hidden lg:table-cell">Observaciones</TableHead>
                </>
              )}
              <TableHead>
                <span className="sr-only">Acciones</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="hidden md:table-cell font-medium">
                  <ClientDate date={order.date} formatString="MM/dd/yyyy" />
                </TableCell>
                <TableCell>{order.driver}</TableCell>
                <TableCell className="font-medium">{order.orderNumber}</TableCell>
                <TableCell className="hidden sm:table-cell">{order.brand}</TableCell>
                <TableCell className="hidden lg:table-cell">{order.type}</TableCell>
                {!isSupervisorView && <TableCell className="hidden md:table-cell">{order.fleet}</TableCell>}
                {isAdminView || isDataEntryView ? (
                    <>
                        <TableCell className="text-center">{order.quantity}</TableCell>
                        <TableCell className="hidden lg:table-cell">{order.enteredBy}</TableCell>
                    </>
                ) : (
                    <>
                        <TableCell className="text-center">{order.quantity}</TableCell>
                        <TableCell className="hidden lg:table-cell">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <p className="max-w-[150px] truncate">
                                        {order.observations || 'N/A'}
                                    </p>
                                </TooltipTrigger>
                                {order.observations && (
                                    <TooltipContent>
                                        <p className="max-w-xs">{order.observations}</p>
                                    </TooltipContent>
                                )}
                            </Tooltip>
                        </TableCell>
                    </>
                )}
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
                      <DropdownMenuItem onClick={() => router.push(`/orders/${order.id}`)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Ver Detalles
                      </DropdownMenuItem>
                      {canEditOrDelete && (
                        <>
                          <DropdownMenuItem onClick={() => openEditDialog(order)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => openDeleteDialog(order)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
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
      <CardFooter>
        <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">
            <div className="text-sm text-muted-foreground w-full sm:w-auto text-center sm:text-left">
                {filteredOrders.length} orden(es) en total.
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 lg:gap-8">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Filas</p>
                    <Select
                        value={`${pagination.pageSize}`}
                        onValueChange={(value) => {
                            setPagination({
                                pageIndex: 0,
                                pageSize: Number(value),
                            })
                        }}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={`${pagination.pageSize}`} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[10, 20, 30, 40, 50].map((pageSize) => (
                                <SelectItem key={pageSize} value={`${pageSize}`}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                    Página {pageCount > 0 ? pagination.pageIndex + 1 : 0} de {pageCount}
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => setPagination(prev => ({...prev, pageIndex: 0}))}
                        disabled={pagination.pageIndex === 0}
                    >
                        <span className="sr-only">Ir a la primera página</span>
                        <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => setPagination(prev => ({...prev, pageIndex: prev.pageIndex - 1}))}
                        disabled={pagination.pageIndex === 0}
                    >
                        <span className="sr-only">Ir a la página anterior</span>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => setPagination(prev => ({...prev, pageIndex: prev.pageIndex + 1}))}
                        disabled={pagination.pageIndex >= pageCount - 1}
                    >
                        <span className="sr-only">Ir a la página siguiente</span>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => setPagination(prev => ({...prev, pageIndex: pageCount - 1}))}
                        disabled={pagination.pageIndex >= pageCount - 1}
                    >
                        <span className="sr-only">Ir a la última página</span>
                        <ChevronsRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
      </CardFooter>
    </Card>

    <CreateOrderDialog
        isOpen={isCreateDialogOpen}
        setIsOpen={closeCreateDialog}
        onSave={selectedOrder ? handleUpdateOrder : handleAddOrder}
        existingOrders={orders}
        order={selectedOrder}
    />

    <DeleteOrderDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        onConfirm={handleDeleteOrder}
        orderNumber={selectedOrder?.orderNumber}
    />
    
    </TooltipProvider>
  )
}

    