import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Award, ChevronRight, Loader } from "lucide-react";
import { uploadFileToS3 } from "../../../utils/firebase";
import MultiFileUploadComponent from "../../../components/MultipleFileUpload";
import { updatePreApplicationSection } from "../../../http/requests/applicator";
import { RecognitionInfo } from "../context/PreApplicationContext";

interface RecognitionUploadProps {
  onBack: () => void;
  onContinue: (hasDocuments: boolean, files: string[]) => void;
  initialData?: RecognitionInfo;
}

const folder = "recognition";

const RecognitionUpload: React.FC<RecognitionUploadProps> = ({
  onBack,
  onContinue,
  initialData,
}) => {
  const { t } = useTranslation();
  // Always start with null to show the question screen, but store initial data for reference
  const [hasDocuments, setHasDocuments] = useState<boolean | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>(initialData?.files || []);

  // Show current selection if user has made a choice
  const currentSelection = hasDocuments !== null ? hasDocuments : initialData?.hasDocuments;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    let recognitionFileUrls: string[] = [...uploadedFiles];
    
    try {
      // Upload new files if any
      if (files.length > 0) {
        const newUploadedUrls = await handleUploadAll();
        recognitionFileUrls = [...recognitionFileUrls, ...newUploadedUrls];
        setUploadedFiles(recognitionFileUrls);
      }

      await handleSaveStep5(recognitionFileUrls);
      onContinue(currentSelection!, recognitionFileUrls);
    } catch (error) {
      console.error("Error saving recognition data:", error);
      setError("Formunuz kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveStep5 = async (recognitionFileUrls: string[]) => {
    const data = {
      step: 5,
      section: "recognition",
      data: {
        files: recognitionFileUrls.length > 0 ? recognitionFileUrls : null,
        hasDocuments: currentSelection,
      },
    };
    
    console.log("Saving recognition data with files:", data);
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

  const handleNoDocuments = async () => {
    setSaving(true);
    try {
      await handleSaveStep5([]);
      onContinue(false, []);
    } catch (error) {
      console.error("Error saving recognition data:", error);
      setError("Formunuz kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setSaving(false);
    }
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
              className={`w-full p-6 rounded-xl border-2 text-left transition-all duration-300 group ${
                initialData?.hasDocuments === true
                  ? "border-[#292A2D] bg-[#292A2D] text-white"
                  : "border-[#292A2D] hover:bg-[#292A2D] hover:text-white"
              }`}
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
              onClick={handleNoDocuments}
              disabled={saving}
              className={`w-full p-6 rounded-xl border-2 transition-all duration-300 group text-left ${
                saving 
                  ? "border-gray-200 bg-gray-50 cursor-not-allowed"
                  : initialData?.hasDocuments === false
                  ? "border-[#292A2D] bg-[#292A2D] text-white"
                  : "border-gray-200 hover:border-[#292A2D]"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {saving && <Loader className="w-4 h-4 animate-spin" />}
                  <span className="text-lg font-medium">
                    {saving ? t("common.saving") : t("recognitionUpload.noDocuments")}
                  </span>
                </div>
                {!saving && <ChevronRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />}
              </div>
              {!saving && (
                <p className="text-sm opacity-80 mt-1">
                  {t("recognitionUpload.noDocumentsDesc")}
                </p>
              )}
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

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg">
              {error}
            </div>
          )}

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
            {saving ? t("common.saving") : t("recognitionUpload.continue")}
            {!saving && <ChevronRight className="w-5 h-5" />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RecognitionUpload;
