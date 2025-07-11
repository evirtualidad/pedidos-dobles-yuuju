
"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CancelOrderDialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onConfirm: () => void;
  orderNumber?: string;
};

export function CancelOrderDialog({ isOpen, setIsOpen, onConfirm, orderNumber }: CancelOrderDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro que quieres cancelar esta orden?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. La orden <span className="font-semibold">{`"${orderNumber}"`}</span> será marcada como cancelada.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Volver</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className={cn(buttonVariants({ variant: "destructive" }))}
          >
            Sí, Cancelar Orden
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
