export interface Client {
  id: string;
  telephone: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string | null;
  address: string | null;
  status: 'APPLICATOR' | 'CLIENT' | 'APPOINTMENT_SCHEDULED';
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  applications: any[];
  appointments: any[];
}

export const statusLabels: Record<string, string> = {
  'APPLICATOR': 'Başvuru Yapıldı',
  'CLIENT': 'Müvekkil',
  'APPOINTMENT_SCHEDULED': 'Randevu Verildi'
};

export const statusClasses: Record<string, string> = {
  'APPLICATOR': 'bg-yellow-100 text-yellow-800',
  'CLIENT': 'bg-green-100 text-green-800',
  'APPOINTMENT_SCHEDULED': 'bg-blue-100 text-blue-800'
};