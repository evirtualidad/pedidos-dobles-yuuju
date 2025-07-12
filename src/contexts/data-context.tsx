
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
    orderBy,
    writeBatch,
    getDocs
} from "firebase/firestore";
import { 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    signOut,
    createUserWithEmailAndPassword,
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
  createUser: (email: string, pass: string, role: Role, name: string, fleet?: string) => Promise<FirebaseUser | null>;
  
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
  updateOrderTypesOrder: (reorderedTypes: OrderType[]) => Promise<void>;

  users: UserWithId[];
  updateUser: (id: string, user: Omit<UserWithId, 'id'>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;

  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'enteredBy'>, newDriver?: Omit<Driver, 'id'>) => Promise<void>;
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
    const [initialAuthCheck, setInitialAuthCheck] = React.useState(false);
    
    const migrationExecutedRef = React.useRef(false);

    // One-time migration function for existing order types
    const migrateOrderTypes = async () => {
        if (migrationExecutedRef.current) return;
        migrationExecutedRef.current = true;
        
        console.log("Checking for order types migration...");
        const orderTypesCollection = collection(db, "orderTypes");
        const snapshot = await getDocs(orderTypesCollection);
        const typesToMigrate = snapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() } as OrderType))
            .filter(type => type.position === undefined);

        if (typesToMigrate.length > 0) {
            console.log(`Migrating ${typesToMigrate.length} order types...`);
            const batch = writeBatch(db);
            typesToMigrate.forEach((type, index) => {
                const docRef = doc(db, 'orderTypes', type.id);
                batch.update(docRef, { position: index });
            });
            await batch.commit();
            console.log("Migration complete.");
        } else {
            console.log("No order types to migrate.");
        }
    };


    React.useEffect(() => {
        migrateOrderTypes();

        const qOrderTypes = query(collection(db, "orderTypes"), orderBy("position"));
        
        const unsubscribers = [
            onSnapshot(collection(db, "brands"), (snapshot) => setBrands(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Brand)))),
            onSnapshot(collection(db, "fleets"), (snapshot) => setFleets(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Fleet)))),
            onSnapshot(qOrderTypes, (snapshot) => {
                const types = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as OrderType));
                setOrderTypes(types);
            }),
            onSnapshot(collection(db, "users"), (snapshot) => {
                setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserWithId)))
                if (!initialAuthCheck) {
                    setInitialAuthCheck(true);
                }
            }),
            onSnapshot(query(collection(db, "orders"), orderBy("date", "desc")), (snapshot) => setOrders(snapshot.docs.map(doc => mapTimestampToDate({ id: doc.id, ...doc.data() } as Order)))),
            onSnapshot(query(collection(db, "auditLogs"), orderBy("timestamp", "desc")), (snapshot) => setAuditLogs(snapshot.docs.map(doc => mapTimestampToDate({ id: doc.id, ...doc.data() } as AuditLog)))),
            onSnapshot(collection(db, "drivers"), (snapshot) => setDrivers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Driver)))),
        ];

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
                    const newUserProfile: Omit<UserWithId, 'id'> = {
                        name: firebaseUser.displayName || firebaseUser.email || 'New User',
                        email: firebaseUser.email!,
                        role: 'Admin',
                    };
                    await setDoc(userDocRef, newUserProfile);
                    setUser({id: firebaseUser.uid, ...newUserProfile});
                    setRole(newUserProfile.role);
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
             if (initialAuthCheck) {
                setLoading(false);
            }
        });

        return () => {
            unsubscribers.forEach(unsub => unsub());
            unsubscribeAuth();
        };
    }, [pathname, router, initialAuthCheck]);


     React.useEffect(() => {
        if (!loading && !user && pathname !== '/login') {
            router.push('/login');
        }
    }, [loading, user, pathname, router]);

    const login = async (email: string, pass: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, pass);
            return true;
        } catch (error) {
            return false;
        }
    }

    const logout = async () => {
        await signOut(auth);
        setUser(null);
        setRole(null);
        router.push('/login');
    }

    const createUser = async (email: string, pass: string, role: Role, name: string, fleet?: string): Promise<FirebaseUser | null> => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
            const firebaseUser = userCredential.user;

            const userProfile: Omit<UserWithId, 'id'> = {
                name,
                email,
                role,
            };
            if(role === 'Fleet Supervisor' && fleet) {
                userProfile.fleet = fleet;
            }
            await setDoc(doc(db, "users", firebaseUser.uid), userProfile);
            return firebaseUser;
        } catch (error) {
            console.error("Create user failed:", error);
            throw error;
        }
    }

    const addAuditLog = async (log: Omit<AuditLog, 'id' | 'timestamp'>) => {
        const newLog = {
            ...log,
            timestamp: new Date(),
        };
        await addDoc(collection(db, 'auditLogs'), newLog);
    }
    
    const addItem = async <T extends object>(collectionName: string, item: T) => {
        const docRef = await addDoc(collection(db, collectionName), item);
        return docRef;
    };
    
    const updateItem = async <T>(collectionName: string, id: string, item: T) => {
        await updateDoc(doc(db, collectionName, id), item as any);
    };

    const deleteItem = async (collectionName: string, id: string) => {
        await deleteDoc(doc(db, collectionName, id));
    };

    const addBrand = (name: string) => addDoc(collection(db, 'brands'), { name }).then(() => {});
    const updateBrand = (id: string, name: string) => updateItem('brands', id, { name });
    const deleteBrand = (id: string) => deleteItem('brands', id);

    const addFleet = (name: string) => addDoc(collection(db, 'fleets'), { name }).then(() => {});
    const updateFleet = (id: string, name: string) => updateItem('fleets', id, { name });
    const deleteFleet = (id: string) => deleteItem('fleets', id);

    const addOrderType = (name: string) => {
        const maxPosition = orderTypes.reduce((max, type) => Math.max(max, type.position ?? -1), -1);
        const newOrderType = { name, position: maxPosition + 1 };
        return addDoc(collection(db, 'orderTypes'), newOrderType).then(() => {});
    };
    const updateOrderType = (id: string, name: string) => updateItem('orderTypes', id, { name });
    const deleteOrderType = (id: string) => deleteItem('orderTypes', id);
    const updateOrderTypesOrder = async (reorderedTypes: OrderType[]) => {
        const batch = writeBatch(db);
        reorderedTypes.forEach((type, index) => {
            const docRef = doc(db, 'orderTypes', type.id);
            batch.update(docRef, { position: index });
        });
        await batch.commit();
    };

    const updateUser = (id: string, userData: Omit<UserWithId, 'id'>) => updateItem('users', id, userData);
    const deleteUser = (id: string) => deleteItem('users', id);

    const addOrder = async (orderData: Omit<Order, 'id' | 'enteredBy'>, newDriverData?: Omit<Driver, 'id'>) => {
        if (!user) throw new Error("No user logged in");
        let finalOrderData: Omit<Order, 'id'>;

        if (newDriverData) {
            const driverId = await addDriver(newDriverData);
            if (!driverId) {
                toast({ variant: "destructive", title: "Error", description: "No se pudo crear el nuevo motorista." });
                throw new Error("Failed to create new driver.");
            }
             await addAuditLog({
                user: user.name,
                role: user.role,
                action: 'Created Driver',
                details: `Driver "${newDriverData.name}" created`,
            });
        }
        
        finalOrderData = { ...orderData, enteredBy: user.name };
        await addItem('orders', finalOrderData);
    }

    const updateOrder = (id: string, orderData: Omit<Order, 'id' | 'enteredBy'>) => {
        if (!user) return Promise.reject("No user logged in");
        const orderToUpdate = orders.find(o => o.id === id);
        if (!orderToUpdate) return Promise.reject("Order not found");
        const updatedOrder = { ...orderData, enteredBy: orderToUpdate.enteredBy };
        return updateItem('orders', id, updatedOrder);
    }
    const deleteOrder = (id: string) => deleteItem('orders', id);

    const addDriver = async (driverData: Omit<Driver, 'id'>) => {
        try {
            const docRef = await addItem('drivers', driverData);
            return docRef.id;
        } catch (e) {
            console.error("Error adding driver: ", e);
        }
    };

    if (loading && !initialAuthCheck) {
        return <LoadingScreen />;
    }

    const contextValue: DataContextType = { 
        user, role, login, logout, createUser,
        brands, addBrand, updateBrand, deleteBrand,
        fleets, addFleet, updateFleet, deleteFleet,
        orderTypes, addOrderType, updateOrderType, deleteOrderType, updateOrderTypesOrder,
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
