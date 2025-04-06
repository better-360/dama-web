import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, ClipboardList, Pencil } from 'lucide-react';

interface Child {
  id: string;
  name: string;
  birthDate: string;
}

interface MaritalData {
  maritalStatus: 'single' | 'married' | null;
  spouseName: string;
  hasChildren: boolean | null;
  children: Child[];
}

interface EmploymentData {
  employerName: string;
  position: string;
  salary: string;
  startDate: string;
  hasContract: boolean | null;
  contractFile: string|undefined;
  isContractor: boolean;
  totalCompensation: string;
  isMultiplePayments: boolean;
}

interface WorkConditionsData {
  dailyHours: string;
  weeklyDays: string;
  supervisorName: string;
  lastWorkDate: string;
  bases: string;
}

interface PostEmploymentData {
  hasWorked: boolean | null;
  previousJobs: any[];
  isCurrentlyWorking: boolean | null;
}

interface EvidenceWitnessData {
  hasWitnesses: boolean | null;
  witnesses: any[];
  evidenceLinks: any[];
}

interface ApplicationData {
  marital: MaritalData;
  employment: EmploymentData;
  workConditions: WorkConditionsData;
  postEmployment: PostEmploymentData;
  evidenceWitness: EvidenceWitnessData;
}

interface SummaryProps {
  applicationData: ApplicationData;
  onComplete: () => void;
  onEdit: (step: 'language' | 'auth' | 'marital' | 'employment' | 'workConditions' | 'postEmployment' | 'evidenceWitness') => void;
  onBack: () => void;
}

const Summary: React.FC<SummaryProps> = ({ 
  applicationData, 
  onComplete, 
  onEdit, 
  onBack 
}) => {
  const { t } = useTranslation();
  
  // Function to format value based on field type
  const formatValue = (value: any): string => {
    if (value === true) return t('common.yes');
    if (value === false) return t('common.no');
    if (value === null || value === undefined || value === '') return '-';
    return String(value);
  };

  // Section definitions with their data mapping functions
  const sectionDefinitions = [
    {
      id: 'marital',
      title: t('summary.sections.marital.title'),
      getData: () => {
        const data = applicationData.marital;
        return [
          { label: t('maritalStatus.status'), value: formatValue(data.maritalStatus) },
          { label: t('maritalStatus.spouseName'), value: formatValue(data.spouseName) },
          { label: t('maritalStatus.hasChildren'), value: formatValue(data.hasChildren) },
          { label: t('maritalStatus.childrenCount'), value: data.children?.length ? String(data.children.length) : '0' },
        ];
      }
    },
    {
      id: 'employment',
      title: t('summary.sections.employments.title'),
      getData: () => {
        const data = applicationData.employment;
        return [
          { label: t('employment.employerName'), value: formatValue(data.employerName) },
          { label: t('employment.position'), value: formatValue(data.position) },
          { label: t('employment.salary'), value: formatValue(data.salary) },
          { label: t('employment.startDate'), value: formatValue(data.startDate) },
          { label: t('employment.hasContract'), value: formatValue(data.hasContract) },
          { label: t('employment.isContractor'), value: formatValue(data.isContractor) },
          { label: t('employment.totalCompensation'), value: formatValue(data.totalCompensation) },
        ];
      }
    },
    {
      id: 'workConditions',
      title: t('summary.sections.workConditions.title'),
      getData: () => {
        const data = applicationData.workConditions;
        return [
          { label: t('workConditions.dailyHours'), value: formatValue(data.dailyHours) },
          { label: t('workConditions.weeklyDays'), value: formatValue(data.weeklyDays) },
          { label: t('workConditions.supervisor'), value: formatValue(data.supervisorName) },
          { label: t('workConditions.lastWorkDate'), value: formatValue(data.lastWorkDate) },
          { label: t('workConditions.bases'), value: formatValue(data.bases) },
        ];
      }
    },
    {
      id: 'postEmployment',
      title: t('summary.sections.postEmployment.title'),
      getData: () => {
        const data = applicationData.postEmployment;
        return [
          { label: t('postEmployment.hasWorked'), value: formatValue(data.hasWorked) },
          { label: t('postEmployment.currentEmployment.isWorking'), value: formatValue(data.isCurrentlyWorking) },
          { label: t('postEmployment.previousJobs'), value: data.previousJobs?.length ? `${data.previousJobs.length} iş` : '-' },
        ];
      }
    },
    {
      id: 'evidenceWitness',
      title: t('summary.sections.evidenceWitness.title'),
      getData: () => {
        const data = applicationData.evidenceWitness;
        return [
          { label: t('evidenceWitness.witnesses.hasWitnesses'), value: formatValue(data.hasWitnesses) },
          { label: t('evidenceWitness.witnesses.count'), value: data.witnesses?.length ? String(data.witnesses.length) : '0' },
          { label: t('evidenceWitness.evidenceLinks.count'), value: data.evidenceLinks?.length ? String(data.evidenceLinks.length) : '0' },
        ];
      }
    },
  ];

  return (
    <div className="min-h-screen bg-[#E2E0D6] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl w-full">
        <button
          onClick={onBack}
          className="text-[#292A2D] mb-6 flex items-center gap-1 hover:opacity-80 transition-opacity"
        >
          <ChevronLeft className="w-5 h-5" />
          {t('common.back')}
        </button>

        <div className="flex items-center justify-center mb-6">
          <ClipboardList className="w-12 h-12 text-[#292A2D]" />
        </div>

        <h1 className="text-3xl font-bold text-center text-[#292A2D] mb-2">
          {t('summary.title')}
        </h1>
        <p className="text-center text-gray-600 mb-8">
          {t('summary.subtitle')}
        </p>

        <div className="space-y-6">
          {sectionDefinitions.map((section) => {
            const sectionData = section.getData();
            
            return (
              <div
                key={section.id}
                className="bg-gray-50 rounded-xl p-6 relative"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-[#292A2D]">
                    {section.title}
                  </h2>
                  <button
                    onClick={() => onEdit(section.id as any)}
                    className="text-[#292A2D] hover:opacity-80 transition-opacity flex items-center gap-2"
                  >
                    <Pencil className="w-4 h-4" />
                    {t('summary.edit')}
                  </button>
                </div>
                <div className="space-y-3">
                  {sectionData.length > 0 ? (
                    sectionData.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-gray-600">{item.label}</span>
                        <span className="font-medium text-[#292A2D]">
                          {item.value}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 text-center py-2">
                      {t('common.noData', 'No data available')}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          <button
            onClick={onComplete}
            className="w-full bg-[#292A2D] text-white py-4 rounded-xl font-medium hover:bg-opacity-90 transition-all duration-200"
          >
            {t('summary.submit')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Summary;