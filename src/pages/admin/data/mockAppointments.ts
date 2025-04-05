import { Appointment } from '../types/appointment';

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    clientId: '9d68b282-05f6-4118-9b0c-ef76b91115fe',
    clientName: 'Uğur Atakan Sürmeli',
    date: '2025-04-01',
    time: '09:00',
    status: 'SCHEDULED',
    notes: 'İlk görüşme'
  },
  {
    id: '2',
    clientId: 'e21acd4e-5dc2-4e17-8aa5-cfdbdf0b3c0a',
    clientName: 'Egecan Af',
    date: '2025-04-02',
    time: '14:30',
    status: 'SCHEDULED',
    notes: 'Belge teslimi'
  },
  {
    id: '3',
    clientId: '9d68b282-05f6-4118-9b0c-ef76b91115fe',
    clientName: 'Uğur Atakan Sürmeli',
    date: '2025-03-25',
    time: '11:00',
    status: 'COMPLETED',
    notes: 'Dosya incelemesi'
  }
];