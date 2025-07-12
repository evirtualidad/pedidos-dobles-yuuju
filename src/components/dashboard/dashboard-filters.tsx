
"use client";

import * as React from "react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useData } from "@/contexts/data-context";
import type { DashboardFiltersState } from "@/app/page";

interface DashboardFiltersProps {
  filters: DashboardFiltersState;
  onFiltersChange: (filters: DashboardFiltersState) => void;
}

export function DashboardFilters({ filters, onFiltersChange }: DashboardFiltersProps) {
  const { brands, fleets, orderTypes, role } = useData();
  
  const brandNames = brands.map(b => b.name);
  const fleetNames = fleets.map(f => f.name);
  const orderTypeNames = orderTypes.map(ot => ot.name);

  const handleDateChange = (dateRange?: DateRange) => {
    onFiltersChange({ ...filters, dateRange: dateRange || { from: undefined, to: undefined } });
  };

  const handleFilterChange = (filterName: keyof Omit<DashboardFiltersState, 'dateRange'>, value: string) => {
    onFiltersChange({ ...filters, [filterName]: value === 'all' ? '' : value });
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 flex-wrap bg-card border rounded-lg p-4">
      <div className="grid gap-2 w-full sm:w-auto">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-full sm:w-[260px] justify-start text-left font-normal",
                !filters.dateRange.from && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.dateRange.from ? (
                filters.dateRange.to ? (
                  <>
                    {format(filters.dateRange.from, "LLL dd, y")} -{" "}
                    {format(filters.dateRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(filters.dateRange.from, "LLL dd, y")
                )
              ) : (
                <span>Seleccionar rango de fechas</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={filters.dateRange.from}
              selected={filters.dateRange}
              onSelect={handleDateChange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      <Select value={filters.brand || 'all'} onValueChange={value => handleFilterChange('brand', value)}>
        <SelectTrigger className="w-full sm:w-[180px] h-10">
          <SelectValue placeholder="Filtrar por marca" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas las Marcas</SelectItem>
          {brandNames.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
        </SelectContent>
      </Select>

      {role !== 'Fleet Supervisor' && (
        <Select value={filters.fleet || 'all'} onValueChange={value => handleFilterChange('fleet', value)}>
            <SelectTrigger className="w-full sm:w-[180px] h-10">
            <SelectValue placeholder="Filtrar por flota" />
            </SelectTrigger>
            <SelectContent>
            <SelectItem value="all">Todas las Flotas</SelectItem>
            {fleetNames.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
            </SelectContent>
        </Select>
      )}

      <Select value={filters.type || 'all'} onValueChange={value => handleFilterChange('type', value)}>
        <SelectTrigger className="w-full sm:w-[180px] h-10">
          <SelectValue placeholder="Filtrar por tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los Tipos</SelectItem>
          {orderTypeNames.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}
