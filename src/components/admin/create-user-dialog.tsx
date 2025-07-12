
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { UserWithId, Role } from "@/lib/types";

const userSchema = z.object({
  name: z.string().min(1, "El nombre del usuario es requerido."),
  email: z.string().email("Debe ser un correo válido."),
  role: z.enum(['Admin', 'Fleet Supervisor', 'Data Entry']),
  fleet: z.string().optional(),
}).refine(data => {
    if (data.role === 'Fleet Supervisor') {
        return !!data.fleet;
    }
    return true;
}, {
    message: "La flota es requerida para el rol de Supervisor.",
    path: ["fleet"],
});


type CreateUserDialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSave: (user: Omit<UserWithId, 'id'>) => void;
  user: UserWithId | null;
  fleets: string[];
};

export function CreateUserDialog({ isOpen, setIsOpen, onSave, user, fleets }: CreateUserDialogProps) {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "Data Entry",
      fleet: "",
    },
  });

  const selectedRole = form.watch("role");

  React.useEffect(() => {
    if (user) {
      form.reset({
          name: user.name,
          email: user.email,
          role: user.role,
          fleet: user.fleet || "",
      });
    } else {
      form.reset({ name: "", email: "", role: "Data Entry", fleet: "" });
    }
  }, [user, form, isOpen]); // Added isOpen to ensure reset happens when dialog opens
  
  React.useEffect(() => {
    if (selectedRole !== 'Fleet Supervisor') {
        form.setValue('fleet', '');
    }
  }, [selectedRole, form]);

  const onSubmit = (values: z.infer<typeof userSchema>) => {
    const userData: Omit<UserWithId, 'id'> = {
        name: values.name,
        email: values.email,
        role: values.role,
    };

    if (values.role === 'Fleet Supervisor') {
        userData.fleet = values.fleet;
    }

    onSave(userData);
    toast({
      title: user ? "Usuario Actualizado" : "Usuario Creado",
      description: `El usuario "${values.name}" ha sido guardado exitosamente.`,
    });
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
          <DialogTitle>{user ? "Editar Usuario" : "Añadir Nuevo Usuario"}</DialogTitle>
          <DialogDescription>
            {user ? "Edita los detalles del usuario." : "Ingresa los detalles para el nuevo usuario."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de Usuario</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo Electrónico (para inicio de sesión)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., john.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rol</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                        <SelectTrigger><SelectValue placeholder="Seleccione un rol" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Fleet Supervisor">Fleet Supervisor</SelectItem>
                        <SelectItem value="Data Entry">Data Entry</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {selectedRole === 'Fleet Supervisor' && (
                 <FormField
                    control={form.control}
                    name="fleet"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Flota</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger><SelectValue placeholder="Seleccione una flota" /></SelectTrigger>
                                </FormControl>
                                <SelectContent>{fleets.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            )}
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => handleOpenChange(false)}>
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
