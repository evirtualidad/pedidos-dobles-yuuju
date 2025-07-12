
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
import { Driver } from "@/lib/types"

interface DriverComboboxProps {
    drivers: Driver[];
    selectedDriverName: string;
    onSelectDriver: (driverName: string) => void;
    onCreateDriver: (driverName: string) => void;
}

export function DriverCombobox({ drivers, selectedDriverName, onSelectDriver, onCreateDriver }: DriverComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState("")

  const handleSelect = (driverName: string) => {
    onSelectDriver(driverName)
    setOpen(false)
    setSearchValue("")
  }

  const handleCreate = () => {
    onCreateDriver(searchValue);
    setOpen(false);
    setSearchValue("");
  }
  
  const filteredDrivers = drivers.filter(driver =>
    driver.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedDriverName
            ? drivers.find((driver) => driver.name === selectedDriverName)?.name
            : "Seleccione un motorista..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput 
            placeholder="Buscar motorista..."
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            <CommandEmpty>
                <div className="p-2 text-sm text-center">
                    No se encontró el motorista.
                     <Button
                        variant="link"
                        className="p-1 h-auto"
                        onClick={handleCreate}
                     >
                        <UserPlus className="mr-2 h-4 w-4"/>
                        Crear "{searchValue}"
                    </Button>
                </div>
            </CommandEmpty>
            <CommandGroup>
              {drivers.map((driver) => (
                <CommandItem
                  key={driver.id}
                  value={driver.name}
                  onSelect={(currentValue) => {
                    handleSelect(currentValue === selectedDriverName ? "" : currentValue)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedDriverName === driver.name ? "opacity-100" : "opacity-0"
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
  )
}
