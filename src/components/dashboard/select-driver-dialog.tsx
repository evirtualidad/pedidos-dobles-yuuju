
"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useData } from "@/contexts/data-context"
import { Driver } from "@/lib/types"
import { CreateDriverDialog } from "../admin/create-driver-dialog"
import { UserPlus } from "lucide-react"

type SelectDriverDialogProps = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  onSelectDriver: (driver: Driver | Omit<Driver, 'id'>) => void
}

export function SelectDriverDialog({
  isOpen,
  setIsOpen,
  onSelectDriver,
}: SelectDriverDialogProps) {
  const { drivers } = useData()
  const [searchTerm, setSearchTerm] = React.useState("")
  const [isCreateDriverOpen, setIsCreateDriverOpen] = React.useState(false)

  const filteredDrivers = React.useMemo(() => {
    return drivers.filter(driver =>
      driver.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [drivers, searchTerm])
  
  const handleCreateDriverSave = (driverData: Omit<Driver, 'id'>) => {
    onSelectDriver(driverData);
    setIsCreateDriverOpen(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Seleccionar Motorista</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-between gap-4">
            <Input
              placeholder="Buscar motorista..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="flex-grow"
            />
            <Button onClick={() => setIsCreateDriverOpen(true)} className="gap-1">
              <UserPlus className="h-4 w-4" />
              Crear Nuevo
            </Button>
          </div>
          <ScrollArea className="h-72 w-full rounded-md border">
            <Table>
              <TableHeader className="sticky top-0 bg-muted">
                <TableRow>
                  <TableHead>Nombre del Motorista</TableHead>
                  <TableHead>Flota Asignada</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDrivers.map(driver => (
                  <TableRow 
                    key={driver.id} 
                    onClick={() => onSelectDriver(driver)}
                    className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
                  >
                    <TableCell>{driver.name}</TableCell>
                    <TableCell className="text-muted-foreground group-hover:text-accent-foreground">
                      {driver.fleet}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {filteredDrivers.length === 0 && (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No se encontraron motoristas.
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
      <CreateDriverDialog
        isOpen={isCreateDriverOpen}
        setIsOpen={setIsCreateDriverOpen}
        onSave={handleCreateDriverSave}
        initialName={searchTerm}
      />
    </>
  )
}
