
"use client"

import * as React from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { Order, Driver } from "@/lib/types"
import { useData } from "@/contexts/data-context"
import { SelectDriverDialog } from "./select-driver-dialog"


const orderSchema = z.object({
  orderNumber: z.string().min(1, "No. de pedido es requerido"),
  driver: z.string().min(1, "Motorista es requerido"),
  date: z.date({ required_error: "La fecha es requerida." }),
  type: z.string().min(1, "Tipo de pedido es requerido"),
  brand: z.string().min(1, "Marca es requerida"),
  fleet: z.string().min(1, "Flota es requerida"),
  quantity: z.coerce.number().min(1, "La cantidad debe ser al menos 1"),
  observations: z.string().optional(),
});

type CreateOrderDialogProps = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    onSave: (order: Omit<Order, 'id' | 'enteredBy'>, newDriver?: Omit<Driver, 'id'>) => void;
    existingOrders: Order[];
    order: Order | null;
}

export function CreateOrderDialog({ isOpen, setIsOpen, onSave, existingOrders, order }: CreateOrderDialogProps) {
  const { toast } = useToast();
  const { user, role, brands, orderTypes, addAuditLog } = useData();
  const [isSelectDriverOpen, setIsSelectDriverOpen] = React.useState(false);
  const [newDriverData, setNewDriverData] = React.useState<Omit<Driver, 'id'> | null>(null);

  const brandNames = React.useMemo(() => brands.map(b => b.name), [brands]);
  const orderTypeNames = React.useMemo(() => orderTypes.map(ot => ot.name), [orderTypes]);
  
  const form = useForm<z.infer<typeof orderSchema>>({
    resolver: zodResolver(orderSchema),
    mode: 'onChange',
  });

  React.useEffect(() => {
    // Only reset form when dialog opens or the specific order changes
    if (isOpen) {
      setNewDriverData(null); // Reset pending new driver
      if (order) {
        form.reset({
          ...order,
          date: new Date(order.date),
          observations: order.observations || "",
        });
      } else {
        form.reset({
          orderNumber: "",
          driver: "",
          date: new Date(),
          brand: "",
          fleet: "",
          type: orderTypeNames.includes("Larga distancia") ? "Larga distancia" : (orderTypeNames[0] || ""),
          quantity: 1,
          observations: "",
        });
      }
    }
  }, [isOpen, order, form, brandNames, orderTypeNames]);


  function onSubmit(values: z.infer<typeof orderSchema>) {
    if (!order) {
      const isDuplicate = existingOrders.some(
        o =>
          o.orderNumber === values.orderNumber &&
          o.driver === values.driver &&
          format(o.date, 'yyyy-MM-dd') === format(values.date, 'yyyy-MM-dd')
      );

      if (isDuplicate) {
        toast({
          variant: "destructive",
          title: "Pedido Duplicado",
          description: "Ya existe un pedido con este número, motorista y fecha.",
        });
        return;
      }
    }
    
    // Pass new driver data if it exists
    onSave(values, newDriverData || undefined);

    toast({
      title: order ? "Pedido Actualizado" : "Pedido Creado",
      description: `El pedido ${values.orderNumber} ha sido guardado exitosamente.`,
    });
    
    setIsOpen(false);
  }
  
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  }

  const handleDriverSelect = (driver: Driver | Omit<Driver, 'id'>) => {
    if ('id' in driver) {
        // Existing driver selected
        setNewDriverData(null);
    } else {
        // New driver data received
        setNewDriverData(driver);
    }
    form.setValue("driver", driver.name, { shouldValidate: true });
    form.setValue("fleet", driver.fleet, { shouldValidate: true });
    setIsSelectDriverOpen(false);
  };
  
  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="font-headline">{order ? 'Editar Pedido' : 'Agregar Nuevo Pedido'}</DialogTitle>
            <DialogDescription>
              {order ? 'Modifique los detalles del pedido.' : 'Ingrese los detalles del nuevo pedido.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                      <FormField
                          control={form.control}
                          name="orderNumber"
                          render={({ field }) => (
                              <FormItem>
                              <FormLabel>No. Pedido</FormLabel>
                              <FormControl>
                                  <Input placeholder="e.g., ORD1234" {...field} />
                              </FormControl>
                              <FormMessage />
                              </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="date"
                          render={({ field }) => (
                              <FormItem>
                              <FormLabel>Fecha de Ingreso</FormLabel>
                              <Popover>
                                  <PopoverTrigger asChild>
                                  <FormControl>
                                      <Button
                                      variant={"outline"}
                                      className={cn(
                                          "w-full pl-3 text-left font-normal",
                                          !field.value && "text-muted-foreground"
                                      )}
                                      >
                                      {field.value ? (
                                          format(field.value, "PPP")
                                      ) : (
                                          <span>Seleccione una fecha</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                  </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                      mode="single"
                                      selected={field.value}
                                      onSelect={field.onChange}
                                      initialFocus
                                  />
                                  </PopoverContent>
                              </Popover>
                              <FormMessage />
                              </FormItem>
                          )}
                      />
                  </div>
                   <FormField
                      control={form.control}
                      name="driver"
                      render={({ field }) => (
                           <FormItem>
                              <FormLabel>Nombre Motorista</FormLabel>
                               <FormControl>
                                    <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full justify-start text-left font-normal"
                                    onClick={() => setIsSelectDriverOpen(true)}
                                    >
                                    {field.value ? field.value : "Seleccionar Motorista"}
                                    </Button>
                                </FormControl>
                              <FormMessage />
                          </FormItem>
                      )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                      <FormField
                          control={form.control}
                          name="brand"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Marca</FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value} disabled={brandNames.length === 0}>
                                      <FormControl>
                                          <SelectTrigger>
                                              <SelectValue placeholder={brandNames.length > 0 ? "Seleccione una marca" : "Añada marcas en Gestión"} />
                                          </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>{brandNames.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                                  </Select>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                      <FormField
                          control={form.control}
                          name="type"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Tipo de Pedido</FormLabel>
                                  <Select onValueChange={field.onChange} value={field.value} disabled={orderTypeNames.length === 0}>
                                      <FormControl>
                                          <SelectTrigger>
                                              <SelectValue placeholder={orderTypeNames.length > 0 ? "Seleccione un tipo" : "Añada tipos en Gestión"} />
                                          </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>{orderTypeNames.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                                  </Select>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                      <FormField
                          control={form.control}
                          name="quantity"
                          render={({ field }) => (
                              <FormItem>
                              <FormLabel>Cantidad</FormLabel>
                              <FormControl>
                                  <Input type="number" placeholder="e.g., 2" {...field} />
                              </FormControl>
                              <FormMessage />
                              </FormItem>
                          )}
                      />
                       <FormField
                          control={form.control}
                          name="fleet"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Flota (Automática)</FormLabel>
                                      <FormControl>
                                          <Input disabled {...field} />
                                      </FormControl>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                  </div>
                  <FormField
                      control={form.control}
                      name="observations"
                      render={({ field }) => (
                          <FormItem>
                          <FormLabel>Observaciones</FormLabel>
                          <FormControl>
                              <Textarea 
                                  placeholder="Añada observaciones aquí..." 
                                  {...field} 
                              />
                          </FormControl>
                          <FormMessage />
                          </FormItem>
                      )}
                  />
                  <DialogFooter>
                      <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancelar</Button>
                      <Button type="submit" className="bg-primary hover:bg-primary/90">Guardar Pedido</Button>
                  </DialogFooter>
              </form>
          </Form>
        </DialogContent>
      </Dialog>
      <SelectDriverDialog
        isOpen={isSelectDriverOpen}
        setIsOpen={setIsSelectDriverOpen}
        onSelectDriver={handleDriverSelect}
      />
    </>
  )
}

    

    