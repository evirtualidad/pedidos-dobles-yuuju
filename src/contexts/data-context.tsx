
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { Brand, Fleet, OrderType, User, UserWithId, Order, AuditLog, FirebaseOrder, FirebaseAuditLog, Role } from "@/lib/types";
import { db, auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { 
    collection, 
    onSnapshot, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc,
    query,
    where,
    orderBy,
    Timestamp,
    getDocs
} from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";

type DataContextType = {
  user: User | null;
  role: Role | null;
  
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
  addOrder: (order: Omit<Order, 'id'>) => Promise<void>;
  updateOrder: (id: string, order: Omit<Order, 'id'>) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;

  auditLogs: AuditLog[];
  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => Promise<void>;

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
    const [user, setUser] = React.useState<User | null>(null);
    const [role, setRole] = React.useState<Role | null>(null);
    
    const [brands, setBrands] = React.useState<Brand[]>([]);
    const [fleets, setFleets] = React.useState<Fleet[]>([]);
    const [orderTypes, setOrderTypes] = React.useState<OrderType[]>([]);
    const [users, setUsers] = React.useState<UserWithId[]>([]);
    const [orders, setOrders] = React.useState<Order[]>([]);
    const [auditLogs, setAuditLogs] = React.useState<AuditLog[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // User is signed in, get their user profile from Firestore
                const usersRef = collection(db, "users");
                const q = query(usersRef, where("name", "==", firebaseUser.email));
                const querySnapshot = await getDocs(q);
                
                if (!querySnapshot.empty) {
                    const userDoc = querySnapshot.docs[0];
                    const userData = { id: userDoc.id, ...userDoc.data() } as UserWithId;
                    setUser(userData);
                    setRole(userData.role);
                } else {
                    // Handle case where user exists in Auth but not in Firestore users collection
                    console.error("User profile not found in Firestore.");
                    auth.signOut();
                }
            } else {
                // User is signed out
                setUser(null);
                setRole(null);
                router.push('/login');
            }
            setLoading(false);
        });
        return () => unsubscribeAuth();
    }, [router]);

    React.useEffect(() => {
        if (!user) return; // Don't fetch data if no user is logged in
        
        const collections = {
            brands: setBrands,
            fleets: setFleets,
            orderTypes: setOrderTypes,
            users: setUsers,
        };

        const unsubscribes = Object.entries(collections).map(([collectionName, setter]) => {
            const q = query(collection(db, collectionName), orderBy("name"));
            return onSnapshot(q, (querySnapshot) => {
                const items = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as any));
                setter(items);
            });
        });
      
        const ordersQuery = query(collection(db, "orders"), orderBy("date", "desc"));
        const unsubscribeOrders = onSnapshot(ordersQuery, (querySnapshot) => {
            const fetchedOrders = querySnapshot.docs.map(doc => {
                const data = doc.data() as FirebaseOrder;
                return {
                    id: doc.id,
                    ...data,
                    date: data.date.toDate(),
                } as Order;
            });
            setOrders(fetchedOrders);
        });

        const auditLogsQuery = query(collection(db, "auditLogs"), orderBy("timestamp", "desc"));
        const unsubscribeAuditLogs = onSnapshot(auditLogsQuery, (querySnapshot) => {
            const fetchedLogs = querySnapshot.docs.map(doc => {
                const data = doc.data() as FirebaseAuditLog;
                return {
                    id: doc.id,
                    ...data,
                    timestamp: data.timestamp.toDate(),
                } as AuditLog;
            });
            setAuditLogs(fetchedLogs);
        });
      
        return () => {
            unsubscribes.forEach(unsub => unsub());
            unsubscribeOrders();
            unsubscribeAuditLogs();
        };
    }, [user]);

    // Generic CRUD functions
    const addItem = async <T,>(collectionName: string, item: T) => {
        await addDoc(collection(db, collectionName), item as any);
    };

    const updateItem = async (collectionName: string, id: string, item: any) => {
        const docRef = doc(db, collectionName, id);
        await updateDoc(docRef, item);
    };

    const deleteItem = async (collectionName: string, id: string) => {
        await deleteDoc(doc(db, collectionName, id));
    };

    // Brand Management
    const addBrand = (name: string) => addItem("brands", { name });
    const updateBrand = (id: string, name: string) => updateItem("brands", id, { name });
    const deleteBrand = (id: string) => deleteItem("brands", id);

    // Fleet Management
    const addFleet = (name: string) => addItem("fleets", { name });
    const updateFleet = (id: string, name: string) => updateItem("fleets", id, { name });
    const deleteFleet = (id: string) => deleteItem("fleets", id);

    // Order Type Management
    const addOrderType = (name: string) => addItem("orderTypes", { name });
    const updateOrderType = (id: string, name: string) => updateItem("orderTypes", id, { name });
    const deleteOrderType = (id: string) => deleteItem("orderTypes", id);

    // User Management
    const addUser = (user: Omit<UserWithId, 'id'>) => addItem("users", user);
    const updateUser = (id: string, user: Omit<UserWithId, 'id'>) => updateItem("users", id, user);
    const deleteUser = (id: string) => deleteItem("users", id);

    // Order Management
    const addOrder = (order: Omit<Order, 'id'>) => addItem("orders", { ...order, date: Timestamp.fromDate(order.date) });
    const updateOrder = (id: string, orderData: Omit<Order, 'id'>) => updateItem("orders", id, { ...orderData, date: Timestamp.fromDate(orderData.date) });
    const deleteOrder = (id: string) => deleteItem("orders", id);
    
    // Audit Log Management
    const addAuditLog = (log: Omit<AuditLog, 'id' | 'timestamp'>) => addItem("auditLogs", { ...log, timestamp: Timestamp.now() });

    if (loading) {
        return <LoadingScreen />;
    }

    if (!user) {
        // This case is primarily for when the user is logged out, the redirect is handled in useEffect
        return <LoadingScreen />;
    }


    return (
        <DataContext.Provider value={{ 
            user, role,
            brands, addBrand, updateBrand, deleteBrand,
            fleets, addFleet, updateFleet, deleteFleet,
            orderTypes, addOrderType, updateOrderType, deleteOrderType,
            users, addUser, updateUser, deleteUser,
            orders, addOrder, updateOrder, deleteOrder,
            auditLogs, addAuditLog,
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
