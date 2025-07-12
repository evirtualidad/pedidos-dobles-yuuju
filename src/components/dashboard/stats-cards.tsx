
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Users, Award, Tag } from "lucide-react";
import { useRole } from "@/contexts/role-context";
import { Order } from "@/lib/types";
import { cn } from "@/lib/utils";

interface StatsCardsProps {
    orders: Order[];
}

const cardClasses = "border-t-4 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg hover:border-primary";

export function StatsCards({ orders }: StatsCardsProps) {
    const { role } = useRole();

    const totalOrders = orders.length;

    const uniqueDrivers = new Set(orders.map(order => order.driver));
    const totalDrivers = uniqueDrivers.size;

    const driverCounts = orders.reduce<Record<string, number>>((acc, order) => {
        acc[order.driver] = (acc[order.driver] || 0) + 1;
        return acc;
    }, {});

    let topDriver = { name: 'N/A', count: 0 };
    if (Object.keys(driverCounts).length > 0) {
        const topDriverName = Object.keys(driverCounts).reduce((a, b) => driverCounts[a] > driverCounts[b] ? a : b);
        topDriver = { name: topDriverName, count: driverCounts[topDriverName] };
    }
    
    const brandCounts = orders.reduce<Record<string, number>>((acc, order) => {
        acc[order.brand] = (acc[order.brand] || 0) + 1;
        return acc;
    }, {});

    let topBrand = { name: 'N/A', count: 0 };
    if (Object.keys(brandCounts).length > 0) {
        const topBrandName = Object.keys(brandCounts).reduce((a, b) => brandCounts[a] > brandCounts[b] ? a : b);
        topBrand = { name: topBrandName, count: brandCounts[topBrandName] };
    }


    return (
        <>
            <Card className={cn(cardClasses, "border-t-chart-1")}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Órdenes</CardTitle>
                    <Truck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalOrders}</div>
                    <p className="text-xs text-muted-foreground">Total de órdenes filtradas</p>
                </CardContent>
            </Card>
            <Card className={cn(cardClasses, "border-t-chart-2")}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Motoristas Activos</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalDrivers}</div>
                    <p className="text-xs text-muted-foreground">Motoristas únicos en el período</p>
                </CardContent>
            </Card>
            <Card className={cn(cardClasses, "border-t-chart-3")}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Top Motorista</CardTitle>
                    <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold truncate">{topDriver.name}</div>
                    <p className="text-xs text-muted-foreground">{topDriver.count} órdenes completadas</p>
                </CardContent>
            </Card>
            <Card className={cn(cardClasses, "border-t-chart-4")}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Top Marca</CardTitle>
                    <Tag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{topBrand.name}</div>
                    <p className="text-xs text-muted-foreground">{topBrand.count} órdenes registradas</p>
                </CardContent>
            </Card>
        </>
    )
}
