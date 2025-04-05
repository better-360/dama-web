import { useTranslation } from "react-i18next";
import { Globe2, ChevronRight } from "lucide-react";
import { languages } from "../utils/languages";
import {setPreferredLanguage } from "../utils/storage";

interface LanguageSelectPageProps {
  setLang: (lang: string) => void;
}

const LanguageSeletPage = ({setLang}:LanguageSelectPageProps) => {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
  };

  const onContinue = () => {
    console.log("Continue");
    setLang(i18n.language)
    setPreferredLanguage(i18n.language);
  };

  return (
    <div className="min-h-screen bg-[#E2E0D6] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 my-8">
        <div className="flex items-center justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-[#292A2D] bg-opacity-5 rounded-full animate-pulse"></div>
            <Globe2 className="w-16 h-16 text-[#292A2D] relative z-10" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-[#292A2D] mb-3">
          {t("languageSelection.title")}
        </h1>

        <p className="text-center text-gray-600 mb-8">
          {t("languageSelection.subtitle")}
        </p>

        <div className="space-y-3 mb-8">
          {Object.entries(languages).map(([code, lang]) => (
            <button
              key={code}
              onClick={() => handleLanguageChange(code)}
              className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300 group
                ${
                  i18n.language === code
                    ? "bg-[#292A2D] text-white shadow-lg transform scale-[1.02]"
                    : "bg-white text-[#292A2D] border-2 border-[#292A2D] border-opacity-10 hover:border-opacity-20 hover:bg-gray-50"
                }`}
            >
              <div className="flex items-center">
                <span className="text-lg font-medium">{lang.nativeName}</span>
                {i18n.language === code && (
                  <span className="ml-2 text-sm bg-white bg-opacity-20 px-2 py-0.5 rounded-full">
                    {t("languageSelection.selected")}
                  </span>
                )}
              </div>
              <ChevronRight
                className={`w-5 h-5 transition-transform duration-300
                ${i18n.language === code ? "text-white" : "text-gray-400"}
                ${
                  i18n.language === code
                    ? "translate-x-0"
                    : "group-hover:translate-x-1"
                }`}
              />
            </button>
          ))}
        </div>

        <button
          onClick={onContinue}
          className="w-full bg-[#292A2D] text-white py-4 rounded-xl font-medium 
            hover:bg-opacity-90 transition-all duration-300 text-lg
            transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {t("languageSelection.continue")}
        </button>
      </div>
    </div>
  );
};

export default LanguageSeletPage;
