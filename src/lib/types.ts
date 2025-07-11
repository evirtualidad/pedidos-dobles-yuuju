export type Order = {
  id: string;
  orderNumber: string;
  date: Date;
  driver: string;
  type: 'Pickup' | 'Delivery';
  brand: string;
  fleet: string;
  status: 'Pending' | 'Completed' | 'Cancelled';
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
