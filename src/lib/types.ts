

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

export type Role = 'Admin' | 'Fleet Supervisor' | 'Data Entry';

export type User = {
  name: string;
  email: string;
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
  position: number;
}

export type Driver = {
    id: string;
    name: string;
    fleet: string;
}
