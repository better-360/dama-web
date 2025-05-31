import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, CheckCircle, Edit, ChevronRight } from 'lucide-react';
import { useApplication } from '../context/ApplicationContext';

type FormStep = "marital" | "employment" | "workConditions" | "postEmployment" | "evidenceWitness";

interface SummaryProps {
  onComplete: () => Promise<void>;
  onEdit: (step: FormStep) => void;
  onBack: () => void;
}

const Summary: React.FC<SummaryProps> = ({
  onComplete,
  onEdit,
  onBack,
}) => {
  const { t } = useTranslation();
  const { state } = useApplication();

  const renderSection = (
    title: string,
    editStep: FormStep,
    children: React.ReactNode
  ) => (
    <div className="bg-gray-50 rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-[#292A2D]">{title}</h3>
        <button
          onClick={() => onEdit(editStep)}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          <Edit className="w-4 h-4" />
          {t('summary.edit')}
        </button>
      </div>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#E2E0D6] flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-lg p-6 sm:p-8 my-8">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-[#292A2D] transition-colors mb-6 group"
        >
          <ChevronLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
          {t('summary.back')}
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex justify-center p-3 bg-[#292A2D] bg-opacity-5 rounded-full">
            <CheckCircle className="w-8 h-8 text-[#292A2D]" />
          </div>
          <h1 className="text-2xl font-bold text-[#292A2D] mt-4">
            {t('summary.title')}
          </h1>
          <p className="text-gray-600 mt-1">
            {t('summary.description')}
          </p>
        </div>

        <div className="space-y-6 mb-8">
          {renderSection(
            t('summary.sections.marital.title'),
            'marital',
            <div className="text-gray-600 space-y-2">
              <p>
                <span className="font-medium">{t('maritalStatus.status')}:</span>{' '}
                {state.marital.maritalStatus === 'married' 
                  ? t('maritalStatus.married') 
                  : state.marital.maritalStatus === 'single'
                  ? t('maritalStatus.single')
                  : t('common.notSpecified')}
              </p>
              {state.marital.maritalStatus === 'married' && state.marital.spouseName && (
                <p>
                  <span className="font-medium">{t('maritalStatus.spouseName')}:</span>{' '}
                  {state.marital.spouseName}
                </p>
              )}
              <p>
                <span className="font-medium">{t('maritalStatus.hasChildren')}:</span>{' '}
                {state.marital.hasChildren === true 
                  ? `${t('common.yes')} (${state.marital.children.length})` 
                  : state.marital.hasChildren === false
                  ? t('common.no')
                  : t('common.notSpecified')}
              </p>
            </div>
          )}

          {renderSection(
            t('summary.sections.employments.title'),
            'employment',
            <div className="text-gray-600 space-y-2">
              <p>
                <span className="font-medium">{t('employment.employerName')}:</span>{' '}
                {state.employment.employerName || t('common.notSpecified')}
              </p>
              <p>
                <span className="font-medium">{t('employment.position')}:</span>{' '}
                {state.employment.position || t('common.notSpecified')}
              </p>
              <p>
                <span className="font-medium">{t('employment.salary')}:</span>{' '}
                {state.employment.salary ? `$${state.employment.salary}` : t('common.notSpecified')}
              </p>
              <p>
                <span className="font-medium">{t('employment.hasContract')}:</span>{' '}
                {state.employment.hasContract === true 
                  ? t('common.yes')
                  : state.employment.hasContract === false
                  ? t('common.no')
                  : t('common.notSpecified')}
              </p>
            </div>
          )}

          {renderSection(
            t('summary.sections.workConditions.title'),
            'workConditions',
            <div className="text-gray-600 space-y-2">
              <p>
                <span className="font-medium">{t('workConditions.dailyHours')}:</span>{' '}
                {state.workConditions.dailyHours || t('common.notSpecified')}
              </p>
              <p>
                <span className="font-medium">{t('workConditions.weeklyDays')}:</span>{' '}
                {state.workConditions.weeklyDays || t('common.notSpecified')}
              </p>
              <p>
                <span className="font-medium">{t('workConditions.supervisor')}:</span>{' '}
                {state.workConditions.supervisorName || t('common.notSpecified')}
              </p>
            </div>
          )}

          {renderSection(
            t('summary.sections.postEmployment.title'),
            'postEmployment',
            <div className="text-gray-600 space-y-2">
              <p>
                <span className="font-medium">{t('postEmployment.hasWorked')}:</span>{' '}
                {state.postEmployment.hasWorked === true 
                  ? t('common.yes')
                  : state.postEmployment.hasWorked === false
                  ? t('common.no')
                  : t('common.notSpecified')}
              </p>
              {state.postEmployment.hasWorked && (
                <p>
                  <span className="font-medium">{t('postEmployment.previousJobs')}:</span>{' '}
                  {state.postEmployment.previousJobs.length} {t('common.jobs')}
                </p>
              )}
              <p>
                <span className="font-medium">{t('postEmployment.currentlyWorking')}:</span>{' '}
                {state.postEmployment.isCurrentlyWorking === true 
                  ? t('common.yes')
                  : state.postEmployment.isCurrentlyWorking === false
                  ? t('common.no')
                  : t('common.notSpecified')}
              </p>
            </div>
          )}

          {renderSection(
            t('summary.sections.evidenceWitness.title'),
            'evidenceWitness',
            <div className="text-gray-600 space-y-2">
              <p>
                <span className="font-medium">{t('evidenceWitness.witnesses.hasWitnesses')}:</span>{' '}
                {state.evidenceWitness.hasWitnesses === true 
                  ? `${t('common.yes')} (${state.evidenceWitness.witnesses.length})`
                  : state.evidenceWitness.hasWitnesses === false
                  ? t('common.no')
                  : t('common.notSpecified')}
              </p>
              <p>
                <span className="font-medium">{t('evidenceWitness.evidence.linkCount')}:</span>{' '}
                {state.evidenceWitness.evidenceLinks.length} {t('common.links')}
              </p>
            </div>
          )}
        </div>

        <button
          onClick={onComplete}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-medium text-lg
            bg-[#292A2D] text-white hover:bg-opacity-90 transform hover:scale-[1.02] active:scale-[0.98]
            transition-all duration-300"
        >
          {t('summary.submit')}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Summary;