
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

type DeleteOrderTypeDialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onConfirm: () => void;
  orderTypeName?: string;
};

export function DeleteOrderTypeDialog({ isOpen, setIsOpen, onConfirm, orderTypeName }: DeleteOrderTypeDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Esto eliminará permanentemente el tipo de pedido <span className="font-semibold">{`"${orderTypeName}"`}</span>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className={cn(buttonVariants({ variant: "destructive" }))}
          >
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
