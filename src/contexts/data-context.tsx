
"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Brand, Fleet, OrderType, UserWithId, Order, AuditLog, Role } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { MOCK_DATA } from "@/lib/mock-data";

type DataContextType = {
  user: UserWithId | null;
  role: Role | null;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  
  brands: Brand[];
  addBrand: (name: string) => Promise<void>;
  updateBrand: (id: string, name: string) => Promise<void>;
  deleteBrand: (id: string) => Promise<void>;
  
  fleets: Fleet[];
  addFleet: (name: string) => Promise<void>;
  updateFleet: (id: string, name: string) => Promise<void>;
  deleteFleet: (id: string) => Promise<void>;
  
  orderTypes: OrderType[];
  addOrderType: (name: string) => Promise<void>;
  updateOrderType: (id: string, name: string) => Promise<void>;
  deleteOrderType: (id: string) => Promise<void>;

  users: UserWithId[];
  addUser: (user: Omit<UserWithId, 'id'>) => Promise<void>;
  updateUser: (id: string, user: Omit<UserWithId, 'id'>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;

  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'enteredBy'>) => Promise<void>;
  updateOrder: (id: string, order: Omit<Order, 'id' | 'enteredBy'>) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;

  auditLogs: AuditLog[];
  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => Promise<void>;
  
  toast: ({ ...props }: any) => void;

  loading: boolean;
};

const DataContext = React.createContext<DataContextType | undefined>(undefined);

function LoadingScreen() {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </div>
            </div>
        </div>
    );
}

export function DataProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { toast } = useToast();
    const [user, setUser] = React.useState<UserWithId | null>(null);
    const [role, setRole] = React.useState<Role | null>(null);
    
    const [brands, setBrands] = React.useState<Brand[]>(MOCK_DATA.brands);
    const [fleets, setFleets] = React.useState<Fleet[]>(MOCK_DATA.fleets);
    const [orderTypes, setOrderTypes] = React.useState<OrderType[]>(MOCK_DATA.orderTypes);
    const [users, setUsers] = React.useState<UserWithId[]>(MOCK_DATA.users);
    const [orders, setOrders] = React.useState<Order[]>(MOCK_DATA.orders);
    const [auditLogs, setAuditLogs] = React.useState<AuditLog[]>(MOCK_DATA.auditLogs);
    const [loading, setLoading] = React.useState(true);

    const login = (email: string, pass: string) => {
      const foundUser = users.find(u => u.email === email);
      if(foundUser) {
        // In a real app, you'd check the password
        setUser(foundUser);
        setRole(foundUser.role);
        router.push('/');
        return true;
      }
      return false;
    }

    const logout = () => {
      setUser(null);
      setRole(null);
      router.push('/login');
    }

    React.useEffect(() => {
        const sessionUser = sessionStorage.getItem('fleet-user');
        if (sessionUser) {
            const parsedUser = JSON.parse(sessionUser);
            setUser(parsedUser);
            setRole(parsedUser.role);
        }
        setLoading(false);
    }, []);

    React.useEffect(() => {
        if (loading) return;

        if (!user && pathname !== '/login') {
            router.push('/login');
        } else if (user && pathname === '/login') {
            router.push('/');
        }
        
        if (user) {
            sessionStorage.setItem('fleet-user', JSON.stringify(user));
        } else {
            sessionStorage.removeItem('fleet-user');
        }

    }, [user, pathname, router, loading]);

    const addAuditLog = async (log: Omit<AuditLog, 'id' | 'timestamp'>) => {
        const newLog: AuditLog = {
            ...log,
            id: `log-${Date.now()}`,
            timestamp: new Date(),
        };
        setAuditLogs(prev => [newLog, ...prev]);
    }

    // Generic CRUD functions
    const addItem = async <T extends {id: string}>(setter: React.Dispatch<React.SetStateAction<T[]>>, item: Omit<T, 'id'>) => {
        const newItem = { ...item, id: `${Date.now()}` } as T;
        setter(prev => [newItem, ...prev]);
        return Promise.resolve();
    };

    const updateItem = async <T extends {id: string}>(setter: React.Dispatch<React.SetStateAction<T[]>>, id: string, item: Omit<T, 'id'>) => {
        setter(prev => prev.map(i => i.id === id ? { ...item, id } as T : i));
        return Promise.resolve();
    };

    const deleteItem = async <T extends {id: string}>(setter: React.Dispatch<React.SetStateAction<T[]>>, id: string) => {
        setter(prev => prev.filter(i => i.id !== id));
        return Promise.resolve();
    };

    // Brand Management
    const addBrand = (name: string) => addItem(setBrands, { name });
    const updateBrand = (id: string, name: string) => updateItem(setBrands, id, { name });
    const deleteBrand = (id: string) => deleteItem(setBrands, id);

    // Fleet Management
    const addFleet = (name: string) => addItem(setFleets, { name });
    const updateFleet = (id: string, name: string) => updateItem(setFleets, id, { name });
    const deleteFleet = (id: string) => deleteItem(setFleets, id);

    // Order Type Management
    const addOrderType = (name: string) => addItem(setOrderTypes, { name });
    const updateOrderType = (id: string, name: string) => updateItem(setOrderTypes, id, { name });
    const deleteOrderType = (id: string) => deleteItem(setOrderTypes, id);

    // User Management
    const addUser = (user: Omit<UserWithId, 'id'>) => addItem(setUsers, user);
    const updateUser = (id: string, user: Omit<UserWithId, 'id'>) => updateItem(setUsers, id, user);
    const deleteUser = (id: string) => deleteItem(setUsers, id);

    // Order Management
    const addOrder = (order: Omit<Order, 'id' | 'enteredBy'>) => {
      if (!user) return Promise.reject("No user logged in");
      const newOrderWithUser = { ...order, enteredBy: user.name };
      return addItem(setOrders, newOrderWithUser as Omit<Order, 'id'>);
    }
    const updateOrder = (id: string, orderData: Omit<Order, 'id' | 'enteredBy'>) => {
        if (!user) return Promise.reject("No user logged in");
        const orderToUpdate = orders.find(o => o.id === id);
        if (!orderToUpdate) return Promise.reject("Order not found");
        const updatedOrderWithUser = { ...orderData, enteredBy: orderToUpdate.enteredBy };
        return updateItem(setOrders, id, updatedOrderWithUser as Omit<Order, 'id'>);
    }
    const deleteOrder = (id: string) => deleteItem(setOrders, id);

    if (loading) {
        return <LoadingScreen />;
    }

    if (!user && pathname !== '/login') {
        return <LoadingScreen />;
    }

    if (!user && pathname === '/login') {
        return (
            <DataContext.Provider value={{ login } as any}>
                {children}
            </DataContext.Provider>
        );
    }
    
    if (user && pathname === '/login') {
        return <LoadingScreen />;
    }

    return (
        <DataContext.Provider value={{ 
            user, role, login, logout,
            brands, addBrand, updateBrand, deleteBrand,
            fleets, addFleet, updateFleet, deleteFleet,
            orderTypes, addOrderType, updateOrderType, deleteOrderType,
            users, addUser, updateUser, deleteUser,
            orders, addOrder, updateOrder, deleteOrder,
            auditLogs, addAuditLog,
            toast,
            loading
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
