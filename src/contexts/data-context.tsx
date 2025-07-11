
"use client";

import * as React from "react";
import type { Brand, Fleet, OrderType, UserWithId, Order, AuditLog } from "@/lib/types";
import { 
    brands as mockBrands, 
    fleets as mockFleets,
    orderTypes as mockOrderTypes,
    mockAuditLogs,
    mockOrders
} from "@/lib/data";

const initialBrands: Brand[] = mockBrands.map((name, index) => ({ id: (index + 1).toString(), name }));
const initialFleets: Fleet[] = mockFleets.map((name, index) => ({ id: (index + 1).toString(), name }));
const initialOrderTypes: OrderType[] = mockOrderTypes.map((name, index) => ({ id: (index + 1).toString(), name }));
const initialUsers: UserWithId[] = [
    { id: '1', name: 'Admin User', role: 'Admin' },
    { id: '2', name: 'Supervisor Sam', role: 'Fleet Supervisor', fleet: 'RAPI RAPI' },
    { id: '3', name: 'Data Clerk', role: 'Data Entry' }
];


type DataContextType = {
  brands: Brand[];
  addBrand: (name: string) => void;
  updateBrand: (id: string, name: string) => void;
  deleteBrand: (id: string) => void;
  
  fleets: Fleet[];
  addFleet: (name: string) => void;
  updateFleet: (id: string, name: string) => void;
  deleteFleet: (id: string) => void;
  
  orderTypes: OrderType[];
  addOrderType: (name: string) => void;
  updateOrderType: (id: string, name: string) => void;
  deleteOrderType: (id: string) => void;

  users: UserWithId[];
  addUser: (user: Omit<UserWithId, 'id'>) => void;
  updateUser: (id: string, user: Omit<UserWithId, 'id'>) => void;
  deleteUser: (id: string) => void;

  orders: Order[];
  addOrder: (order: Omit<Order, 'id'>) => void;
  updateOrder: (id: string, order: Omit<Order, 'id'>) => void;
  deleteOrder: (id: string) => void;

  auditLogs: AuditLog[];
  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;
};

const DataContext = React.createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
    const [brands, setBrands] = React.useState<Brand[]>(initialBrands);
    const [fleets, setFleets] = React.useState<Fleet[]>(initialFleets);
    const [orderTypes, setOrderTypes] = React.useState<OrderType[]>(initialOrderTypes);
    const [users, setUsers] = React.useState<UserWithId[]>(initialUsers);
    const [orders, setOrders] = React.useState<Order[]>(mockOrders);
    const [auditLogs, setAuditLogs] = React.useState<AuditLog[]>(mockAuditLogs);

    // Brand Management
    const addBrand = (name: string) => {
        const newBrand: Brand = { id: (brands.length + 1).toString(), name };
        setBrands(prev => [...prev, newBrand]);
    };
    const updateBrand = (id: string, name: string) => {
        setBrands(prev => prev.map(b => b.id === id ? { ...b, name } : b));
    };
    const deleteBrand = (id: string) => {
        setBrands(prev => prev.filter(b => b.id !== id));
    };

    // Fleet Management
    const addFleet = (name: string) => {
        const newFleet: Fleet = { id: (fleets.length + 1).toString(), name };
        setFleets(prev => [...prev, newFleet]);
    };
    const updateFleet = (id: string, name: string) => {
        setFleets(prev => prev.map(f => f.id === id ? { ...f, name } : f));
    };
    const deleteFleet = (id: string) => {
        setFleets(prev => prev.filter(f => f.id !== id));
    };

    // Order Type Management
    const addOrderType = (name: string) => {
        const newOrderType: OrderType = { id: (orderTypes.length + 1).toString(), name };
        setOrderTypes(prev => [...prev, newOrderType]);
    };
    const updateOrderType = (id: string, name: string) => {
        setOrderTypes(prev => prev.map(ot => ot.id === id ? { ...ot, name } : ot));
    };
    const deleteOrderType = (id: string) => {
        setOrderTypes(prev => prev.filter(ot => ot.id !== id));
    };

    // User Management
    const addUser = (user: Omit<UserWithId, 'id'>) => {
        const newUser: UserWithId = { id: (users.length + 1).toString(), ...user };
        setUsers(prev => [...prev, newUser]);
    };
    const updateUser = (id: string, user: Omit<UserWithId, 'id'>) => {
        setUsers(prev => prev.map(u => u.id === id ? { id, ...user } : u));
    };
    const deleteUser = (id: string) => {
        setUsers(prev => prev.filter(u => u.id !== id));
    };

    // Order Management
    const addOrder = (order: Omit<Order, 'id'>) => {
        const newOrder: Order = { id: (Math.random() * 10000).toString(), ...order };
        setOrders(prev => [newOrder, ...prev]);
        return newOrder;
    };
    const updateOrder = (id: string, orderData: Omit<Order, 'id'>) => {
        setOrders(prev => prev.map(o => o.id === id ? { id, ...orderData } : o));
    };
    const deleteOrder = (id: string) => {
        setOrders(prev => prev.filter(o => o.id !== id));
    };

    // Audit Log Management
    const addAuditLog = (log: Omit<AuditLog, 'id' | 'timestamp'>) => {
        const newLog: AuditLog = { 
            id: (auditLogs.length + 1).toString(), 
            ...log,
            timestamp: new Date() 
        };
        setAuditLogs(prev => [newLog, ...prev]);
    }


    return (
        <DataContext.Provider value={{ 
            brands, addBrand, updateBrand, deleteBrand,
            fleets, addFleet, updateFleet, deleteFleet,
            orderTypes, addOrderType, updateOrderType, deleteOrderType,
            users, addUser, updateUser, deleteUser,
            orders, addOrder, updateOrder, deleteOrder,
            auditLogs, addAuditLog
        }}>
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    const context = React.useContext(DataContext);
    if (context === undefined) {
        throw new Error("useData must be used within a DataProvider");
    }
    return context;
}
