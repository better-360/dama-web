import { DashboardStats, RecentApplication, UpcomingAppointment } from '../types/dashboard';

export const mockStats: DashboardStats = {
  activeApplications: 12,
  totalClients: 45,
  totalAppointments: 8
};

export const mockRecentApplications: RecentApplication[] = [
  {
    id: '1',
    clientName: 'Uğur Atakan Sürmeli',
    date: '2025-03-25',
    status: 'APPLICATOR'
  },
  {
    id: '2',
    clientName: 'Egecan Af',
    date: '2025-03-24',
    status: 'CLIENT'
  },
  {
    id: '3',
    clientName: 'Ahmet Yılmaz',
    date: '2025-03-23',
    status: 'APPOINTMENT_SCHEDULED'
  }
];

export const mockUpcomingAppointments: UpcomingAppointment[] = [
  {
    id: '1',
    clientName: 'Uğur Atakan Sürmeli',
    date: '2025-04-01',
    time: '09:00',
    notes: 'İlk görüşme'
  },
  {
    id: '2',
    clientName: 'Egecan Af',
    date: '2025-04-02',
    time: '14:30',
    notes: 'Belge teslimi'
  },
  {
    id: '3',
    clientName: 'Mehmet Demir',
    date: '2025-04-03',
    time: '11:00',
    notes: 'Dosya incelemesi'
  }
];