"use client"

import * as React from "react"
import { Check, UserPlus } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
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
  const [inputValue, setInputValue] = React.useState("")
  const [isCreateDriverOpen, setIsCreateDriverOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState("")

  React.useEffect(() => {
    const initialDriver = drivers.find(d => d.name === initialDriverName)
    if (initialDriver) {
        setInputValue(initialDriver.name)
        setSearchTerm(initialDriver.name)
    } else {
        setInputValue(initialDriverName || "")
        setSearchTerm(initialDriverName || "")
    }
  }, [initialDriverName, drivers]);

  const handleSelect = (driver: Driver) => {
    setInputValue(driver.name)
    setSearchTerm(driver.name)
    onSelect(driver)
    setOpen(false)
  }

  const handleCreateNew = () => {
    setOpen(false);
    setIsCreateDriverOpen(true);
  }
  
  const handleDriverCreated = (newDriver: Driver) => {
    handleSelect(newDriver)
    setIsCreateDriverOpen(false)
  }
  
  const filteredDrivers = React.useMemo(() => {
    if (!searchTerm) return drivers;
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return drivers.filter(driver => driver.name.toLowerCase().includes(lowercasedSearchTerm));
  }, [searchTerm, drivers]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    setInputValue(newSearchTerm);
    if (!open) {
        setOpen(true);
    }
    // Clear selection if user types something new
    if (drivers.find(d => d.name === newSearchTerm) === undefined) {
        onSelect(null);
    }
  }

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Input
            value={inputValue}
            onChange={handleInputChange}
            onClick={() => setOpen(true)}
            placeholder="Buscar o crear motorista..."
            className="w-full justify-between"
            role="combobox"
            aria-expanded={open}
            autoComplete="off"
          />
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command>
            <CommandList>
              {filteredDrivers.length === 0 && searchTerm.length > 0 ? (
                 <CommandEmpty>
                    <div className="p-2">
                      <p className="text-sm text-center text-muted-foreground mb-2">No se encontró.</p>
                      <Button 
                        className="w-full" 
                        size="sm" 
                        onClick={handleCreateNew}
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Crear motorista: "{searchTerm}"
                      </Button>
                    </div>
                </CommandEmpty>
              ) : (
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
                          inputValue === driver.name ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {driver.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <CreateDriverDialog
        isOpen={isCreateDriverOpen}
        setIsOpen={setIsCreateDriverOpen}
        initialName={searchTerm}
        onDriverCreated={handleDriverCreated}
      />
    </>
  )
}
