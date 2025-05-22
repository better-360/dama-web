import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, AlertCircle, ChevronRight } from "lucide-react";
import { uploadFileToS3 } from "../../../utils/firebase";
import MultiFileUploadComponent from "../../../components/MultipleFileUpload";
import { updatePreApplicationSection } from "../../../http/requests/applicator";

interface PassportUploadProps {
  onBack: () => void;
  onContinue: (files: File[]) => void;
}

const folder = "passport";

const PassportUpload: React.FC<PassportUploadProps> = ({
  onBack,
  onContinue,
}) => {
  const { t } = useTranslation();
  const [files, setFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSaveStep3 = async () => {
    const data = {
      step: 3,
      section: "passport",
      data: {
        passportFiles: [],
      },
    };

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
        // Dosya URL'sini oluşturmak yerine fileKey'i saklıyoruz
        uploadedFileKeys.push(fileKey);
      } catch (err) {
        console.error("Error uploading file:", file.name, err);
        setError(`Dosya ${file.name} yüklenirken hata oluştu.`);
      }
    }
    // İstersen burada da files'ı temizleyebilirsin.
    setFiles([]);
    return uploadedFileKeys;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSaveStep3();
    onContinue(files);
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <MultiFileUploadComponent
            files={files}
            setFiles={setFiles}
            setError={setError}
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
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-medium text-lg bg-[#292A2D] text-white hover:bg-opacity-90 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            {t("passportUpload.continue")}
            <ChevronRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default PassportUpload;
