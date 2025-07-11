
"use client"

import * as React from "react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import type { Order } from "@/lib/types"

type ViewOrderDialogProps = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    order: Order | null;
}

export function ViewOrderDialog({ isOpen, setIsOpen, order }: ViewOrderDialogProps) {
  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-headline">Detalles del Pedido: {order.orderNumber}</DialogTitle>
          <DialogDescription>
            Información completa de la orden.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Motorista</p>
                    <p>{order.driver}</p>
                </div>
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Fecha de Ingreso</p>
                    <p>{format(order.date, "PPP")}</p>
                </div>
            </div>
            <Separator />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Marca</p>
                    <p>{order.brand}</p>
                </div>
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Tipo</p>
                    <p>{order.type}</p>
                </div>
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Flota</p>
                    <p>{order.fleet}</p>
                </div>
                    <div>
                    <p className="text-sm font-medium text-muted-foreground">Cantidad</p>
                    <p>{order.quantity}</p>
                </div>
            </div>
            <Separator />
            <div>
                <p className="text-sm font-medium text-muted-foreground">Observaciones</p>
                <p className="mt-1 text-sm">
                    {order.observations || 'Sin observaciones.'}
                </p>
            </div>
                <Separator />
                <div>
                <p className="text-sm font-medium text-muted-foreground">Ingresado por</p>
                <p className="mt-1 text-sm">{order.enteredBy}</p>
            </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={() => setIsOpen(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
