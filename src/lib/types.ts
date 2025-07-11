export type Order = {
  id: string;
  orderNumber: string;
  date: Date;
  driver: string;
  type: 'Pickup' | 'Delivery' | string; // Type can be managed by admin
  brand: string;
  fleet: string;
  status: 'Pending' | 'Completed' | 'Cancelled';
  quantity: number;
  observations: string;
  enteredBy: string; // User who entered the order
};

export type AuditLog = {
  id: string;
  user: string;
  role: Role;
  action: string;
  timestamp: Date;
  details: string;
};

export type Role = 'Admin' | 'Fleet Supervisor' | 'Data Entry';

export type User = {
  name: string;
  role: Role;
};

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
