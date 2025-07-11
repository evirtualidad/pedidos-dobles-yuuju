
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, CheckCircle, Hourglass, XCircle } from "lucide-react";
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
    const pendingOrders = orders.filter(o => o.status === 'Pending').length;
    const completedOrders = orders.filter(o => o.status === 'Completed').length;
    const cancelledOrders = orders.filter(o => o.status === 'Cancelled').length;

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                    <Truck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalOrders}</div>
                    <p className="text-xs text-muted-foreground">Total de órdenes filtradas</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Completed</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{completedOrders}</div>
                     <p className="text-xs text-muted-foreground">Entregas completadas</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending</CardTitle>
                    <Hourglass className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{pendingOrders}</div>
                    <p className="text-xs text-muted-foreground">Entregas pendientes</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
                    <XCircle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{cancelledOrders}</div>
                    <p className="text-xs text-muted-foreground">Órdenes canceladas</p>
                </CardContent>
            </Card>
        </>
    )
}
