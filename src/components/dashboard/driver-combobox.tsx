
"use client"

import * as React from "react"
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react"

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
import type { Driver } from "@/lib/types"

interface DriverComboboxProps {
    drivers: Driver[];
    initialDriverName: string;
    onSelectDriver: (driverName: string) => void;
    onCreateDriver: (driverName: string) => void;
}

export function DriverCombobox({ drivers, initialDriverName, onSelectDriver, onCreateDriver }: DriverComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(initialDriverName)

  React.useEffect(() => {
    setValue(initialDriverName)
  }, [initialDriverName])

  return (
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
          <CommandInput placeholder="Buscar motorista..." />
          <CommandList>
            <CommandEmpty>
                <div className="p-2 text-sm text-center">
                    <p>No se encontró el motorista.</p>
                     <Button
                        variant="link"
                        className="p-1 h-auto"
                        onClick={() => {
                            const input = document.querySelector('input[cmdk-input]') as HTMLInputElement;
                            if (input && input.value) {
                                onCreateDriver(input.value)
                            }
                            setOpen(false)
                        }}
                     >
                        <PlusCircle className="mr-2 h-4 w-4"/>
                        Crear nuevo motorista
                    </Button>
                </div>
            </CommandEmpty>
            <CommandGroup>
              {drivers.map((driver) => (
                <CommandItem
                  key={driver.id}
                  value={driver.name}
                  onSelect={(currentValue) => {
                    const newValue = currentValue.toLowerCase() === value.toLowerCase() ? "" : currentValue;
                    setValue(newValue)
                    onSelectDriver(newValue)
                    setOpen(false)
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
  )
}
