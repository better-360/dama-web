import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle } from 'lucide-react';
import { getApplicationData } from '../../../http/requests/applicator';

const SubmissionComplete: React.FC = () => {
  const { t } = useTranslation();
  const [appNumber, setAppNumber] = React.useState<string | null>(null);
const [loading, setLoading] = React.useState(true);

  const fetchApplicationData = async () => {
    try {
      setLoading(true);
      const response = await getApplicationData();  
      console.log('Application data:', response);
      console.log('Application number:', response[0].applicationNumber);
      const applicationNo=response[0].applicationNumber;
      setAppNumber(applicationNo);
    } catch (error) {
      console.error('Error fetching application data:', error);
    } finally {
      setLoading(false);
    }
  }; 

  useEffect(() => {
    fetchApplicationData();
  }
  , []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">{t('loading')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E2E0D6] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="flex items-center justify-center mb-6">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>

        <h1 className="text-3xl font-bold text-[#292A2D] mb-4">
          {t('submissionComplete.title')}
        </h1>
        <p className="text-gray-600 mb-8">
          {t('submissionComplete.message')}
        </p>

        <div className="p-4 bg-gray-50 rounded-xl mb-8">
          <p className="text-sm text-gray-600">
            {t('submissionComplete.nextSteps')}
          </p>
        </div>

        <p className="text-sm text-gray-500">
          {t('submissionComplete.reference')}
          <span className="font-medium text-[#292A2D] ml-2">
            {appNumber}
          </span>
        </p>
      </div>
    </div>
  );
};

export default SubmissionComplete;