
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
  const [selectedValue, setSelectedValue] = React.useState(initialDriverName || "")
  const [searchValue, setSearchValue] = React.useState("")
  const [isCreateDriverOpen, setIsCreateDriverOpen] = React.useState(false)

  React.useEffect(() => {
    setSelectedValue(initialDriverName || "")
  }, [initialDriverName])

  const handleSelect = (driverName: string) => {
    const selectedDriver = drivers.find(driver => driver.name === driverName)
    if (selectedDriver) {
      setSelectedValue(selectedDriver.name)
      onSelect(selectedDriver)
    }
    setOpen(false)
  }
  
  const handleDriverCreated = (newDriver: Driver) => {
    setSelectedValue(newDriver.name);
    onSelect(newDriver);
    setIsCreateDriverOpen(false);
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
            {selectedValue || "Seleccione un motorista..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command shouldFilter={false}>
            <CommandInput 
                placeholder="Buscar motorista..."
                value={searchValue}
                onValueChange={setSearchValue}
            />
            <CommandList>
                <CommandEmpty>
                    <div className="p-2">
                        <p className="text-sm text-center text-muted-foreground mb-2">No se encontró el motorista.</p>
                        <Button className="w-full" size="sm" onClick={() => { setOpen(false); setIsCreateDriverOpen(true); }}>
                            <UserPlus className="mr-2 h-4 w-4" />
                            Crear: "{searchValue}"
                        </Button>
                    </div>
                </CommandEmpty>
                <CommandGroup>
                {drivers
                  .filter(driver => driver.name.toLowerCase().includes(searchValue.toLowerCase()))
                  .map((driver) => (
                    <CommandItem
                        key={driver.id}
                        value={driver.name}
                        onSelect={handleSelect}
                    >
                    <Check
                        className={cn(
                        "mr-2 h-4 w-4",
                        selectedValue === driver.name ? "opacity-100" : "opacity-0"
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
        initialName={searchValue}
        onDriverCreated={handleDriverCreated}
      />
    </>
  )
}
