

"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { 
    collection, 
    onSnapshot, 
    doc, 
    getDoc, 
    setDoc, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    Timestamp,
    query,
    orderBy
} from "firebase/firestore";
import { 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    signOut,
    type User as FirebaseUser
} from "firebase/auth";

import type { Brand, Fleet, OrderType, UserWithId, Order, AuditLog, Role, Driver } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { db, auth } from "@/lib/firebase";

type DataContextType = {
  user: UserWithId | null;
  role: Role | null;
  login: (email: string, pass: string) => Promise<boolean>;
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
  updateUser: (id: string, user: Omit<UserWithId, 'id'>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;

  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'enteredBy'>) => Promise<void>;
  updateOrder: (id: string, order: Omit<Order, 'id' | 'enteredBy'>) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;

  drivers: Driver[];
  addDriver: (driver: Omit<Driver, 'id'>) => Promise<string | undefined>;

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

// Helper to convert Firestore Timestamps to Dates in fetched data
function mapTimestampToDate<T>(data: T): T {
    if (data && typeof data === 'object') {
        for (const key in data) {
            if (data[key] instanceof Timestamp) {
                (data as any)[key] = (data[key] as Timestamp).toDate();
            }
        }
    }
    return data;
}

export function DataProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { toast } = useToast();
    const [user, setUser] = React.useState<UserWithId | null>(null);
    const [role, setRole] = React.useState<Role | null>(null);
    
    const [brands, setBrands] = React.useState<Brand[]>([]);
    const [fleets, setFleets] = React.useState<Fleet[]>([]);
    const [orderTypes, setOrderTypes] = React.useState<OrderType[]>([]);
    const [users, setUsers] = React.useState<UserWithId[]>([]);
    const [orders, setOrders] = React.useState<Order[]>([]);
    const [auditLogs, setAuditLogs] = React.useState<AuditLog[]>([]);
    const [drivers, setDrivers] = React.useState<Driver[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const userDocRef = doc(db, "users", firebaseUser.uid);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    const userData = { id: userDocSnap.id, ...userDocSnap.data() } as UserWithId;
                    setUser(userData);
                    setRole(userData.role);
                } else {
                    console.log("User profile not found in Firestore, creating one...");
                    // First user to sign in becomes an admin
                    const newUserProfile: Omit<UserWithId, 'id'> = {
                        name: firebaseUser.displayName || firebaseUser.email || 'New User',
                        email: firebaseUser.email!,
                        role: 'Admin',
                    };
                    await setDoc(userDocRef, newUserProfile);
                    setUser({id: firebaseUser.uid, ...newUserProfile});
                    setRole(newUserProfile.role);
                    toast({
                        title: "Bienvenido, Admin",
                        description: "Tu perfil de administrador ha sido creado.",
                    });
                }

                if (pathname === '/login') {
                    router.push('/');
                }
            } else {
                setUser(null);
                setRole(null);
                if (pathname !== '/login') {
                    router.push('/login');
                }
            }
            setLoading(false);
        });
        return () => unsubscribeAuth();
    }, [pathname, router]);

    // Firestore listeners
    React.useEffect(() => {
        if (!user) return; // Don't fetch data if no user
        const unsubscribers = [
            onSnapshot(collection(db, "brands"), (snapshot) => setBrands(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Brand)))),
            onSnapshot(collection(db, "fleets"), (snapshot) => setFleets(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Fleet)))),
            onSnapshot(collection(db, "orderTypes"), (snapshot) => setOrderTypes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as OrderType)))),
            onSnapshot(collection(db, "users"), (snapshot) => setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserWithId)))),
            onSnapshot(query(collection(db, "orders"), orderBy("date", "desc")), (snapshot) => setOrders(snapshot.docs.map(doc => mapTimestampToDate({ id: doc.id, ...doc.data() } as Order)))),
            onSnapshot(query(collection(db, "auditLogs"), orderBy("timestamp", "desc")), (snapshot) => setAuditLogs(snapshot.docs.map(doc => mapTimestampToDate({ id: doc.id, ...doc.data() } as AuditLog)))),
            onSnapshot(collection(db, "drivers"), (snapshot) => setDrivers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Driver)))),
        ];
        return () => unsubscribers.forEach(unsub => unsub());
    }, [user]);

    const login = async (email: string, pass: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, pass);
            return true;
        } catch (error) {
            console.error("Login failed:", error);
            return false;
        }
    }

    const logout = async () => {
        await signOut(auth);
        setUser(null);
        setRole(null);
        router.push('/login');
    }

    const addAuditLog = async (log: Omit<AuditLog, 'id' | 'timestamp'>) => {
        const newLog = {
            ...log,
            timestamp: new Date(),
        };
        await addDoc(collection(db, 'auditLogs'), newLog);
    }
    
    // Generic CRUD Functions for Firestore
    const addItem = async <T>(collectionName: string, item: T) => {
        const docRef = await addDoc(collection(db, collectionName), item);
        return docRef;
    };
    
    const updateItem = async <T>(collectionName: string, id: string, item: T) => {
        await updateDoc(doc(db, collectionName, id), item as any);
    };

    const deleteItem = async (collectionName: string, id: string) => {
        await deleteDoc(doc(db, collectionName, id));
    };

    // Brand Management
    const addBrand = (name: string) => addItem('brands', { name });
    const updateBrand = (id: string, name: string) => updateItem('brands', id, { name });
    const deleteBrand = (id: string) => deleteItem('brands', id);

    // Fleet Management
    const addFleet = (name: string) => addItem('fleets', { name });
    const updateFleet = (id: string, name: string) => updateItem('fleets', id, { name });
    const deleteFleet = (id: string) => deleteItem('fleets', id);

    // Order Type Management
    const addOrderType = (name: string) => addItem('orderTypes', { name });
    const updateOrderType = (id: string, name: string) => updateItem('orderTypes', id, { name });
    const deleteOrderType = (id: string) => deleteItem('orderTypes', id);
    
    // User Management
    const updateUser = (id: string, userData: Omit<UserWithId, 'id'>) => updateItem('users', id, userData);
    const deleteUser = (id: string) => deleteItem('users', id);

    // Order Management
    const addOrder = (orderData: Omit<Order, 'id' | 'enteredBy'>) => {
        if (!user) return Promise.reject("No user logged in");
        const newOrder = { ...orderData, enteredBy: user.name };
        return addItem('orders', newOrder).then(() => {});
    }
    const updateOrder = (id: string, orderData: Omit<Order, 'id' | 'enteredBy'>) => {
        if (!user) return Promise.reject("No user logged in");
        const orderToUpdate = orders.find(o => o.id === id);
        if (!orderToUpdate) return Promise.reject("Order not found");
        const updatedOrder = { ...orderData, enteredBy: orderToUpdate.enteredBy };
        return updateItem('orders', id, updatedOrder);
    }
    const deleteOrder = (id: string) => deleteItem('orders', id);

    // Driver Management
    const addDriver = async (driverData: Omit<Driver, 'id'>) => {
        try {
            const docRef = await addItem('drivers', driverData);
            return docRef.id;
        } catch (e) {
            console.error("Error adding driver: ", e);
        }
    };


    if (loading) {
        return <LoadingScreen />;
    }

    if (!user && pathname !== '/login') {
        return <LoadingScreen />;
    }

    const contextValue: DataContextType = { 
        user, role, login, logout,
        brands, addBrand, updateBrand, deleteBrand,
        fleets, addFleet, updateFleet, deleteFleet,
        orderTypes, addOrderType, updateOrderType, deleteOrderType,
        users, updateUser, deleteUser,
        orders, addOrder, updateOrder, deleteOrder,
        drivers, addDriver,
        auditLogs, addAuditLog,
        toast,
        loading
    };

    return (
        <DataContext.Provider value={contextValue}>
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
