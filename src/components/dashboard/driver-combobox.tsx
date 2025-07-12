
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
import { Input } from "../ui/input"

interface DriverComboboxProps {
    onSelect: (driver: Driver | null) => void;
    initialDriverName?: string;
}

export function DriverCombobox({ onSelect, initialDriverName }: DriverComboboxProps) {
  const { drivers } = useData()
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [isCreateDriverOpen, setIsCreateDriverOpen] = React.useState(false)

  React.useEffect(() => {
    setValue(initialDriverName || "");
  }, [initialDriverName]);

  const handleSelect = (driver: Driver) => {
    setValue(driver.name);
    onSelect(driver);
    setOpen(false);
  }

  const handleCreateNew = () => {
    setOpen(false);
    setIsCreateDriverOpen(true);
  }
  
  const handleDriverCreated = (newDriver: Driver) => {
    setValue(newDriver.name)
    onSelect(newDriver)
    setIsCreateDriverOpen(false)
  }
  
  const filteredDrivers = React.useMemo(() => {
    if (!value) return drivers;
    return drivers.filter(driver => driver.name.toLowerCase().includes(value.toLowerCase()));
  }, [value, drivers]);

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onClick={() => setOpen(true)}
            placeholder="Buscar o crear motorista..."
            className="w-full justify-between"
            role="combobox"
            aria-expanded={open}
          />
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput 
                value={value}
                onValueChange={setValue}
                placeholder="Buscar motorista..."
                disabled={isCreateDriverOpen}
            />
            <CommandList>
              <CommandEmpty>
                 <div className="p-2">
                  <p className="text-sm text-center text-muted-foreground mb-2">No se encontró. ¿Crear nuevo?</p>
                  <Button 
                    className="w-full" 
                    size="sm" 
                    onMouseDown={(e) => {
                        e.preventDefault();
                        handleCreateNew();
                    }}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Crear: "{value}"
                  </Button>
                </div>
              </CommandEmpty>
              <CommandGroup>
                {filteredDrivers.map((driver) => (
                  <CommandItem
                    key={driver.id}
                    value={driver.name}
                    onSelect={() => handleSelect(driver)}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        handleSelect(driver);
                    }}
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
        initialName={value}
        onDriverCreated={handleDriverCreated}
      />
    </>
  )
}
