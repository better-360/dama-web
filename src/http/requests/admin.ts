import { IAppointmentProps } from "../../types/applicator";
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



export const setAsClient = async (applicatorId: string) => {
    const response = await adminInstance.patch(`admin/applicator/${applicatorId}/set-as-client`);
    return response.data;
  };
  

export const getClients = async () => {
    const response = await adminInstance.get("admin/clients");
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
  
