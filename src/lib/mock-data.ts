
import type { Brand, Fleet, OrderType, UserWithId, Order, AuditLog } from "@/lib/types";
import { subDays, addDays } from "date-fns";

const now = new Date();

export const MOCK_USERS: UserWithId[] = [
  { id: 'user-1', name: 'Admin User', email: 'admin@example.com', role: 'Admin' },
  { id: 'user-2', name: 'Supervisor Uno', email: 'supervisor1@example.com', role: 'Fleet Supervisor', fleet: 'Flota Larga Distancia' },
  { id: 'user-3', name: 'Supervisor Dos', email: 'supervisor2@example.com', role: 'Fleet Supervisor', fleet: 'Flota Urbana' },
  { id: 'user-4', name: 'Daniel Datos', email: 'data@example.com', role: 'Data Entry' },
];

export const MOCK_BRANDS: Brand[] = [
  { id: 'brand-1', name: 'SuperCarga' },
  { id: 'brand-2', name: 'Transportes Veloz' },
  { id: 'brand-3', name: 'Logística Total' },
];

export const MOCK_FLEETS: Fleet[] = [
  { id: 'fleet-1', name: 'Flota Larga Distancia' },
  { id: 'fleet-2', name: 'Flota Urbana' },
  { id: 'fleet-3', name: 'Flota Refrigerados' },
];

export const MOCK_ORDER_TYPES: OrderType[] = [
  { id: 'type-1', name: 'Paquetería Estándar' },
  { id: 'type-2', name: 'Carga Pesada' },
  { id: 'type-3', name: 'Entrega Express' },
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'order-1',
    orderNumber: 'ORD-001',
    date: subDays(now, 2),
    driver: 'Juan Pérez',
    type: 'Paquetería Estándar',
    brand: 'SuperCarga',
    fleet: 'Flota Urbana',
    quantity: 15,
    observations: 'Entregar en recepción.',
    enteredBy: 'Daniel Datos',
  },
  {
    id: 'order-2',
    orderNumber: 'ORD-002',
    date: subDays(now, 5),
    driver: 'Maria García',
    type: 'Carga Pesada',
    brand: 'Transportes Veloz',
    fleet: 'Flota Larga Distancia',
    quantity: 1,
    observations: 'Requiere montacargas.',
    enteredBy: 'Daniel Datos',
  },
  {
    id: 'order-3',
    orderNumber: 'ORD-003',
    date: subDays(now, 10),
    driver: 'Carlos Sánchez',
    type: 'Entrega Express',
    brand: 'Logística Total',
    fleet: 'Flota Urbana',
    quantity: 50,
    observations: 'Urgente.',
    enteredBy: 'Admin User',
  },
  {
    id: 'order-4',
    orderNumber: 'ORD-004',
    date: subDays(now, 1),
    driver: 'Juan Pérez',
    type: 'Paquetería Estándar',
    brand: 'SuperCarga',
    fleet: 'Flota Urbana',
    quantity: 22,
    observations: '',
    enteredBy: 'Daniel Datos',
  },
   {
    id: 'order-5',
    orderNumber: 'ORD-005',
    date: subDays(now, 30),
    driver: 'Laura Martinez',
    type: 'Carga Pesada',
    brand: 'Transportes Veloz',
    fleet: 'Flota Refrigerados',
    quantity: 3,
    observations: 'Mantener cadena de frío.',
    enteredBy: 'Supervisor Dos',
  },
];

export const MOCK_AUDIT_LOGS: AuditLog[] = [
    {
        id: 'log-1',
        user: 'Admin User',
        role: 'Admin',
        action: 'Created User',
        details: 'User "Daniel Datos" created',
        timestamp: subDays(now, 1)
    },
    {
        id: 'log-2',
        user: 'Daniel Datos',
        role: 'Data Entry',
        action: 'Created Order',
        details: 'Order ORD-001 created',
        timestamp: subDays(now, 2)
    },
    {
        id: 'log-3',
        user: 'Admin User',
        role: 'Admin',
        action: 'Deleted Brand',
        details: 'Brand "Marca Antigua" deleted',
        timestamp: subDays(now, 3)
    }
];


export const MOCK_DATA = {
    users: MOCK_USERS,
    brands: MOCK_BRANDS,
    fleets: MOCK_FLEETS,
    orderTypes: MOCK_ORDER_TYPES,
    orders: MOCK_ORDERS,
    auditLogs: MOCK_AUDIT_LOGS,
}
