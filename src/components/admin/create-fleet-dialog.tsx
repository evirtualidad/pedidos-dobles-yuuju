
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
import type { Fleet } from "@/lib/types";

const fleetSchema = z.object({
  name: z.string().min(1, "El nombre de la flota es requerido."),
});

type CreateFleetDialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSave: (name: string) => void;
  fleet: Fleet | null;
};

export function CreateFleetDialog({ isOpen, setIsOpen, onSave, fleet }: CreateFleetDialogProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof fleetSchema>>({
    resolver: zodResolver(fleetSchema),
    defaultValues: {
      name: "",
    },
  });
  
  React.useEffect(() => {
    if (fleet) {
      form.setValue("name", fleet.name);
    } else {
      form.reset({ name: "" });
    }
  }, [fleet, form]);

  const onSubmit = (values: z.infer<typeof fleetSchema>) => {
    onSave(values.name);
    toast({
      title: fleet ? "Flota Actualizada" : "Flota Creada",
      description: `La flota "${values.name}" ha sido guardada exitosamente.`,
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
          <DialogTitle>{fleet ? "Editar Flota" : "Añadir Nueva Flota"}</DialogTitle>
          <DialogDescription>
            {fleet ? "Edita el nombre de la flota." : "Ingresa el nombre para la nueva flota."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la Flota</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Flota Central" {...field} />
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
