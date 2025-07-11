"use client"

import * as React from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

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
import { drivers, brands, fleets, orderTypes } from "@/lib/data"
import { Order } from "@/lib/types"
import { useRole } from "@/contexts/role-context"

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
    children: React.ReactNode;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    onAddOrder: (order: Omit<Order, 'id'>) => void;
    existingOrders: Order[];
}

export function CreateOrderDialog({ children, isOpen, setIsOpen, onAddOrder, existingOrders }: CreateOrderDialogProps) {
  const { toast } = useToast();
  const { role, user } = useRole();

  const form = useForm<z.infer<typeof orderSchema>>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      orderNumber: "",
      driver: "",
      brand: "",
      fleet: "",
      type: "",
      quantity: 1,
      observations: "",
    },
  });

  function onSubmit(values: z.infer<typeof orderSchema>) {
    const isDuplicate = existingOrders.some(
      order =>
        order.orderNumber === values.orderNumber &&
        order.driver === values.driver &&
        format(order.date, 'yyyy-MM-dd') === format(values.date, 'yyyy-MM-dd')
    );

    if (isDuplicate) {
      toast({
        variant: "destructive",
        title: "Pedido Duplicado",
        description: "Ya existe un pedido con este número, motorista y fecha.",
      });
      return;
    }

    onAddOrder({ 
        ...values, 
        status: 'Pending',
        enteredBy: user.name, // Add user who created it
    });

    toast({
      title: "Pedido Creado",
      description: `El pedido ${values.orderNumber} ha sido creado exitosamente.`,
    });
    
    form.reset();
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div onClick={() => setIsOpen(true)}>{children}</div>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Agregar Nuevo Pedido Doble</DialogTitle>
          <DialogDescription>
            Ingrese los detalles del nuevo pedido.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
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
                </div>
                 <FormField
                    control={form.control}
                    name="driver"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nombre Motorista</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger><SelectValue placeholder="Seleccione un motorista" /></SelectTrigger>
                                </FormControl>
                                <SelectContent>{drivers.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                            </Select>
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
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger><SelectValue placeholder="Seleccione una marca" /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>{brands.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
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
                                <FormLabel>Tipo de Pedido Doble</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger><SelectValue placeholder="Seleccione un tipo" /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>{orderTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                     <FormField
                        control={form.control}
                        name="fleet"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Flota</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger><SelectValue placeholder="Seleccione una flota" /></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>{fleets.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Cantidad de Dobles</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="e.g., 2" {...field} />
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
                            <Textarea placeholder="Añada observaciones aquí..." {...field} />
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
  )
}
