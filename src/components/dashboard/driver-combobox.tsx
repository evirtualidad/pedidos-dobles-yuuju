
"use client"

import * as React from "react"
import { Check, UserPlus } from "lucide-react"

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
  PopoverAnchor,
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
  const [searchValue, setSearchValue] = React.useState("")
  const [isCreateDriverOpen, setIsCreateDriverOpen] = React.useState(false)
  const [typedValue, setTypedValue] = React.useState("")

  React.useEffect(() => {
    setSearchValue(initialDriverName || "");
  }, [initialDriverName]);

  const handleSelect = (driver: Driver) => {
    setSearchValue(driver.name)
    onSelect(driver)
    setOpen(false)
  }
  
  const handleDriverCreated = (newDriver: Driver) => {
    setSearchValue(newDriver.name);
    onSelect(newDriver);
    setIsCreateDriverOpen(false);
  }

  const handleCreateNew = () => {
    setOpen(false)
    setTypedValue(searchValue) 
    setIsCreateDriverOpen(true)
  }

  const filteredDrivers = React.useMemo(() => {
    if (!searchValue) return drivers;
    return drivers.filter(driver => 
      driver.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue, drivers]);

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverAnchor asChild>
          <Input
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setOpen(true)}
            placeholder="Buscar o crear motorista..."
            className="w-full"
          />
        </PopoverAnchor>
        <PopoverContent 
          className="w-[--radix-popover-trigger-width] p-0" 
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <Command>
            {/* We don't need CommandInput here as the search is driven by the external Input */}
            <CommandList>
              <CommandGroup>
                {filteredDrivers.map((driver) => (
                  <CommandItem
                    key={driver.id}
                    value={driver.name}
                    onSelect={() => handleSelect(driver)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        searchValue.toLowerCase() === driver.name.toLowerCase() ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {driver.name}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandEmpty>
                <div className="p-2">
                  <p className="text-sm text-center text-muted-foreground mb-2">No se encontró el motorista.</p>
                  <Button className="w-full" size="sm" onClick={handleCreateNew}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Crear "{searchValue}"
                  </Button>
                </div>
              </CommandEmpty>
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
