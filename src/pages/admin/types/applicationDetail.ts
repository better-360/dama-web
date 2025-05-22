export interface PreApplicationData {
  step: number;
  section: string;
  data: {
    birthDate: string | number | Date;
    birthDate: any;
    incidentFiles(incidentFiles: any): import("react").ReactNode | Iterable<import("react").ReactNode>;
    email?: string;
    lastName?: string;
    firstName?: string;
    incidentDescription?: string;
    passportFiles?: string[];
    employmentFiles?: string[];
    files?: string[];
    hasDocuments?: boolean;
    paymentFiles?: string[];
  };
}

export interface ApplicationDetail {
  applicatorId: string;
  applicationNumber: string;
  preApplicationData: PreApplicationData[];
  applicationData: any[]; // We'll type this later when needed
  createdAt: string;
  updatedAt: string;
}

export const sectionLabels: Record<string, string> = {
  'contact': 'İletişim Bilgileri',
  'incident': 'Olay Açıklaması',
  'passport': 'Pasaport Belgeleri',
  'employment': 'İstihdam Belgeleri',
  'recognition': 'Takdir Belgeleri',
  'payment': 'Ödeme Belgeleri'
};