import type { Order, AuditLog } from './types';

export const mockOrders: Order[] = [
  { id: '1', orderNumber: 'ORD1001', date: new Date('2023-10-01'), driver: 'John Doe', type: 'Delivery', brand: 'Brand A', fleet: 'Fleet 1', status: 'Completed' },
  { id: '2', orderNumber: 'ORD1002', date: new Date('2023-10-02'), driver: 'Jane Smith', type: 'Pickup', brand: 'Brand B', fleet: 'Fleet 2', status: 'Completed' },
  { id: '3', orderNumber: 'ORD1003', date: new Date('2023-10-03'), driver: 'Mike Johnson', type: 'Delivery', brand: 'Brand A', fleet: 'Fleet 1', status: 'Pending' },
  { id: '4', orderNumber: 'ORD1004', date: new Date('2023-10-04'), driver: 'Emily Davis', type: 'Delivery', brand: 'Brand C', fleet: 'Fleet 3', status: 'Pending' },
  { id: '5', orderNumber: 'ORD1005', date: new Date('2023-10-05'), driver: 'John Doe', type: 'Pickup', brand: 'Brand B', fleet: 'Fleet 2', status: 'Cancelled' },
  { id: '6', orderNumber: 'ORD1006', date: new Date('2023-10-06'), driver: 'Chris Lee', type: 'Delivery', brand: 'Brand C', fleet: 'Fleet 3', status: 'Completed' },
  { id: '7', orderNumber: 'ORD1007', date: new Date('2023-10-07'), driver: 'Jane Smith', type: 'Delivery', brand: 'Brand A', fleet: 'Fleet 1', status: 'Pending' },
];

export const mockAuditLogs: AuditLog[] = [
  { id: '1', user: 'Admin User', role: 'Admin', action: 'Created Order', timestamp: new Date('2023-10-01T10:00:00Z'), details: 'Order ORD1001 created for John Doe' },
  { id: '2', user: 'Supervisor Sam', role: 'Fleet Supervisor', action: 'Updated Order', timestamp: new Date('2023-10-02T11:30:00Z'), details: 'Order ORD1002 status changed to Completed' },
  { id: '3', user: 'Data Clerk', role: 'Data Entry', action: 'Created Order', timestamp: new Date('2023-10-03T09:05:00Z'), details: 'Order ORD1003 created for Mike Johnson' },
  { id: '4', user: 'Admin User', role: 'Admin', action: 'Cancelled Order', timestamp: new Date('2023-10-05T15:20:00Z'), details: 'Order ORD1005 cancelled' },
  { id: '5', user: 'Supervisor Sam', role: 'Fleet Supervisor', action: 'Exported Data', timestamp: new Date('2023-10-08T16:00:00Z'), details: 'Exported all orders to PDF' },
];

export const drivers = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Emily Davis', 'Chris Lee'];
export const brands = ['Brand A', 'Brand B', 'Brand C'];
export const fleets = ['Fleet 1', 'Fleet 2', 'Fleet 3'];
