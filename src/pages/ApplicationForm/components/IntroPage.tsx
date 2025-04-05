import React from 'react';
import { useTranslation } from 'react-i18next';
import { Scale, Shield } from 'lucide-react';

interface IntroPageProps {
  onComplete: () => void;
}

const IntroPage: React.FC<IntroPageProps> = ({ onComplete }) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#E2E0D6] flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6 sm:p-8 my-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-3">
            <Scale className="w-8 h-8 text-[#292A2D]" />
            <Shield className="w-8 h-8 text-[#292A2D]" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-center text-[#292A2D] mb-4">
          {t('intro.welcome')}
        </h1>

        <p className="text-center text-gray-600 mb-6">
          {t('intro.description')}
        </p>

        <div className="space-y-4 mb-8">
          <div className="p-4 bg-gray-50 rounded-xl border-2 border-[#292A2D] border-opacity-10">
            <h2 className="font-medium text-[#292A2D] mb-2">{t('intro.expertise')}</h2>
            <p className="text-sm text-gray-600">{t('intro.expertiseDesc')}</p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-xl border-2 border-[#292A2D] border-opacity-10">
            <h2 className="font-medium text-[#292A2D] mb-2">{t('intro.support')}</h2>
            <p className="text-sm text-gray-600">{t('intro.supportDesc')}</p>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={onComplete}
            className="w-full bg-[#292A2D] text-white py-4 rounded-xl font-medium 
              hover:bg-opacity-90 transition-all duration-300 text-lg"
          >
            {t('intro.start')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default IntroPage;