export interface Child {
  id: string;
  fullName: string;
  birthDate: string;
}

export type ApplicationStatus =
  | "pending"
  | "review"
  | "approved"
  | "rejected"
  | "additional-info";

export interface PersonalInfo {
  name:string;
  surname: string;
  email: string;
  phone: string;
  birthDate: string;
  maritalStatus?: string;
  spouseName: string;
  hasChildren: boolean;
  children: Child[];
  emergencyContact: {
    fullName: string;
    phone: string;
    email: string;
  };
}

export interface Company {
  id: string;
  name: string;
  duration: string;
}


export interface WorkInfo {
  employerName: string;
  position: string;
  startDate: string;
  salary: string;
  workedForContractor: boolean | null;
  salarySource: string;
  salaryPaymentType: string;
  totalCompensation: string;
  hasContract: boolean | null;
  contractFileUrl: string;
}

export interface WorkConditions {
  workHours: string;
  workDays: string;
  lastWorkDate: string;
  supervisorName: string;
  bases: string;
  hasLOA: boolean | null;
  loaFileUrl: string;
}

export interface TurkeyWorkStatus {
  currentCompany: string;
  currentSalary: string;
  workedAfterReturn: boolean;
  companies: Company[]; // virgülle ayrılmış şirket isimleri
  currentlyWorking: boolean;
  lastSalaryInTurkey: string;
}
export interface IncidentDetails {
  idCardFileUrl: string;
  passportFileUrl: string;
  mediaLinks: string[]; // örneğin link listesi
  witnesses: string[]; // örneğin tanık isimleri
}

export interface ApplicationData {
    status: ApplicationStatus;
    personalInfo: PersonalInfo;
    workInfo: WorkInfo;
    workConditions: WorkConditions;
    turkeyWorkStatus: TurkeyWorkStatus;
    incidentDetails: IncidentDetails;
    updatedAt: string;
  }


export interface ApplicationDataWithId extends ApplicationData {
        id: string;
        applicationId:string;
}
    

export enum ApplicationType{
  PRE_APPLICATION = 'PRE_APPLICATION',
  APPLICATION = 'APPLICATION',
}