import React from 'react';
import { useTranslation } from 'react-i18next';
import { FileCheck, AlertCircle, ArrowLeft } from 'lucide-react';

interface RequirementsPageProps {
  onBack: () => void;
  onContinue: () => void;
}

const RequirementsPage: React.FC<RequirementsPageProps> = ({ onBack, onContinue }) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#E2E0D6] flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-6 sm:p-8 my-8">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-[#292A2D] transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          {t('requirements.back')}
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex justify-center p-3 bg-[#292A2D] bg-opacity-5 rounded-full">
            <FileCheck className="w-12 h-12 text-[#292A2D]" />
          </div>
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-[#292A2D] mb-4">
            {t('requirements.title')}
          </h1>
          <p className="text-gray-600">
            {t('requirements.description')}
          </p>
        </div>

        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-8">
          <div className="flex">
            <AlertCircle className="h-6 w-6 text-amber-500" />
            <div className="ml-3">
              <p className="text-sm text-amber-700">
                {t('requirements.warning')}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {/*@ts-ignore */}
          {t('applicationRequirements.documents', { returnObjects: true }).map((doc, index) => (
            <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border-2 border-[#292A2D] border-opacity-10">
              <div className="flex-shrink-0 w-8 h-8 bg-[#292A2D] bg-opacity-10 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-[#292A2D]">{index + 1}</span>
              </div>
              <div>
                <h3 className="font-medium text-[#292A2D] mb-1">{doc.title}</h3>
                <p className="text-sm text-gray-600">{doc.description}</p>
              </div>
            </div>
          ))}
        </div>

        

        <div className="space-y-4">
          <button
            onClick={onContinue}
            className="w-full bg-[#292A2D] text-white py-4 rounded-xl font-medium 
              hover:bg-opacity-90 transition-all duration-300 text-lg"
          >
            {t('requirements.continue')}
          </button>
          <p className="text-sm text-center text-gray-500">
            {t('requirements.note')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RequirementsPage;