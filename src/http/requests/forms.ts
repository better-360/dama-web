import instance from "../instance";

export const saveApplicationAnswers = async (id:string,data: any) => {
  instance.put(`/applications/${id}/pre-application`, data);
};

export const savePreApplicationAnswers = async (id:string,data: any) => {
  instance.put(`/applications/${id}/pre-application`, data);
};
