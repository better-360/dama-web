import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, AlertCircle, ChevronRight, Loader } from "lucide-react";
import { uploadFileToS3 } from "../../../utils/firebase";
import MultiFileUploadComponent from "../../../components/MultipleFileUpload";
import { updatePreApplicationSection } from "../../../http/requests/applicator";
import { usePreApplication } from "../context/PreApplicationContext";

interface PassportUploadProps {
  onBack: () => void;
  onContinue: () => void;
}

const folder = "passport";

const PassportUpload: React.FC<PassportUploadProps> = ({
  onBack,
  onContinue,
}) => {
  const { t } = useTranslation();
  const { state, actions } = usePreApplication();
  const [files, setFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSaveStep3 = async (passportFileUrls: string[]) => {
    const data = {
      step: 3,
      section: "passport",
      data: {
        passportFiles: passportFileUrls.length > 0 ? passportFileUrls : null,
      },
    };

    console.log("Saving passport data with files:", data);
    await updatePreApplicationSection(data);
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    let passportFileUrls: string[] = [...state.passportFiles];
    
    try {
      // Upload new files if any
      if (files.length > 0) {
        const newUploadedUrls = await handleUploadAll();
        passportFileUrls = [...passportFileUrls, ...newUploadedUrls];
        actions.setPassportFiles(passportFileUrls);
      }

      await handleSaveStep3(passportFileUrls);
      onContinue();
    } catch (error) {
      console.error("Error saving passport data:", error);
      setError("Formunuz kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E2E0D6] flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-lg p-6 sm:p-8 my-8">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-[#292A2D] transition-colors mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
          {t("passportUpload.back")}
        </button>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#292A2D] mb-3">
            {t("passportUpload.title")}
          </h1>
          <p className="text-gray-600">{t("passportUpload.description")}</p>
        </div>

        <div className="mb-6 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg">
          <div className="flex">
            <AlertCircle className="h-6 w-6 text-amber-500" />
            <div className="ml-3">
              <p className="text-sm text-amber-700">
                {t("passportUpload.warning")}
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <MultiFileUploadComponent
            files={files}
            setFiles={setFiles}
            setError={setError}
            fileUrls={state.passportFiles}
            onRemoveUploadedFile={(index: number) => {
              const updatedFiles = state.passportFiles.filter((_, i) => i !== index);
              actions.setPassportFiles(updatedFiles);
            }}
            label="Passport"
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

          <button
            type="submit"
            disabled={saving}
            className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-medium text-lg transition-all duration-300 ${
              saving
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-[#292A2D] text-white hover:bg-opacity-90 transform hover:scale-[1.02] active:scale-[0.98]"
            }`}
          >
            {saving && <Loader className="w-4 h-4 mr-2 animate-spin" />}
            {saving ? t("common.saving") : t("passportUpload.continue")}
            {!saving && <ChevronRight className="w-5 h-5" />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PassportUpload;
