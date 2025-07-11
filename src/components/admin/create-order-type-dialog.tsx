
"use client";

import * as React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import type { OrderType } from "@/lib/types";

const orderTypeSchema = z.object({
  name: z.string().min(1, "El nombre del tipo de pedido es requerido."),
});

type CreateOrderTypeDialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSave: (name: string) => void;
  orderType: OrderType | null;
};

export function CreateOrderTypeDialog({ isOpen, setIsOpen, onSave, orderType }: CreateOrderTypeDialogProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof orderTypeSchema>>({
    resolver: zodResolver(orderTypeSchema),
    defaultValues: {
      name: "",
    },
  });
  
  React.useEffect(() => {
    if (orderType) {
      form.setValue("name", orderType.name);
    } else {
      form.reset({ name: "" });
    }
  }, [orderType, form]);

  const onSubmit = (values: z.infer<typeof orderTypeSchema>) => {
    onSave(values.name);
    toast({
      title: orderType ? "Tipo de Pedido Actualizado" : "Tipo de Pedido Creado",
      description: `El tipo de pedido "${values.name}" ha sido guardado exitosamente.`,
    });
    form.reset();
    setIsOpen(false);
  };
  
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
    }
    setIsOpen(open);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{orderType ? "Editar Tipo de Pedido" : "Añadir Nuevo Tipo de Pedido"}</DialogTitle>
          <DialogDescription>
            {orderType ? "Edita el nombre del tipo de pedido." : "Ingresa el nombre para el nuevo tipo de pedido."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Tipo de Pedido</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Pedido Estándar" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Guardar</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
