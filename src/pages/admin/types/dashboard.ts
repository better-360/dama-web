export interface DashboardStats {
  totalApplicators: number;
  totalClients: number;
  totalApplications: number;
  totalAppointments: number;
  totalUsers: number;
  recentUsers: any[];
  comingAppointments: UpcomingAppointment[];
  recentApplications: any[];

}


export interface UpcomingAppointment {
  id: string;
  clientName: string;
  dateTime: Date;
  notes?: string;
}
