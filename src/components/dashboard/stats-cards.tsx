
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck } from "lucide-react";
import { useRole } from "@/contexts/role-context";
import { Order } from "@/lib/types";

interface StatsCardsProps {
    orders: Order[];
}

export function StatsCards({ orders }: StatsCardsProps) {
    const { role } = useRole();

    if (role === 'Data Entry') {
        return null;
    }

    const totalOrders = orders.length;

    return (
        <>
            <Card className="col-span-1 lg:col-span-4">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                    <Truck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalOrders}</div>
                    <p className="text-xs text-muted-foreground">Total de órdenes filtradas</p>
                </CardContent>
            </Card>
        </>
    )
}
