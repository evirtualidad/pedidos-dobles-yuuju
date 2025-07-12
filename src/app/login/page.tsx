
"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
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
import { Truck } from "lucide-react";
import { useData } from "@/contexts/data-context";


const loginSchema = z.object({
  email: z.string().email("Por favor, ingresa un correo electrónico válido."),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres."),
});

export default function LoginPage() {
  const { toast } = useToast();
  const { login, users, createUser } = useData();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    const success = await login(values.email, values.password);
    
    if (!success) {
      toast({
        variant: "destructive",
        title: "Credenciales Inválidas",
        description: "El correo o la contraseña son incorrectos. Por favor, inténtalo de nuevo.",
      });
    }
    // Redirection is handled by DataContext
    setIsLoading(false);
  };
  
  const handleCreateAdmin = async (values: z.infer<typeof loginSchema>) => {
      setIsLoading(true);
      try {
        await createUser(values.email, values.password, 'Admin', 'Admin User');
        // The onAuthStateChanged listener in DataContext will handle the rest.
        toast({
            title: "Cuenta de Admin Creada",
            description: "Has sido autenticado. Serás redirigido.",
        });
      } catch (error: any) {
          toast({
                variant: "destructive",
                title: "Error al crear cuenta",
                description: error.code === 'auth/email-already-in-use' 
                    ? "El correo electrónico ya está en uso."
                    : "No se pudo crear la cuenta de administrador.",
            });
      } finally {
        setIsLoading(false);
      }
  }
  
  const noUsersExist = users.length === 0;

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="flex justify-center items-center gap-2 mb-4">
                 <Truck className="h-8 w-8 text-primary" />
                 <h1 className="text-2xl font-bold font-headline">Fleet Command</h1>
            </div>
          <CardTitle className="text-2xl">{noUsersExist ? "Crear Cuenta de Admin" : "Iniciar Sesión"}</CardTitle>
          <CardDescription>
            {noUsersExist ? "Ingresa tu correo y contraseña para crear la cuenta principal." : "Ingresa tu correo y contraseña para acceder al panel."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(noUsersExist ? handleCreateAdmin : onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo Electrónico</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="tu@correo.com"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="********"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading 
                    ? (noUsersExist ? "Creando..." : "Ingresando...") 
                    : (noUsersExist ? "Crear Cuenta Admin" : "Iniciar Sesión")
                }
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
