import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, Briefcase, Plus, X, Calendar, MapPin, Users } from 'lucide-react';
import DatePicker from "react-datepicker";
import { useApplication } from '../context/ApplicationContext';
import { updateApplicationSection } from '../../../http/requests/applicator';

interface PreviousJob {
  id: string;
  companyName: string;
  position: string;
  startDate: string;
  endDate: string;
  reason: string;
}

interface PostEmploymentData {
  hasWorked: boolean | null;
  previousJobs: PreviousJob[];
  isCurrentlyWorking: boolean | null;
  currentCompany?: string;
  currentSalary?: string;
  lastSalary?: string;
}

interface PostEmploymentProps {
  onComplete: () => void;
  onBack: () => void;
}

const PostEmployment: React.FC<PostEmploymentProps> = ({
  onComplete,
  onBack,
}) => {
  const { t } = useTranslation();
  const { state, actions } = useApplication();
  const formData = state.postEmployment;

  const addJob = () => {
    const newJob = {
      id: Date.now().toString(),
      companyName: '',
      position: '',
      startDate: '',
      endDate: '',
      reason: ''
    };
    const newJobs = [...formData.previousJobs, newJob];
    actions.setPostEmployment({ previousJobs: newJobs });
  };

  const updateJob = (id: string, field: string, value: string) => {
    const updatedJobs = formData.previousJobs.map((job: any) => 
      job.id === id ? { ...job, [field]: value } : job
    );
    actions.setPostEmployment({ previousJobs: updatedJobs });
  };

  const removeJob = (id: string) => {
    const filteredJobs = formData.previousJobs.filter((job: any) => job.id !== id);
    actions.setPostEmployment({ previousJobs: filteredJobs });
  };

  const isFormValid = () => {
    return true; // No validation required
  };

  const handleContinue = async () => {
    try {
      const sectionData = {
        step: 4,
        section: "postEmployment",
        data: formData,
      };

      console.log("Saving post employment data:", sectionData);
      await updateApplicationSection(sectionData);
      onComplete();
    } catch (error) {
      console.error("Error saving post employment data:", error);
      // Handle error appropriately
    }
  };

  return (
    <div className="min-h-screen bg-[#E2E0D6] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        <button 
          onClick={onBack}
          className="text-[#292A2D] mb-6 flex items-center gap-1 hover:opacity-80 transition-opacity"
        >
          <ChevronLeft className="w-5 h-5" />
          {t('common.back')}
        </button>

        <div className="flex items-center justify-center mb-6">
          <Briefcase className="w-12 h-12 text-[#292A2D]" />
        </div>

        <h1 className="text-3xl font-bold text-center text-[#292A2D] mb-2">
          {t('postEmployment.title')}
        </h1>
        <p className="text-center text-gray-600 mb-8">
          {t('postEmployment.subtitle')}
        </p>

        <div className="space-y-6">
          {/* Has Worked After Return */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              {t('postEmployment.hasWorked')}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => actions.setPostEmployment({ hasWorked: true })}
                className={`p-4 rounded-xl font-medium transition-all duration-200 ${
                  formData.hasWorked === true
                    ? 'bg-[#292A2D] text-white'
                    : 'bg-gray-50 hover:bg-gray-100 text-[#292A2D]'
                }`}
              >
                {t('common.yes')}
              </button>
              <button
                type="button"
                onClick={() => actions.setPostEmployment({ hasWorked: false })}
                className={`p-4 rounded-xl font-medium transition-all duration-200 ${
                  formData.hasWorked === false
                    ? 'bg-[#292A2D] text-white'
                    : 'bg-gray-50 hover:bg-gray-100 text-[#292A2D]'
                }`}
              >
                {t('common.no')}
              </button>
            </div>
          </div>

          {/* Previous Jobs */}
          {formData.hasWorked && (
            <>
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-[#292A2D]">
                  {t('postEmployment.previousEmployment.title')}
                </h2>

                {formData.previousJobs.map((job) => (
                  <div key={job.id} className="p-4 bg-gray-50 rounded-xl space-y-3">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium text-[#292A2D]">
                        {t('postEmployment.previousEmployment.title')}
                      </h3>
                      <button
                        onClick={() => removeJob(job.id)}
                        className="text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={job.companyName}
                      onChange={(e) => updateJob(job.id, 'companyName', e.target.value)}
                      placeholder={t('postEmployment.previousEmployment.companyName')}
                      className="w-full p-3 rounded-lg border border-gray-300 focus:border-[#292A2D] focus:ring-1 focus:ring-[#292A2D] transition-all"
                    />

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          {t('postEmployment.previousEmployment.startDate')}
                        </label>
                        <input
                          type="date"
                          value={job.startDate}
                          onChange={(e) => updateJob(job.id, 'startDate', e.target.value)}
                          className="w-full p-3 rounded-lg border border-gray-300 focus:border-[#292A2D] focus:ring-1 focus:ring-[#292A2D] transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          {t('postEmployment.previousEmployment.endDate')}
                        </label>
                        <input
                          type="date"
                          value={job.endDate}
                          onChange={(e) => updateJob(job.id, 'endDate', e.target.value)}
                          className="w-full p-3 rounded-lg border border-gray-300 focus:border-[#292A2D] focus:ring-1 focus:ring-[#292A2D] transition-all"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={addJob}
                  className="w-full p-4 rounded-xl border-2 border-dashed border-gray-300 text-gray-600 hover:border-[#292A2D] hover:text-[#292A2D] transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  {t('postEmployment.previousEmployment.add')}
                </button>
              </div>

              {/* Current Employment Status */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-[#292A2D]">
                  {t('postEmployment.currentEmployment.title')}
                </h2>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('postEmployment.currentEmployment.isWorking')}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => actions.setPostEmployment({ isCurrentlyWorking: true })}
                      className={`p-4 rounded-xl font-medium transition-all duration-200 ${
                        formData.isCurrentlyWorking === true
                          ? 'bg-[#292A2D] text-white'
                          : 'bg-gray-50 hover:bg-gray-100 text-[#292A2D]'
                      }`}
                    >
                      {t('common.yes')}
                    </button>
                    <button
                      type="button"
                      onClick={() => actions.setPostEmployment({ isCurrentlyWorking: false })}
                      className={`p-4 rounded-xl font-medium transition-all duration-200 ${
                        formData.isCurrentlyWorking === false
                          ? 'bg-[#292A2D] text-white'
                          : 'bg-gray-50 hover:bg-gray-100 text-[#292A2D]'
                      }`}
                    >
                      {t('common.no')}
                    </button>
                  </div>
                </div>

                {formData.isCurrentlyWorking && (
                  <div className="space-y-3">
                    <input
                      type="text"
                      name="currentCompany"
                      value={formData.currentCompany || ''}
                      onChange={(e) => actions.setPostEmployment({ currentCompany: e.target.value })}
                      placeholder={t('postEmployment.currentEmployment.companyName')}
                      className="w-full p-4 rounded-xl border border-gray-300 focus:border-[#292A2D] focus:ring-1 focus:ring-[#292A2D] transition-all"
                    />

                    <div className="relative">
                      <input
                        type="number"
                        name="currentSalary"
                        value={formData.currentSalary || ''}
                        onChange={(e) => actions.setPostEmployment({ currentSalary: e.target.value })}
                        placeholder={t('postEmployment.currentEmployment.currentSalary')}
                        className="w-full p-4 rounded-xl border border-gray-300 focus:border-[#292A2D] focus:ring-1 focus:ring-[#292A2D] transition-all pl-12"
                      />
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    </div>
                  </div>
                )}

                {formData.isCurrentlyWorking === false && (
                  <div className="relative">
                    <input
                      type="number"
                      name="lastSalary"
                      value={formData.lastSalary || ''}
                      onChange={(e) => actions.setPostEmployment({ lastSalary: e.target.value })}
                      placeholder={t('postEmployment.currentEmployment.lastSalary')}
                      className="w-full p-4 rounded-xl border border-gray-300 focus:border-[#292A2D] focus:ring-1 focus:ring-[#292A2D] transition-all pl-12"
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  </div>
                )}
              </div>
            </>
          )}

          <button
            onClick={handleContinue}
            disabled={!isFormValid()}
            className="w-full bg-[#292A2D] text-white py-4 rounded-xl font-medium hover:bg-opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('common.continue')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostEmployment;