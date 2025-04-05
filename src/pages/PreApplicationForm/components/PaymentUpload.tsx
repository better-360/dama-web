import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, AlertCircle, ChevronRight, DollarSign, HelpCircle } from "lucide-react";
import { uploadFirestorage } from "../../../utils/firebase";
import MultiFileUploadComponent from "../../../components/MultipleFileUpload";
import { updatePreApplicationSection } from "../../../http/requests/applicator";
import { useAppSelector } from "../../../store/hooks";

interface PaymentUploadProps {
  onBack: () => void;
  onContinue: (files: File[]) => void;
}

const folder = "payment";

const PaymentUpload: React.FC<PaymentUploadProps> = ({
  onBack,
  onContinue,
}) => {
  const { t } = useTranslation();
  const [files, setFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTips, setShowTips] = useState(false);
  const [fileUrls, setFileUrls] = useState<any>();
    const applicatorData=useAppSelector((state)=>state.applicator.applicatorData);
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length > 0) {
      await handleSave();
      onContinue(files);
    }
  };

  
  
  const handleSaveStep6 =async () => {
    const data = {
      step: 6,
      section: "payment",
      data: {
        paymentFiles: fileUrls,
      },
    };
      await updatePreApplicationSection(data);
    
  };


  const handleSave = async (exitAfterSave: boolean = false) => {
    setSaving(true);

    try {
      // Example of how you might handle uploading multiple files
      const uploadPromises = files.map(async (file) => {
        const fileUrl = await uploadFirestorage(file, folder, applicatorData.application.id);;
        return { file, url: fileUrl };
      });

      const uploadResults = await Promise.all(uploadPromises);

      setFileUrls(uploadResults);

     await handleSaveStep6();
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
          {t("paymentUpload.back")}
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-[#292A2D] bg-opacity-5 rounded-full">
            <DollarSign className="w-8 h-8 text-[#292A2D]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#292A2D]">
              {t("paymentUpload.title")}
            </h1>
            <p className="text-gray-600 mt-1">
              {t("paymentUpload.description")}
            </p>
          </div>
        </div>

        <div className="mb-6 bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg">
          <div className="flex">
            <AlertCircle className="h-6 w-6 text-amber-500" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800">
                {t("paymentUpload.important")}
              </h3>
              <p className="text-sm text-amber-700 mt-1">
                {t("paymentUpload.warning")}
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowTips(!showTips)}
          className="w-full mb-6 flex items-center justify-between p-4 bg-blue-50 rounded-xl text-blue-700 hover:bg-blue-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            <span className="font-medium">{t("paymentUpload.showExamples")}</span>
          </div>
          <span className="text-sm">{showTips ? t("common.hide") : t("common.show")}</span>
        </button>

        {showTips && (
          <div className="mb-6 bg-blue-50 p-6 rounded-xl space-y-4">
            <h3 className="font-medium text-blue-900">{t("paymentUpload.examples.title")}</h3>
            <ul className="list-disc list-inside space-y-3 text-sm text-blue-800">
              {/*@ts-ignore */}
              {t("paymentUpload.examples.list", { returnObjects: true }).map((example, index) => (
                <li key={index} className="pl-2">{example}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <MultiFileUploadComponent
            files={files}
            setFiles={setFiles}
            setError={setError}
            label="Payment"
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
            {t("paymentUpload.continue")}
            <ChevronRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentUpload;