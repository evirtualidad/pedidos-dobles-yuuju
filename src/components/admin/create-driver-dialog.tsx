
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
import { useData } from "@/contexts/data-context";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import type { Driver } from "@/lib/types";

const driverSchema = z.object({
  name: z.string().min(1, "El nombre del motorista es requerido."),
  fleet: z.string().min(1, "La flota es requerida."),
});

type CreateDriverDialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSave: (driver: Omit<Driver, 'id'>) => void;
  initialName?: string;
};

export function CreateDriverDialog({ isOpen, setIsOpen, onSave, initialName }: CreateDriverDialogProps) {
  const { fleets } = useData();
  const fleetNames = React.useMemo(() => fleets.map(f => f.name), [fleets]);

  const form = useForm<z.infer<typeof driverSchema>>({
    resolver: zodResolver(driverSchema),
    defaultValues: {
      name: "",
      fleet: "",
    },
  });
  
  React.useEffect(() => {
    if (isOpen) {
        form.reset({
            name: initialName || "",
            fleet: fleetNames.length > 0 ? fleetNames[0] : "",
        });
    }
  }, [isOpen, form, fleetNames, initialName]);

  const onSubmit = (values: z.infer<typeof driverSchema>) => {
    onSave(values);
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
          <DialogTitle>Añadir Nuevo Motorista</DialogTitle>
          <DialogDescription>
            Ingresa los detalles para el nuevo motorista.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Motorista</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Juan Pérez" {...field} />
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
                        <FormLabel>Flota</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} disabled={fleetNames.length === 0}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder={fleetNames.length > 0 ? "Seleccione una flota" : "Añada flotas en Gestión"} />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>{fleetNames.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">Guardar Motorista</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
