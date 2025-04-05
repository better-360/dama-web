export interface Child {
  name: string;
  birthDate: string;
}

export interface PreviousJob {
  company: string;
  startDate: string;
  endDate: string;
}

export interface Witness {
  firstName: string;
  lastName: string;
}

export interface MaritalData {
  children: Child[];
  spouseName: string;
  hasChildren: boolean;
  maritalStatus: string;
}

export interface EmploymentData {
  salary: string;
  position: string;
  startDate: string;
  hasContract: boolean;
  contractFile: string;
  employerName: string;
  isContractor: boolean;
  totalCompensation: string;
  isMultiplePayments: boolean;
}

export interface WorkConditionsData {
  bases: string;
  dailyHours: string;
  weeklyDays: string;
  lastWorkDate: string;
  supervisorName: string;
}

export interface PostEmploymentData {
  hasWorked: boolean;
  lastSalary: string;
  previousJobs: PreviousJob[];
  currentSalary: string;
  currentCompany: string;
  isCurrentlyWorking: boolean;
}

export interface EvidenceWitnessData {
  witnesses: Witness[];
  hasWitnesses: boolean;
  evidenceLinks: string[];
}

export interface ApplicationSection {
  data: MaritalData | EmploymentData | WorkConditionsData | PostEmploymentData | EvidenceWitnessData;
  step: number;
  section: string;
}

export const sectionLabels: Record<string, string> = {
  'marital': 'Medeni Durum Bilgileri',
  'employment': 'İstihdam Bilgileri',
  'workConditions': 'Çalışma Koşulları',
  'postEmployment': 'Sonraki İstihdam Bilgileri',
  'evidenceWitness': 'Kanıt ve Tanık Bilgileri'
};