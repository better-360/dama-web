import { ApplicationData } from "../types/form";

export const initialApplicationData: ApplicationData = {
    status: "pending",
    updatedAt: "",
    personalInfo: {
      name: "",
      surname: "",
      email: "",
      phone: "",
      birthDate: "",
      maritalStatus: "",
      spouseName: "",
      hasChildren: false,
      children: [],
      emergencyContact: {
        fullName: "",
        phone: "",
        email: "",
      },
    },
    workInfo: {
      employerName: "",
      position: "",
      startDate: "",
      salary: "",
      workedForContractor: false,
      salarySource: "",
      salaryPaymentType: "",
      totalCompensation: "",
      hasContract: false,
      contractFileUrl: "",
    },
    workConditions: {
      workHours: "",
      workDays: "",
      lastWorkDate: "",
      supervisorName: "",
      bases: "",
      hasLOA: false,
      loaFileUrl: "",
    },
    turkeyWorkStatus: {
      currentCompany: "",
      currentSalary: "",
      workedAfterReturn: false,
      companies: [],
      currentlyWorking: false,
      lastSalaryInTurkey: "",
    },
    incidentDetails: {
      idCardFileUrl: "",
      passportFileUrl: "",
      mediaLinks: [],
      witnesses: [],
    },
  };
  
  