
import type { Timestamp } from "firebase/firestore";

export type Order = {
  id: string;
  orderNumber: string;
  date: Date;
  driver: string;
  type: string; 
  brand: string;
  fleet: string;
  quantity: number;
  observations: string;
  enteredBy: string; 
};

// Type for reading from Firestore
export type FirebaseOrder = Omit<Order, 'id' | 'date'> & {
  date: Timestamp;
};

export type AuditLog = {
  id: string;
  user: string;
  role: Role;
  action: string;
  timestamp: Date;
  details: string;
};

// Type for reading from Firestore
export type FirebaseAuditLog = Omit<AuditLog, 'id' | 'timestamp'> & {
  timestamp: Timestamp;
};


export type Role = 'Admin' | 'Fleet Supervisor' | 'Data Entry';

export type User = {
  name: string;
  role: Role;
  fleet?: string;
};

export type UserWithId = User & { id: string; };

export type Fleet = {
  id: string;
  name: string;
};

export type Brand = {
  id: string;
  name: string;
}

export type OrderType = {
  id: string;
  name: string;
}
