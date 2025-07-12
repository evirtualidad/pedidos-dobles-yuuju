
"use client"

import * as React from "react"
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useData } from "@/contexts/data-context"
import { CreateDriverDialog } from "@/components/admin/create-driver-dialog"
import type { Driver } from "@/lib/types"

interface DriverComboboxProps {
    initialDriverName: string | null;
    onDriverSelect: (driverName: string) => void;
}

export function DriverCombobox({ initialDriverName, onDriverSelect }: DriverComboboxProps) {
  const { drivers, addDriver: addDriverToContext } = useData()
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(initialDriverName || "")
  const [isCreateDriverOpen, setIsCreateDriverOpen] = React.useState(false)
  const [driverToCreate, setDriverToCreate] = React.useState("");

  React.useEffect(() => {
    setValue(initialDriverName || "");
  }, [initialDriverName]);

  const handleSelect = (currentValue: string) => {
    const driverName = currentValue === value ? "" : currentValue;
    setValue(driverName);
    onDriverSelect(driverName);
    setOpen(false);
  }

  const handleCreateDriver = async (driverData: Omit<Driver, 'id'>) => {
    await addDriverToContext(driverData);
    setIsCreateDriverOpen(false);
    handleSelect(driverData.name);
  };
  
  const openCreateDialog = (inputValue: string) => {
    setDriverToCreate(inputValue);
    setIsCreateDriverOpen(true);
    setOpen(false);
  }

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {value
              ? drivers.find((driver) => driver.name.toLowerCase() === value.toLowerCase())?.name
              : "Seleccione un motorista..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command>
            <CommandInput 
                placeholder="Buscar motorista..."
            />
            <CommandList>
                <CommandEmpty onSelect={() => openCreateDialog((document.querySelector('[cmdk-input]') as HTMLInputElement)?.value)}>
                    <div className="p-1">
                         <Button variant="ghost" className="w-full text-left justify-start">
                             <PlusCircle className="mr-2 h-4 w-4" />
                             Crear "{ (document.querySelector('[cmdk-input]') as HTMLInputElement)?.value }"
                         </Button>
                    </div>
                </CommandEmpty>
              <CommandGroup>
                {drivers.map((driver) => (
                  <CommandItem
                    key={driver.id}
                    value={driver.name}
                    onSelect={handleSelect}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value.toLowerCase() === driver.name.toLowerCase() ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {driver.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <CreateDriverDialog
        isOpen={isCreateDriverOpen}
        setIsOpen={setIsCreateDriverOpen}
        onSave={handleCreateDriver}
        initialName={driverToCreate}
      />
    </>
  )
}
