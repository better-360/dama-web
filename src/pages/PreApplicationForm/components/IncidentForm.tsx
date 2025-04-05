import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, HelpCircle, ChevronRight } from "lucide-react";
import { updatePreApplicationSection } from "../../../http/requests/applicator";

interface IncidentFormProps {
  onBack: () => void;
  onContinue: (description: string) => void;
}

const IncidentForm: React.FC<IncidentFormProps> = ({ onBack, onContinue }) => {
  const { t } = useTranslation();
  const [description, setDescription] = useState("");
  const [showTips, setShowTips] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (description.trim().length >= 100) {
      handleSaveStep2();
      onContinue(description);
    }
  };

  const handleSaveStep2 = async () => {
    const data = {
      step: 2,
      section: "incident",
      data: {
        incidentDescription: description,
      },
    };
    await updatePreApplicationSection(data);
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full h-64 p-4 border-2 border-gray-200 rounded-xl focus:border-[#292A2D] focus:ring-1 focus:ring-[#292A2D] transition-colors resize-none"
              placeholder={t("incidentForm.placeholder")}
            />

            <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
              <span>{t("incidentForm.minChars")}</span>
              <span>{description.length} / 100</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={description.trim().length < 100}
            className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-medium text-lg
              ${
                description.trim().length >= 100
                  ? "bg-[#292A2D] text-white hover:bg-opacity-90 transform hover:scale-[1.02] active:scale-[0.98]"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              } transition-all duration-300`}
          >
            {t("incidentForm.continue")}
            <ChevronRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default IncidentForm;
