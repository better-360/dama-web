import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, Briefcase, Loader } from "lucide-react";
import MultiFileUploadComponent from "../../../components/MultipleFileUpload";
import { uploadFileToS3 } from "../../../utils/firebase";
import { useApplication } from '../context/ApplicationContext';
import { updateApplicationSection } from '../../../http/requests/applicator';

interface EmploymentData {
  employerName: string;
  position: string;
  salary: string;
  startDate: string;
  hasContract: boolean | null;
  contractFile: string|undefined;
  isContractor: boolean;
  totalCompensation: string;
  isMultiplePayments: boolean;
}

interface EmploymentInfoProps {
  onComplete: () => void;
  onBack: () => void;
}

const EmploymentInfo: React.FC<EmploymentInfoProps> = ({
  onComplete,
  onBack,
}) => {
  const { t } = useTranslation();
  const { state, actions } = useApplication();
  const formData = state.employment;
  
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const folder = "contracts";

  const handleUploadAll = async (): Promise<string[]> => {
    const uploadedFileKeys: string[] = [];

    for (const file of files) {
      try {
        const { fileKey } = await uploadFileToS3(
          file,
          file.name,
          file.type,
          folder
        );
        uploadedFileKeys.push(fileKey);
      } catch (err) {
        console.error("Error uploading file:", file.name, err);
        setError(`Dosya ${file.name} yüklenirken hata oluştu.`);
      }
    }
    setFiles([]);
    return uploadedFileKeys;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    actions.setEmployment({ [name]: value });
  };

  const handleOptionChange = (field: keyof typeof formData, value: any) => {
    actions.setEmployment({ [field]: value });
  };

  const isFormValid = () => {
    return true; // No validation required
  };

  const handleContinue = async () => {
    setSaving(true);
    let finalFormData = { ...formData };
    
    try {
      // Upload files if needed
      if (files.length > 0) {
        const uploadedUrls = await handleUploadAll();
        console.log("Uploaded URLs:", uploadedUrls);
        
        if (uploadedUrls.length > 0) {
          finalFormData.contractFile = uploadedUrls[0];
          actions.setEmployment({ contractFile: uploadedUrls[0] });
        }
      }
      
      const sectionData = {
        step: 2,
        section: "employment",
        data: finalFormData,
      };

      console.log("Sending employment data to server:", sectionData);
      await updateApplicationSection(sectionData);
      onComplete();
    } catch (error) {
      console.error("Error saving employment data:", error);
      setError("Formunuz kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setSaving(false);
    }
  };

  const removeContractFile = () => {
    actions.setEmployment({ contractFile: "" });
  };

  return (
    <div className="min-h-screen bg-[#E2E0D6] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        <button
          onClick={onBack}
          className="text-[#292A2D] mb-6 flex items-center gap-1 hover:opacity-80 transition-opacity"
        >
          <ChevronLeft className="w-5 h-5" />
          {t("common.back")}
        </button>

        <div className="flex items-center justify-center mb-6">
          <Briefcase className="w-12 h-12 text-[#292A2D]" />
        </div>

        <h1 className="text-3xl font-bold text-center text-[#292A2D] mb-2">
          {t("employment.title")}
        </h1>
        <p className="text-center text-gray-600 mb-8">
          {t("employment.subtitle")}
        </p>

        <div className="space-y-6">
          {/* Employer Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[#292A2D]">
              {t("employment.employerInfo")}
            </h2>

            <div className="space-y-3">
              <input
                type="text"
                name="employerName"
                value={formData.employerName}
                onChange={handleInputChange}
                placeholder={t("employment.employerName")}
                className="w-full p-4 rounded-xl border border-gray-300 focus:border-[#292A2D] focus:ring-1 focus:ring-[#292A2D] transition-all"
              />

              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                placeholder={t("employment.position")}
                className="w-full p-4 rounded-xl border border-gray-300 focus:border-[#292A2D] focus:ring-1 focus:ring-[#292A2D] transition-all"
              />
              <input
                    type="date"
                    id="startDate"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange({
                      target: { name: 'startDate', value: e.target.value }
                    } as React.ChangeEvent<HTMLInputElement>)}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#292A2D] focus:ring-1 focus:ring-[#292A2D] transition-colors"
                    placeholder={t('employment.startDate')}
                   
                  />
              <div className="relative">
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  placeholder={t("employment.salary")}
                  className="w-full p-4 rounded-xl border border-gray-300 focus:border-[#292A2D] focus:ring-1 focus:ring-[#292A2D] transition-all pl-12"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[#292A2D]">
              {t("employment.paymentInfo")}
            </h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {t("employment.isContractor")}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleOptionChange('isContractor', true)}
                    className={`p-4 rounded-xl font-medium transition-all duration-200 ${
                      formData.isContractor === true
                        ? "bg-[#292A2D] text-white"
                        : "bg-gray-50 hover:bg-gray-100 text-[#292A2D]"
                    }`}
                  >
                    {t("common.yes")}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOptionChange('isContractor', false)}
                    className={`p-4 rounded-xl font-medium transition-all duration-200 ${
                      formData.isContractor === false
                        ? "bg-[#292A2D] text-white"
                        : "bg-gray-50 hover:bg-gray-100 text-[#292A2D]"
                    }`}
                  >
                    {t("common.no")}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {t("employment.paymentType")}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleOptionChange('isMultiplePayments', false)}
                    className={`p-4 rounded-xl font-medium transition-all duration-200 ${
                      formData.isMultiplePayments === false
                        ? "bg-[#292A2D] text-white"
                        : "bg-gray-50 hover:bg-gray-100 text-[#292A2D]"
                    }`}
                  >
                    {t("employment.singleCompany")}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOptionChange('isMultiplePayments', true)}
                    className={`p-4 rounded-xl font-medium transition-all duration-200 ${
                      formData.isMultiplePayments === true
                        ? "bg-[#292A2D] text-white"
                        : "bg-gray-50 hover:bg-gray-100 text-[#292A2D]"
                    }`}
                  >
                    {t("employment.multipleCompanies")}
                  </button>
                </div>
              </div>

              <div className="relative">
                <input
                  type="number"
                  name="totalCompensation"
                  value={formData.totalCompensation}
                  onChange={handleInputChange}
                  placeholder={t("employment.totalCompensation")}
                  className="w-full p-4 rounded-xl border border-gray-300 focus:border-[#292A2D] focus:ring-1 focus:ring-[#292A2D] transition-all pl-12"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  $
                </span>
              </div>
            </div>
          </div>

          {/* Contract Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[#292A2D]">
              {t("employment.contractInfo")}
            </h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {t("employment.hasContract")}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleOptionChange('hasContract', true)}
                    className={`p-4 rounded-xl font-medium transition-all duration-200 ${
                      formData.hasContract === true
                        ? "bg-[#292A2D] text-white"
                        : "bg-gray-50 hover:bg-gray-100 text-[#292A2D]"
                    }`}
                  >
                    {t("common.yes")}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOptionChange('hasContract', false)}
                    className={`p-4 rounded-xl font-medium transition-all duration-200 ${
                      formData.hasContract === false
                        ? "bg-[#292A2D] text-white"
                        : "bg-gray-50 hover:bg-gray-100 text-[#292A2D]"
                    }`}
                  >
                    {t("common.no")}
                  </button>
                </div>
              </div>

              {formData.hasContract && (
                <div>
                  {formData.contractFile && (
                    <div className="mb-2 p-2 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 truncate">
                          {formData.contractFile.split('/').pop() || 'Contract file'}
                        </span>
                        <button
                          onClick={removeContractFile}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {(!formData.contractFile || formData.contractFile === "") && (
                    <MultiFileUploadComponent
                      files={files}
                      setFiles={setFiles}
                      setError={setError}
                      label="Contract"
                      allowedTypes={[
                        "application/pdf",
                        "application/msword",
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                        "application/vnd.ms-excel",
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        "application/vnd.ms-powerpoint",
                        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                        "application/vnd.ms-access",
                        "image/jpeg",
                        "image/png",
                        "image/jpg",
                      ]}
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            onClick={handleContinue}
            disabled={!isFormValid() || saving}
            className="w-full bg-[#292A2D] text-white py-4 rounded-xl font-medium hover:bg-opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {saving && <Loader className="w-4 h-4 mr-2 animate-spin" />}
            {saving ? t("common.saving") : t("common.continue")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmploymentInfo;