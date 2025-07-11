
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
import type { Brand } from "@/lib/types";

const brandSchema = z.object({
  name: z.string().min(1, "El nombre de la marca es requerido."),
});

type CreateBrandDialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSave: (name: string) => void;
  brand: Brand | null;
};

export function CreateBrandDialog({ isOpen, setIsOpen, onSave, brand }: CreateBrandDialogProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof brandSchema>>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: "",
    },
  });
  
  React.useEffect(() => {
    if (brand) {
      form.setValue("name", brand.name);
    } else {
      form.reset({ name: "" });
    }
  }, [brand, form]);

  const onSubmit = (values: z.infer<typeof brandSchema>) => {
    onSave(values.name);
    toast({
      title: brand ? "Marca Actualizada" : "Marca Creada",
      description: `La marca "${values.name}" ha sido guardada exitosamente.`,
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
          <DialogTitle>{brand ? "Editar Marca" : "Añadir Nueva Marca"}</DialogTitle>
          <DialogDescription>
            {brand ? "Edita el nombre de la marca." : "Ingresa el nombre para la nueva marca."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la Marca</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Marca A" {...field} />
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
