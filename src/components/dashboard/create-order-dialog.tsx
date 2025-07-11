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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { drivers, brands, fleets } from "@/lib/data"
import { Order } from "@/lib/types"
import { useRole } from "@/contexts/role-context"

const orderSchema = z.object({
  orderNumber: z.string().min(1, "Order number is required"),
  driver: z.string().min(1, "Driver is required"),
  date: z.date({ required_error: "A date is required." }),
  type: z.enum(["Pickup", "Delivery"]),
  brand: z.string().min(1, "Brand is required"),
  fleet: z.string().min(1, "Fleet is required"),
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
  const { role } = useRole();

  const form = useForm<z.infer<typeof orderSchema>>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      orderNumber: "",
      type: "Delivery",
    },
  });

  function onSubmit(values: z.infer<typeof orderSchema>) {
    // Duplication Prevention
    const isDuplicate = existingOrders.some(
      order =>
        order.orderNumber === values.orderNumber &&
        order.driver === values.driver &&
        order.date.toDateString() === values.date.toDateString()
    );

    if (isDuplicate) {
      toast({
        variant: "destructive",
        title: "Duplicate Order",
        description: "An order with this number, driver, and date already exists.",
      });
      return;
    }

    onAddOrder({ ...values, status: 'Pending' });

    toast({
      title: "Order Created",
      description: `Order ${values.orderNumber} has been successfully created.`,
    });
    
    form.reset();
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div onClick={() => setIsOpen(true)}>{children}</div>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Add New Order</DialogTitle>
          <DialogDescription>
            Enter the details for the new order. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="orderNumber"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Order Number</FormLabel>
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
                        <FormItem className="flex flex-col">
                        <FormLabel>Date</FormLabel>
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
                                    <span>Pick a date</span>
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
                                disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                                }
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
                    name="driver"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Driver</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger><SelectValue placeholder="Select a driver" /></SelectTrigger>
                                </FormControl>
                                <SelectContent>{drivers.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
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
                            <FormLabel>Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger><SelectValue placeholder="Select order type" /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="Pickup">Pickup</SelectItem>
                                    <SelectItem value="Delivery">Delivery</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Brand</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger><SelectValue placeholder="Select a brand" /></SelectTrigger>
                                </FormControl>
                                <SelectContent>{brands.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="fleet"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Fleet</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger><SelectValue placeholder="Select a fleet" /></SelectTrigger>
                                </FormControl>
                                <SelectContent>{fleets.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <DialogFooter>
                    <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button type="submit" className="bg-primary hover:bg-primary/90">Save Order</Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
