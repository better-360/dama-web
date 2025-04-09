// Enums
export enum ApplicationStatus {
    PRE_APPLICATION = 'PRE_APPLICATION',
    USER_COMPLETED = 'USER_COMPLETED',
    PENDING = 'PENDING',
    APPLICATION_RECEIVED = 'APPLICATION_RECEIVED',
    OFFICE_APPOINTMENT_SCHEDULED = 'OFFICE_APPOINTMENT_SCHEDULED',
    MEDICAL_EVALUATION = 'MEDICAL_EVALUATION',
    MEDICAL_REPORTS_PENDING = 'MEDICAL_REPORTS_PENDING',
    INTERNATIONAL_APPLICATION_PREPARATION = 'INTERNATIONAL_APPLICATION_PREPARATION',
    DCN_NUMBER_PENDING = 'DCN_NUMBER_PENDING',
    OWCP_REVIEW = 'OWCP_REVIEW',
    APPLICATION_APPROVED = 'APPLICATION_APPROVED',
    PAYMENT_PROCESS = 'PAYMENT_PROCESS',
    COMPLETED = 'COMPLETED',
    REJECTED = 'REJECTED'
  }
  
  export enum ApplicatorStatus {
    APPOINTMENT_SCHEDULED = 'APPOINTMENT_SCHEDULED',
    APPLICATOR = 'APPLICATOR',
    CLIENT = 'CLIENT'
  }
  
  export enum AppointmentStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    CANCELLED = 'CANCELLED',
    COMPLETED = 'COMPLETED'
  }
  
  export enum AppointmentType {
    ONLINE = 'ONLINE',
    INOFFICE = 'INOFFICE'
  }
    
  
export interface Application {
    id: string;
    status: ApplicationStatus;
    applicationNumber: string;
    preApplicationCompleted: boolean;
    applicationCompleted: boolean;
    createdAt: string;
  }

export interface Appointment {
        id: string;
        dateTime: string;
        status: AppointmentStatus;
        notes: string | null;
        appointmentType: AppointmentType;
        createdAt: string;
}
      

export interface MyStatusReponse {
    id: string;
    telephone: string;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    birthDate: string | null;
    address: string | null;
    status: ApplicatorStatus;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    application: Application | null;
    appointments: Appointment[];
  }
