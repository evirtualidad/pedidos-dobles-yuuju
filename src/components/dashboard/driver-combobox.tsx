
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
import { useData } from "@/contexts/data-context"
import { CreateDriverDialog } from "@/components/admin/create-driver-dialog"
import type { Driver } from "@/lib/types"

interface DriverComboboxProps {
    initialDriverName: string | null;
    onSelect: (driverName: string) => void;
}

export function DriverCombobox({ initialDriverName, onSelect }: DriverComboboxProps) {
  const { drivers, addDriver: addDriverToContext } = useData()
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(initialDriverName || "")
  const [search, setSearch] = React.useState(initialDriverName || "");

  const [isCreateDriverOpen, setIsCreateDriverOpen] = React.useState(false);
  const [newDriverName, setNewDriverName] = React.useState("");

  React.useEffect(() => {
    setValue(initialDriverName || "");
    setSearch(initialDriverName || "");
  }, [initialDriverName]);

  const handleSelect = (currentValue: string) => {
    const driverName = currentValue === value ? "" : currentValue;
    setValue(driverName);
    setSearch(driverName);
    onSelect(driverName);
    setOpen(false);
  }

  const handleCreateDriver = async (driverData: Omit<Driver, 'id'>) => {
    await addDriverToContext(driverData);
    setIsCreateDriverOpen(false);
    handleSelect(driverData.name);
  };

  const openCreateDriverDialog = () => {
    setNewDriverName(search);
    setIsCreateDriverOpen(true);
    setOpen(false); // Close combobox popover
  }
  
  const filteredDrivers = drivers.filter(driver =>
    driver.name.toLowerCase().includes(search.toLowerCase())
  );

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
            {value ? drivers.find((driver) => driver.name === value)?.name : "Seleccione un motorista..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command shouldFilter={false}>
            <CommandInput 
                placeholder="Buscar motorista..."
                value={search}
                onValueChange={setSearch}
            />
             <CommandList>
                <CommandEmpty>
                    <Button variant="ghost" className="w-full" onClick={openCreateDriverDialog}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Crear "{search}"
                    </Button>
                </CommandEmpty>
                <CommandGroup>
                {filteredDrivers.map((driver) => (
                    <CommandItem
                        key={driver.id}
                        value={driver.name}
                        onSelect={handleSelect}
                    >
                    <Check
                        className={cn(
                        "mr-2 h-4 w-4",
                        value === driver.name ? "opacity-100" : "opacity-0"
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
        initialName={newDriverName}
      />
    </>
  )
}
