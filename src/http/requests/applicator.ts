import baseApi from "..";
import { IApplicator, IApplicatorResponse } from "../../types/applicator";
import instance from "../instance";

export const requestOTPToken = async (telephone: string) => {
  const response = await baseApi.post("applicator/auth/generate-otp", {
    telephone: telephone,
  });
  return response.data;
};

export const verifyOTPToken = async (
  telephone: string,
  token: string
): Promise<IApplicatorResponse> => {
  try {
    const response = await baseApi.post("applicator/auth/verify-otp", {
      telephone,
      token,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};


export const getApplicatorProfile = async (): Promise<IApplicator> => {
  const response = await instance.get("applicator/auth/profile");
  return response.data;
};

export class UpdateApplicatorData {
  firstName?: string;
  lastName?: string;
  email?: string;
  birthDate?: Date;
}

export const updateApplicatorProfile = async (data:UpdateApplicatorData): Promise<IApplicator> => {
  const response = await instance.patch("applicator/auth/update-profile",data);
  return response.data;
};





export const updatePreApplicationSection = async (data: {
  section: string;
  step: number;
  data: any;
}): Promise<IApplicatorResponse> => {
  try {
    const response = await instance.put(
      "applications/update-section/pre-application",data
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const updateApplicationSection = async (data: {
  section: string;
  step: number;
  data: any;
}): Promise<IApplicatorResponse> => {
  try {
    const response = await instance.put(
      "applications/update-section/application",
      data
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};
