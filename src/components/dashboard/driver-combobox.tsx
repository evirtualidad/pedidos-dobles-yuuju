
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
  CommandSeparator,
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
  const [value, setValue] = React.useState("")
  const [typedValue, setTypedValue] = React.useState("")
  const [isCreateDriverOpen, setIsCreateDriverOpen] = React.useState(false)

  React.useEffect(() => {
    if (initialDriverName) {
      const initialDriver = drivers.find(driver => driver.name.toLowerCase() === initialDriverName.toLowerCase());
      if (initialDriver) {
        setValue(initialDriver.name.toLowerCase())
      }
    }
  }, [initialDriverName, drivers])

  const handleSelect = (currentValue: string) => {
    const selectedDriver = drivers.find(driver => driver.name.toLowerCase() === currentValue);
    setValue(currentValue)
    setOpen(false)
    onSelect(selectedDriver || null)
  }
  
  const handleDriverCreated = (newDriver: Driver) => {
    setValue(newDriver.name.toLowerCase());
    setOpen(false);
    onSelect(newDriver);
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
              ? drivers.find((driver) => driver.name.toLowerCase() === value)?.name
              : "Seleccione un motorista..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command>
            <CommandInput 
                placeholder="Buscar motorista..."
                value={typedValue}
                onValueChange={setTypedValue}
            />
            <CommandList>
                <CommandEmpty>
                    <div className="p-2">
                        <p className="text-sm text-center text-muted-foreground mb-2">No se encontró el motorista.</p>
                        <Button className="w-full" size="sm" onClick={() => setIsCreateDriverOpen(true)}>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Crear: "{typedValue}"
                        </Button>
                    </div>
                </CommandEmpty>
                <CommandGroup>
                {drivers.map((driver) => (
                    <CommandItem
                        key={driver.id}
                        value={driver.name}
                        onSelect={(currentValue) => handleSelect(currentValue)}
                    >
                    <Check
                        className={cn(
                        "mr-2 h-4 w-4",
                        value === driver.name.toLowerCase() ? "opacity-100" : "opacity-0"
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
