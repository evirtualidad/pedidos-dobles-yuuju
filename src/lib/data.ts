import type { Order, AuditLog } from './types';

// Mock data representing what might come from Firebase
export const mockOrders: Order[] = [
  { id: '1', orderNumber: 'ORD1001', date: new Date('2023-10-01'), driver: 'John Doe', type: 'Standard Delivery', brand: 'Brand A', fleet: 'Fleet 1', status: 'Completed', quantity: 1, observations: 'N/A', enteredBy: 'Admin User' },
  { id: '2', orderNumber: 'ORD1002', date: new Date('2023-10-02'), driver: 'Jane Smith', type: 'Express Pickup', brand: 'Brand B', fleet: 'Fleet 2', status: 'Completed', quantity: 2, observations: 'Fragile items', enteredBy: 'Data Clerk' },
  { id: '3', orderNumber: 'ORD1003', date: new Date('2023-10-03'), driver: 'Mike Johnson', type: 'Standard Delivery', brand: 'Brand A', fleet: 'Fleet 1', status: 'Pending', quantity: 1, observations: '', enteredBy: 'Data Clerk' },
  { id: '4', orderNumber: 'ORD1004', date: new Date('2023-10-04'), driver: 'Emily Davis', type: 'Standard Delivery', brand: 'Brand C', fleet: 'Fleet 3', status: 'Pending', quantity: 3, observations: 'Customer will call', enteredBy: 'Admin User' },
  { id: '5', orderNumber: 'ORD1005', date: new Date('2023-10-05'), driver: 'John Doe', type: 'Express Pickup', brand: 'Brand B', fleet: 'Fleet 2', status: 'Cancelled', quantity: 1, observations: 'Wrong address', enteredBy: 'Supervisor Sam' },
];

export const mockAuditLogs: AuditLog[] = [
    { id: '1', user: 'Admin User', role: 'Admin', action: 'Created Order', timestamp: new Date('2023-10-01T10:00:00Z'), details: 'Order ORD1001 created' },
    { id: '2', user: 'Data Clerk', role: 'Data Entry', action: 'Created Order', timestamp: new Date('2023-10-02T11:30:00Z'), details: 'Order ORD1002 created' },
    { id: '3', user: 'Supervisor Sam', role: 'Fleet Supervisor', action: 'Updated Order', timestamp: new Date('2023-10-03T09:05:00Z'), details: 'Order ORD1002 status changed to Completed' },
    { id: '4', user: 'Admin User', role: 'Admin', action: 'Updated User', timestamp: new Date('2023-10-04T14:00:00Z'), details: 'User "Data Clerk" role updated' },
    { id: '5', user: 'Admin User', role: 'Admin', action: 'Cancelled Order', timestamp: new Date('2023-10-05T15:20:00Z'), details: 'Order ORD1005 cancelled due to wrong address' },
    { id: '6', user: 'Supervisor Sam', role: 'Fleet Supervisor', action: 'Exported Data', timestamp: new Date('2023-10-08T16:00:00Z'), details: 'Exported all fleet orders to CSV' },
    { id: '7', user: 'Admin User', role: 'Admin', action: 'Created Fleet', timestamp: new Date('2023-10-09T12:00:00Z'), details: 'Fleet "Fleet 4" was created' },
];

export const drivers = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Emily Davis', 'Chris Lee'];
export const brands = ['Brand A', 'Brand B', 'Brand C'];
export const fleets = ['Fleet 1', 'Fleet 2', 'Fleet 3'];
export const orderTypes = ['Standard Delivery', 'Express Pickup', 'Return'];
