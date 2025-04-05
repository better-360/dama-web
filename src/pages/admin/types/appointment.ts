export interface Appointment {
  id: string;
  applicator:any
  dateTime: string;
  status: 'PENDING'|'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  appointmentType: 'ONLINE' | 'INOFFICE';
}

export const statusLabels: Record<string, string> = {
  'PENDING': 'Bekliyor',
  'SCHEDULED': 'Planlandı',
  'COMPLETED': 'Tamamlandı',
  'CANCELLED': 'İptal Edildi'
};

export const statusClasses: Record<string, string> = {
  'SCHEDULED': 'bg-blue-100 text-blue-800',
  'COMPLETED': 'bg-green-100 text-green-800',
  'CANCELLED': 'bg-red-100 text-red-800'
};