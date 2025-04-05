import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, AlertCircle, ChevronRight } from "lucide-react";
import { uploadFirestorage } from "../../../utils/firebase";
import MultiFileUploadComponent from "../../../components/MultipleFileUpload";
import { updatePreApplicationSection } from "../../../http/requests/applicator";
import { useAppSelector } from "../../../store/hooks";

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
  const [fileUrls, setFileUrls] = useState<any>(); 
  
    const applicatorData=useAppSelector((state)=>state.applicator.applicatorData);
  



  const handleSaveStep3 = async() => {
    const data = {
      step: 3,
      section: "passport",
      data: {
        employmentFiles: fileUrls,
      },
    };

    await updatePreApplicationSection(data);
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length > 0) {
      await handleSave();
      onContinue(files);
    }
  };

  const handleSave = async (exitAfterSave: boolean = false) => {
    setSaving(true);

    try {
      // Example of how you might handle uploading multiple files
      const uploadPromises = files.map(async (file) => {
        const fileUrl = await uploadFirestorage(file, folder, applicatorData.application.id);
        return { file, url: fileUrl };
      });

      const uploadResults = await Promise.all(uploadPromises);
      setFileUrls(uploadResults);

      await handleSaveStep3();
      if (exitAfterSave) {
        onContinue(files);
      }
    } catch (error) {
      console.error("Error saving data:", error);
      setError("An error occurred while saving files");
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

        <form onSubmit={handleSubmit} className="space-y-6">
          <MultiFileUploadComponent
            files={files}
            setFiles={setFiles}
            setError={setError}
            label="Passport"
            allowedTypes={[
              "application/pdf",
              "image/jpeg",
              "image/png",
              "image/jpg",
            ]}
          />

          <button
            type="submit"
            disabled={files.length === 0}
            className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-medium text-lg
              ${
                files.length > 0
                  ? "bg-[#292A2D] text-white hover:bg-opacity-90 transform hover:scale-[1.02] active:scale-[0.98]"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              } transition-all duration-300`}
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
