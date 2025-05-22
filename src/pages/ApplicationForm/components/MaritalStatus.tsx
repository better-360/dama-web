import React from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, Users, Plus, X } from 'lucide-react';
import DatePicker from "react-datepicker";

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

interface MaritalStatusProps {
  formData: MaritalData;
  updateFormData: (data: Partial<MaritalData>) => void;
  onComplete: () => void;
  onBack: () => void;
}

const MaritalStatus: React.FC<MaritalStatusProps> = ({
  formData,
  updateFormData,
  onComplete,
  onBack,
}) => {
  const { t } = useTranslation();
  
  // Update a single field in the formData
  const updateField = <K extends keyof MaritalData>(field: K, value: MaritalData[K]) => {
    updateFormData({ [field]: value });
  };

  // Add a new child to the children array
  const addChild = () => {
    const newChildren = [
      ...formData.children,
      { id: Date.now().toString(), name: '', birthDate: '' }
    ];
    updateField('children', newChildren);
  };

  // Update a specific child's field
  const updateChild = (id: string, field: keyof Child, value: string) => {
    const updatedChildren = formData.children.map(child => 
      child.id === id ? { ...child, [field]: value } : child
    );
    updateField('children', updatedChildren);
  };

  // Remove a child from the children array
  const removeChild = (id: string) => {
    const filteredChildren = formData.children.filter(child => child.id !== id);
    updateField('children', filteredChildren);
  };

  const handleContinue = () => {
    onComplete();
  };
  
  const isFormValid = () => {
    return true; // No validation required
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
          <Users className="w-12 h-12 text-[#292A2D]" />
        </div>

        <h1 className="text-3xl font-bold text-center text-[#292A2D] mb-2">
          {t('maritalStatus.title')}
        </h1>
        <p className="text-center text-gray-600 mb-8">
          {t('maritalStatus.subtitle')}
        </p>

        <div className="space-y-6">
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('maritalStatus.status')}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => updateField('maritalStatus', 'single')}
                className={`p-4 rounded-xl font-medium transition-all duration-200 ${
                  formData.maritalStatus === 'single'
                    ? 'bg-[#292A2D] text-white'
                    : 'bg-gray-50 hover:bg-gray-100 text-[#292A2D]'
                }`}
              >
                {t('maritalStatus.single')}
              </button>
              <button
                onClick={() => updateField('maritalStatus', 'married')}
                className={`p-4 rounded-xl font-medium transition-all duration-200 ${
                  formData.maritalStatus === 'married'
                    ? 'bg-[#292A2D] text-white'
                    : 'bg-gray-50 hover:bg-gray-100 text-[#292A2D]'
                }`}
              >
                {t('maritalStatus.married')}
              </button>
            </div>
          </div>

          {formData.maritalStatus === 'married' && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                {t('maritalStatus.spouseName')}
              </label>
              <input
                type="text"
                value={formData.spouseName}
                onChange={(e) => updateField('spouseName', e.target.value)}
                className="w-full p-4 rounded-xl border border-gray-300 focus:border-[#292A2D] focus:ring-1 focus:ring-[#292A2D] transition-all"
                placeholder={t('maritalStatus.spouseNamePlaceholder')}
              />
            </div>
          )}

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('maritalStatus.hasChildren')}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => updateField('hasChildren', true)}
                className={`p-4 rounded-xl font-medium transition-all duration-200 ${
                  formData.hasChildren === true
                    ? 'bg-[#292A2D] text-white'
                    : 'bg-gray-50 hover:bg-gray-100 text-[#292A2D]'
                }`}
              >
                {t('common.yes')}
              </button>
              <button
                onClick={() => updateField('hasChildren', false)}
                className={`p-4 rounded-xl font-medium transition-all duration-200 ${
                  formData.hasChildren === false
                    ? 'bg-[#292A2D] text-white'
                    : 'bg-gray-50 hover:bg-gray-100 text-[#292A2D]'
                }`}
              >
                {t('common.no')}
              </button>
            </div>
          </div>

          {formData.hasChildren && (
            <div className="space-y-4">
              {formData.children.map((child) => (
                <div
                  key={child.id}
                  className="p-4 bg-gray-50 rounded-xl space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-[#292A2D]">
                      {t('maritalStatus.childInfo')}
                    </h3>
                    <button
                      onClick={() => removeChild(child.id)}
                      className="text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={child.name}
                    onChange={(e) =>
                      updateChild(child.id, 'name', e.target.value)
                    }
                    className="w-full p-3 rounded-lg border border-gray-300 focus:border-[#292A2D] focus:ring-1 focus:ring-[#292A2D] transition-all"
                    placeholder={t('maritalStatus.childNamePlaceholder')}
                  />
                  <DatePicker
                    selected={child.birthDate ? new Date(child.birthDate) : null}
                    onChange={(date) =>
                      updateChild(child.id, 'birthDate', date ? date.toISOString().split('T')[0] : '')
                    }
                    dateFormat="yyyy-MM-dd"
                    className="w-full p-3 rounded-lg border border-gray-300 focus:border-[#292A2D] focus:ring-1 focus:ring-[#292A2D] transition-all"
                    placeholderText={t('maritalStatus.childBirthDatePlaceholder')}
                    maxDate={new Date()}
                  />
                </div>
              ))}
              <button
                onClick={addChild}
                className="w-full p-4 rounded-xl border-2 border-dashed border-gray-300 text-gray-600 hover:border-[#292A2D] hover:text-[#292A2D] transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                {t('maritalStatus.addChild')}
              </button>
            </div>
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

export default MaritalStatus;