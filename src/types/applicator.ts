export interface IApplicator {
    id: string;
    telephone: string;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    birthDate: string | null;
    address: string | null;
    status: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    application: {
      id: string;
      applicatorId: string;
      status: string;
      applicationNumber: string;
      preApplicationData: any;
      preApplicationCompleted:boolean;
      applicationCompleted:boolean;
      applicationData: any | null;
      createdAt: string;
      updatedAt: string;
      deletedAt: string | null;
    };
    appointments: any[];
  }


  export interface Tokens {
    accessToken: string;
    refreshToken: string;
  }
  
  export interface IApplicatorResponse {
    applicator: IApplicator;
    tokens: Tokens;
  }
  

  export interface IAppointmentProps{
    applicatorId: string;
    dateTime: Date;
    notes?: string;
    appointmentType: 'ONLINE' | 'INOFFICE';
  }