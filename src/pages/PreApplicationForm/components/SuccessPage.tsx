import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle } from 'lucide-react';

const SuccessPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#E2E0D6] flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6 sm:p-8 my-8 text-center">
        <div className="mb-6">
          <div className="inline-flex justify-center p-4 bg-green-100 rounded-full">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-[#292A2D] mb-4">
          {t('success.title')}
        </h1>
        
        <p className="text-gray-600 mb-8">
          {t('success.description')}
        </p>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg text-left">
          <p className="text-blue-800 text-sm">
            {t('success.note')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;