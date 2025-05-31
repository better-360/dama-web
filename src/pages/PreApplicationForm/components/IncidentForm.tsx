import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, HelpCircle, ChevronRight, Loader } from "lucide-react";
import { updatePreApplicationSection } from "../../../http/requests/applicator";
import MultiFileUploadComponent from "../../../components/MultipleFileUpload";
import { uploadFileToS3 } from "../../../utils/firebase";
import { usePreApplication } from "../context/PreApplicationContext";

interface IncidentFormProps {
  onBack: () => void;
  onContinue: () => void;
}

const IncidentForm: React.FC<IncidentFormProps> = ({ onBack, onContinue }) => {
  const { t } = useTranslation();
  const { state, actions } = usePreApplication();
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showTips, setShowTips] = useState(false);
  const [saving, setSaving] = useState(false);

  const folder = "incident-files";

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
    if (state.incidentDescription.trim().length === 0 || state.incidentDescription.trim().length >= 10) {
      await handleSaveStep2();
    }
  };

  const handleSaveStep2 = async () => {
    setSaving(true);
    let incidentFileUrls: string[] = [...state.incidentFiles];
    
    try {
      // Upload new files if any
      if (files.length > 0) {
        const newUploadedUrls = await handleUploadAll();
        incidentFileUrls = [...incidentFileUrls, ...newUploadedUrls];
        actions.setIncidentFiles(incidentFileUrls);
      }

      const data = {
        step: 2,
        section: "incident",
        data: {
          incidentDescription: state.incidentDescription,
          incidentFiles: incidentFileUrls.length > 0 ? incidentFileUrls : null,
        },
      };
      
      console.log("Saving incident data with files:", data);
      await updatePreApplicationSection(data);
      
      onContinue();
    } catch (error) {
      console.error("Error saving incident data:", error);
      setError("Formunuz kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setSaving(false);
    }
  };

  const isValidDescription = (text: string) => {
    const trimmedText = text.trim();
    return trimmedText.length === 0 || trimmedText.length >= 10;
  };

  return (
    <div className="min-h-screen bg-[#E2E0D6] flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-lg p-6 sm:p-8 my-8">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-[#292A2D] transition-colors mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
          {t("incidentForm.back")}
        </button>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#292A2D] mb-3">
            {t("incidentForm.title")}
          </h1>
          <p className="text-gray-600">{t("incidentForm.description")}</p>
        </div>
        <p className="text-gray-600 mb-4 text-sm">{t("incidentForm.uploadDescription")}</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <div className="flex justify-between items-center mb-2">
              <label
                htmlFor="incident"
                className="block text-sm font-medium text-gray-700"
              >
                {t("incidentForm.label")}
              </label>
              <button
                type="button"
                onClick={() => setShowTips(!showTips)}
                className="text-sm text-[#292A2D] hover:text-opacity-70 flex items-center gap-1"
              >
                <HelpCircle className="w-4 h-4" />
                {t("incidentForm.showTips")}
              </button>
            </div>

            {showTips && (
              <div className="mb-4 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                <h3 className="font-medium text-blue-800 mb-2">
                  {t("incidentForm.tipsTitle")}
                </h3>
                <ul className="list-disc list-inside space-y-2 text-sm text-blue-700">
                  {/*@ts-ignore */}
                  {t("incidentForm.tips", { returnObjects: true }).map(
                    (tip:string, index:number) => (
                      <li key={index}>{tip}</li>
                    )
                  )}
                </ul>
              </div>
            )}

            <textarea
              id="incident"
              value={state.incidentDescription}
              onChange={(e) => actions.setIncidentDescription(e.target.value)}
              className={`w-full h-64 p-4 border-2 rounded-xl transition-colors resize-none ${
                state.incidentDescription.trim().length > 0 && !isValidDescription(state.incidentDescription)
                  ? "border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  : "border-gray-200 focus:border-[#292A2D] focus:ring-1 focus:ring-[#292A2D]"
              }`}
              placeholder={t("incidentForm.placeholder")}
            />

            <div className="flex justify-between items-center mt-2">
              <span className={`text-sm ${
                state.incidentDescription.trim().length > 0 && !isValidDescription(state.incidentDescription)
                  ? "text-red-500"
                  : "text-gray-500"
              }`}>
                {state.incidentDescription.trim().length > 0
                  ? state.incidentDescription.trim().length < 10
                    ? t("incidentForm.minCharsWarning")
                    : t("incidentForm.minChars")
                  : t("incidentForm.optional")}
              </span>
              <span className={`text-sm ${
                state.incidentDescription.trim().length > 0 && !isValidDescription(state.incidentDescription)
                  ? "text-red-500"
                  : "text-gray-500"
              }`}>
                {state.incidentDescription.length} {state.incidentDescription.trim().length > 0 ? "/ 10" : ""}
              </span>
            </div>
          </div>

          

          <MultiFileUploadComponent
            files={files}
            setFiles={setFiles}
            setError={setError}
            fileUrls={state.incidentFiles}
            onRemoveUploadedFile={(index: number) => {
              const updatedFiles = state.incidentFiles.filter((_, i) => i !== index);
              actions.setIncidentFiles(updatedFiles);
            }}
            label="Incident Files"
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
            disabled={state.incidentDescription.trim().length > 0 && !isValidDescription(state.incidentDescription) || saving}
            className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-medium text-lg
              ${
                (state.incidentDescription.trim().length === 0 || state.incidentDescription.trim().length >= 10) && !saving
                  ? "bg-[#292A2D] text-white hover:bg-opacity-90 transform hover:scale-[1.02] active:scale-[0.98]"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              } transition-all duration-300`}
          >
            {saving && <Loader className="w-4 h-4 mr-2 animate-spin" />}
            {saving ? t("common.saving") : t("incidentForm.continue")}
            {!saving && <ChevronRight className="w-5 h-5" />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default IncidentForm;
