import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, Users, Plus, X } from 'lucide-react';
import { updateApplicationSection } from '../../../http/requests/applicator';

interface Child {
  id: string;
  name: string;
  birthDate: string;
}

interface MaritalStatusProps {
  onComplete: () => void;
  onBack: () => void;
}

const MaritalStatus: React.FC<MaritalStatusProps> = ({
  onComplete,
  onBack,
}) => {
  const { t } = useTranslation();
  const [maritalStatus, setMaritalStatus] = useState<
    'single' | 'married' | null
  >(null);
  const [spouseName, setSpouseName] = useState('');
  const [hasChildren, setHasChildren] = useState<boolean | null>(null);
  const [children, setChildren] = useState<Child[]>([]);

  const addChild = () => {
    setChildren([
      ...children,
      { id: Date.now().toString(), name: '', birthDate: '' },
    ]);
  };

  const updateChild = (id: string, field: keyof Child, value: string) => {
    setChildren(
      children.map((child) =>
        child.id === id ? { ...child, [field]: value } : child
      )
    );
  };

  const removeChild = (id: string) => {
    setChildren(children.filter((child) => child.id !== id));
  };

  const handleContinue = () => {
    if (
      maritalStatus === 'single' ||
      (maritalStatus === 'married' && spouseName)
    ) {
      if (
        hasChildren === false ||
        (hasChildren === true && children.length > 0)
      ) {
        handleSaveStep1();
        onComplete();
      }
    }
  };

  const handleSaveStep1 = async () => {
    const data = {
      step: 1,
      section: "marital",
      data: {
        children: children,
        spouseName: spouseName,
        hasChildren: hasChildren,
        maritalStatus: maritalStatus,
      },
    };
    await updateApplicationSection(data);
  };
  

  const isFormValid = () => {
    if (!maritalStatus) return false;
    if (maritalStatus === 'married' && !spouseName) return false;
    if (hasChildren === null) return false;
    if (hasChildren && children.length === 0) return false;
    if (
      hasChildren &&
      children.some((child) => !child.name || !child.birthDate)
    )
      return false;
    return true;
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
                onClick={() => setMaritalStatus('single')}
                className={`p-4 rounded-xl font-medium transition-all duration-200 ${
                  maritalStatus === 'single'
                    ? 'bg-[#292A2D] text-white'
                    : 'bg-gray-50 hover:bg-gray-100 text-[#292A2D]'
                }`}
              >
                {t('maritalStatus.single')}
              </button>
              <button
                onClick={() => setMaritalStatus('married')}
                className={`p-4 rounded-xl font-medium transition-all duration-200 ${
                  maritalStatus === 'married'
                    ? 'bg-[#292A2D] text-white'
                    : 'bg-gray-50 hover:bg-gray-100 text-[#292A2D]'
                }`}
              >
                {t('maritalStatus.married')}
              </button>
            </div>
          </div>

          {maritalStatus === 'married' && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                {t('maritalStatus.spouseName')}
              </label>
              <input
                type="text"
                value={spouseName}
                onChange={(e) => setSpouseName(e.target.value)}
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
                onClick={() => setHasChildren(true)}
                className={`p-4 rounded-xl font-medium transition-all duration-200 ${
                  hasChildren === true
                    ? 'bg-[#292A2D] text-white'
                    : 'bg-gray-50 hover:bg-gray-100 text-[#292A2D]'
                }`}
              >
                {t('common.yes')}
              </button>
              <button
                onClick={() => setHasChildren(false)}
                className={`p-4 rounded-xl font-medium transition-all duration-200 ${
                  hasChildren === false
                    ? 'bg-[#292A2D] text-white'
                    : 'bg-gray-50 hover:bg-gray-100 text-[#292A2D]'
                }`}
              >
                {t('common.no')}
              </button>
            </div>
          </div>

          {hasChildren && (
            <div className="space-y-4">
              {children.map((child) => (
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
                  <input
                    type="date"
                    value={child.birthDate}
                    onChange={(e) =>
                      updateChild(child.id, 'birthDate', e.target.value)
                    }
                    className="w-full p-3 rounded-lg border border-gray-300 focus:border-[#292A2D] focus:ring-1 focus:ring-[#292A2D] transition-all"
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
