import { IAppointmentProps } from "../../types/applicator";
import { ApplicationStatus } from "../../types/status";
import adminInstance from "../adminInstance";

export const getSystemStats = async () => {
    const response = await adminInstance.get("admin/stats");
    return response.data;
  };

  
export const getApplicators = async () => {
  const response = await adminInstance.get("admin/applicators");
  return response.data;
};

export const getApplication = async (applicatorId: string) => {
  const response = await adminInstance.get(`admin/application/${applicatorId}`);
  return response.data;
};


export const getFileUrl = async (fileKey: string) => {
  const encodedKey = encodeURIComponent(fileKey);
  const response = await adminInstance.get(`admin/view-file/${encodedKey}`);
  console.log("File URL response:", response.data); // Debug log
  return response.data;
  };


export const setAsClient = async (applicatorId: string) => {
    const response = await adminInstance.patch(`admin/applicator/${applicatorId}/set-as-client`);
    return response.data;
  };
  


export const getClients = async () => {
    const response = await adminInstance.get("admin/clients");
    return response.data;
  };

  export const getOTPTokens = async () => {
    const response = await adminInstance.get("admin/otp-tokens");
    return response.data;
  };

  export const deleteApplication = async (applicatorId: string) => {
  const response = await adminInstance.delete(
    `admin/application/${applicatorId}`
  );
  return response.data;
};

export const createAppointment = async (appointmentData: IAppointmentProps) => {
    console.log("Creating appointment with data:", appointmentData); // Debug log
  const response = await adminInstance.post(
    "admin/appointments/create",
    appointmentData
  );
  
  return response.data;
};


export const getAppointments = async () => {
    const response = await adminInstance.get("admin/appointments/all");
    return response.data;
  };
  

  export const updateApplicationStatus = async (applicatorId: string,status:ApplicationStatus) => {
    const response = await adminInstance.patch(
      `admin/application/update-app-status`,{
        applicatorId,
        status
      }
    );
    return response.data;
  };

export const updateApplication = async (applicatorId: string, sectionType: 'preApplicationData' | 'applicationData', sectionIndex: number, sectionData: any) => {
  const response = await adminInstance.patch(
    `admin/application/${applicatorId}/update-section`,
    {
      sectionType,
      sectionIndex,
      sectionData
    }
  );
  return response.data;
};
