import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Award, ChevronRight } from "lucide-react";
import { uploadFileToS3 } from "../../../utils/firebase";
import MultiFileUploadComponent from "../../../components/MultipleFileUpload";
import { updatePreApplicationSection } from "../../../http/requests/applicator";

interface RecognitionUploadProps {
  onBack: () => void;
  onContinue: (hasDocuments: boolean, files: File[]) => void;
}

const folder = "recognition";

const RecognitionUpload: React.FC<RecognitionUploadProps> = ({
  onBack,
  onContinue,
}) => {
  const { t } = useTranslation();
  const [hasDocuments, setHasDocuments] = useState<boolean | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSaveStep5();
    onContinue(hasDocuments, files);
  };

  const handleSaveStep5 = async () => {
    const data = {
      step: 5,
      section: "recognition",
      data: {
        files: [],
        hasDocuments,
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

  if (hasDocuments === null) {
    return (
      <div className="min-h-screen bg-[#E2E0D6] flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-6 sm:p-8 my-8">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-[#292A2D] transition-colors mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
            {t("recognitionUpload.back")}
          </button>

          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-[#292A2D] bg-opacity-5 rounded-full">
              <Award className="w-8 h-8 text-[#292A2D]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#292A2D]">
                {t("recognitionUpload.title")}
              </h1>
              <p className="text-gray-600 mt-1">
                {t("recognitionUpload.description")}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setHasDocuments(true)}
              className="w-full p-6 rounded-xl border-2 border-[#292A2D] hover:bg-[#292A2D] hover:text-white 
                text-left transition-all duration-300 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">
                  {t("recognitionUpload.hasDocuments")}
                </span>
                <ChevronRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-sm opacity-80 mt-1">
                {t("recognitionUpload.hasDocumentsDesc")}
              </p>
            </button>

            <button
              onClick={() => onContinue(false, [])}
              className="w-full p-6 rounded-xl border-2 border-gray-200 hover:border-[#292A2D] 
                text-left transition-all duration-300 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">
                  {t("recognitionUpload.noDocuments")}
                </span>
                <ChevronRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {t("recognitionUpload.noDocumentsDesc")}
              </p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E2E0D6] flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-lg p-6 sm:p-8 my-8">
        <button
          onClick={() => setHasDocuments(null)}
          className="flex items-center text-gray-600 hover:text-[#292A2D] transition-colors mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
          {t("recognitionUpload.back")}
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-[#292A2D] bg-opacity-5 rounded-full">
            <Award className="w-8 h-8 text-[#292A2D]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#292A2D]">
              {t("recognitionUpload.uploadTitle")}
            </h1>
            <p className="text-gray-600 mt-1">
              {t("recognitionUpload.uploadDescription")}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <MultiFileUploadComponent
            files={files}
            setFiles={setFiles}
            setError={setError}
            label="Recognition"
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
            {t("recognitionUpload.continue")}
            <ChevronRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default RecognitionUpload;
