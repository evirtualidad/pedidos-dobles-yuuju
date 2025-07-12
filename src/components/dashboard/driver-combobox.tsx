
"use client"

import * as React from "react"
import { Check, ChevronsUpDown, UserPlus } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useData } from "@/contexts/data-context"
import type { Driver } from "@/lib/types"
import { CreateDriverDialog } from "./create-driver-dialog"

interface DriverComboboxProps {
    onSelect: (driver: Driver | null) => void;
    initialDriverName?: string;
}

export function DriverCombobox({ onSelect, initialDriverName }: DriverComboboxProps) {
  const { drivers } = useData()
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(initialDriverName || "")
  const [typedValue, setTypedValue] = React.useState("")
  const [isCreateDriverOpen, setIsCreateDriverOpen] = React.useState(false)
  
  // Find the selected driver object based on the name
  const selectedDriver = React.useMemo(() => 
    drivers.find(driver => driver.name.toLowerCase() === value.toLowerCase()),
    [value, drivers]
  );
  
  // Effect to update the local state if the initial name changes (e.g., when editing a different order)
  React.useEffect(() => {
    setValue(initialDriverName || "");
  }, [initialDriverName]);
  
  const handleDriverCreated = (newDriver: Driver) => {
    setValue(newDriver.name)
    onSelect(newDriver)
    setIsCreateDriverOpen(false)
  }

  const handleCreateNew = () => {
    setOpen(false)
    // The value in the search input is what we want to pass
    const commandInput = document.querySelector('[cmdk-input]');
    if (commandInput instanceof HTMLInputElement) {
        setTypedValue(commandInput.value);
    }
    setIsCreateDriverOpen(true)
  }

  const handleSelect = (currentValue: string) => {
    const driverName = currentValue.toLowerCase() === value.toLowerCase() ? "" : currentValue
    setValue(driverName)
    
    const driverObject = drivers.find(d => d.name.toLowerCase() === driverName.toLowerCase())
    onSelect(driverObject || null)

    setOpen(false)
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
              ? selectedDriver?.name
              : "Seleccionar motorista..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command>
            <CommandInput placeholder="Buscar motorista..." />
            <CommandList>
              <CommandEmpty>
                 <div className="p-2">
                  <p className="text-sm text-center text-muted-foreground mb-2">No se encontró el motorista.</p>
                  <Button className="w-full" size="sm" onClick={handleCreateNew}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Crear nuevo motorista
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
        initialName={typedValue}
        onDriverCreated={handleDriverCreated}
      />
    </>
  )
}
