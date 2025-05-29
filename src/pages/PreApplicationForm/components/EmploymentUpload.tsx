import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, AlertCircle, ChevronRight, Briefcase, Loader } from "lucide-react";
import { uploadFileToS3 } from "../../../utils/firebase"; // S3 yükleme fonksiyonu
import MultiFileUploadComponent from "../../../components/MultipleFileUpload";
import { updatePreApplicationSection } from "../../../http/requests/applicator";

interface EmploymentUploadProps {
  onBack: () => void;
  onContinue: (files: string[]) => void;
  initialFiles?: string[];
}

const folder = "employment";

const EmploymentUpload: React.FC<EmploymentUploadProps> = ({
  onBack,
  onContinue,
  initialFiles,
}) => {
  const { t } = useTranslation();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [showTips, setShowTips] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>(initialFiles || []);

  // Dosyaları S3'e yükleyip URL'leri topluyoruz.
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

  // İşlemleri kaydetmek için backend'e gönderme
  const handleSaveStep4 = async (employmentFileUrls: string[]) => {
    const data = {
      step: 4,
      section: "employment",
      data: {
        employmentFiles: employmentFileUrls.length > 0 ? employmentFileUrls : null,
      },
    };

    console.log("Saving employment data with files:", data);
    await updatePreApplicationSection(data);
  };

  // Form submitinde önce dosyaları S3'e yükleyip, ardından backend'e kaydediyoruz.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    let employmentFileUrls: string[] = [...uploadedFiles];
    
    try {
      // Upload new files if any
      if (files.length > 0) {
        const newUploadedUrls = await handleUploadAll();
        employmentFileUrls = [...employmentFileUrls, ...newUploadedUrls];
        setUploadedFiles(employmentFileUrls);
      }

      await handleSaveStep4(employmentFileUrls);
      onContinue(employmentFileUrls); // Pass uploaded file URLs
    } catch (error) {
      console.error("Error saving employment data:", error);
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
          {t("employmentUpload.back")}
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex justify-center p-3 bg-[#292A2D] bg-opacity-5 rounded-full">
            <Briefcase className="w-8 h-8 text-[#292A2D]" />
          </div>
          <h1 className="text-2xl font-bold text-[#292A2D] mt-4">
            {t("employmentUpload.title")}
          </h1>
          <p className="text-gray-600 mt-1">
            {t("employmentUpload.description")}
          </p>
        </div>

        <div className="mb-6 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg">
          <div className="flex">
            <AlertCircle className="h-6 w-6 text-amber-500" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800">
                {t("employmentUpload.important")}
              </h3>
              <p className="text-sm text-amber-700 mt-1">
                {t("employmentUpload.warning")}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowTips(!showTips)}
          className="w-full mb-6 flex items-center justify-between p-4 bg-blue-50 rounded-xl text-blue-700 hover:bg-blue-100 transition-colors"
        >
          <span className="font-medium">
            {t("employmentUpload.showExamples")}
          </span>
          <span className="text-sm">
            {showTips ? t("common.hide") : t("common.show")}
          </span>
        </button>

        {showTips && (
          <div className="mb-6 bg-blue-50 p-6 rounded-xl space-y-4">
            <h3 className="font-medium text-blue-900">
              {t("employmentUpload.examples.title")}
            </h3>
            <ul className="list-disc list-inside space-y-3 text-sm text-blue-800">
              {/* @ts-ignore */}
              {t("employmentUpload.examples.list", { returnObjects: true }).map(
                (example: any, index: number) => (
                  <li key={index} className="pl-2">
                    {example}
                  </li>
                )
              )}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <MultiFileUploadComponent
            files={files}
            setFiles={setFiles}
            setError={setError}
            label="Employment"
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
            {saving ? t("common.saving") : t("employmentUpload.continue")}
            {!saving && <ChevronRight className="w-5 h-5" />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmploymentUpload;
