import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, FileText, Plus, X, Link as LinkIcon } from 'lucide-react';
import { updateApplicationSection } from '../../../http/requests/applicator';

interface Witness {
  id: string;
  firstName: string;
  lastName: string;
}

interface EvidenceLink {
  id: string;
  url: string;
  description: string;
}

interface EvidenceWitnessInfo {
  evidenceLinks: EvidenceLink[];
  hasWitnesses: boolean | null;
  witnesses: Witness[];
}

interface EvidenceWitnessProps {
  onComplete: () => void;
  onBack: () => void;
}

const EvidenceWitness: React.FC<EvidenceWitnessProps> = ({ onComplete, onBack }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<EvidenceWitnessInfo>({
    evidenceLinks: [],
    hasWitnesses: null,
    witnesses: [],
  });

  const addEvidenceLink = () => {
    setFormData(prev => ({
      ...prev,
      evidenceLinks: [
        ...prev.evidenceLinks,
        {
          id: Date.now().toString(),
          url: '',
          description: '',
        },
      ],
    }));
  };

  const updateEvidenceLink = (id: string, field: keyof EvidenceLink, value: string) => {
    setFormData(prev => ({
      ...prev,
      evidenceLinks: prev.evidenceLinks.map(link =>
        link.id === id ? { ...link, [field]: value } : link
      ),
    }));
  };

  const removeEvidenceLink = (id: string) => {
    setFormData(prev => ({
      ...prev,
      evidenceLinks: prev.evidenceLinks.filter(link => link.id !== id),
    }));
  };

  const addWitness = () => {
    setFormData(prev => ({
      ...prev,
      witnesses: [
        ...prev.witnesses,
        {
          id: Date.now().toString(),
          firstName: '',
          lastName: '',
        },
      ],
    }));
  };

  const updateWitness = (id: string, field: keyof Witness, value: string) => {
    setFormData(prev => ({
      ...prev,
      witnesses: prev.witnesses.map(witness =>
        witness.id === id ? { ...witness, [field]: value } : witness
      ),
    }));
  };

  const removeWitness = (id: string) => {
    setFormData(prev => ({
      ...prev,
      witnesses: prev.witnesses.filter(witness => witness.id !== id),
    }));
  };

  const isFormValid = () => {
    if (formData.hasWitnesses === null) return false;
    if (formData.hasWitnesses && formData.witnesses.length === 0) return false;
    if (formData.hasWitnesses && formData.witnesses.some(witness => !witness.firstName || !witness.lastName)) return false;
    if (formData.evidenceLinks.length > 0 && formData.evidenceLinks.some(link => !link.url)) return false;
    return true;
  };


  const handleSaveStep5 = async() => {
    const data = {
      step: 5,
      section: "evidenceWitness",
      data: formData,
    };
     await updateApplicationSection(data);
  };
  


  const handleContinue = () => {
    if (isFormValid()) {
      handleSaveStep5();
      onComplete();
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
          <FileText className="w-12 h-12 text-[#292A2D]" />
        </div>

        <h1 className="text-3xl font-bold text-center text-[#292A2D] mb-2">
          {t('evidenceWitness.title')}
        </h1>
        <p className="text-center text-gray-600 mb-8">
          {t('evidenceWitness.subtitle')}
        </p>

        <div className="space-y-6">
          {/* Evidence Links */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[#292A2D]">
              {t('evidenceWitness.evidence.title')}
            </h2>
            
            {formData.evidenceLinks.map((link) => (
              <div key={link.id} className="p-4 bg-gray-50 rounded-xl space-y-3">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <LinkIcon className="w-5 h-5 text-gray-500" />
                    <h3 className="font-medium text-[#292A2D]">
                      {t('evidenceWitness.evidence.linkTitle')}
                    </h3>
                  </div>
                  <button
                    onClick={() => removeEvidenceLink(link.id)}
                    className="text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <input
                  type="url"
                  value={link.url}
                  onChange={(e) => updateEvidenceLink(link.id, 'url', e.target.value)}
                  placeholder={t('evidenceWitness.evidence.urlPlaceholder')}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:border-[#292A2D] focus:ring-1 focus:ring-[#292A2D] transition-all"
                />

                <input
                  type="text"
                  value={link.description}
                  onChange={(e) => updateEvidenceLink(link.id, 'description', e.target.value)}
                  placeholder={t('evidenceWitness.evidence.descriptionPlaceholder')}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:border-[#292A2D] focus:ring-1 focus:ring-[#292A2D] transition-all"
                />
              </div>
            ))}

            <button
              onClick={addEvidenceLink}
              className="w-full p-4 rounded-xl border-2 border-dashed border-gray-300 text-gray-600 hover:border-[#292A2D] hover:text-[#292A2D] transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              {t('evidenceWitness.evidence.addLink')}
            </button>
          </div>

          {/* Witnesses */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[#292A2D]">
              {t('evidenceWitness.witnesses.title')}
            </h2>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                {t('evidenceWitness.witnesses.hasWitnesses')}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, hasWitnesses: true }))}
                  className={`p-4 rounded-xl font-medium transition-all duration-200 ${
                    formData.hasWitnesses === true
                      ? 'bg-[#292A2D] text-white'
                      : 'bg-gray-50 hover:bg-gray-100 text-[#292A2D]'
                  }`}
                >
                  {t('common.yes')}
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, hasWitnesses: false }))}
                  className={`p-4 rounded-xl font-medium transition-all duration-200 ${
                    formData.hasWitnesses === false
                      ? 'bg-[#292A2D] text-white'
                      : 'bg-gray-50 hover:bg-gray-100 text-[#292A2D]'
                  }`}
                >
                  {t('common.no')}
                </button>
              </div>
            </div>

            {formData.hasWitnesses && (
              <div className="space-y-4">
                {formData.witnesses.map((witness) => (
                  <div key={witness.id} className="p-4 bg-gray-50 rounded-xl space-y-3">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium text-[#292A2D]">
                        {t('evidenceWitness.witnesses.witnessInfo')}
                      </h3>
                      <button
                        onClick={() => removeWitness(witness.id)}
                        className="text-gray-500 hover:text-red-500 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={witness.firstName}
                        onChange={(e) => updateWitness(witness.id, 'firstName', e.target.value)}
                        placeholder={t('evidenceWitness.witnesses.firstName')}
                        className="w-full p-3 rounded-lg border border-gray-300 focus:border-[#292A2D] focus:ring-1 focus:ring-[#292A2D] transition-all"
                      />
                      <input
                        type="text"
                        value={witness.lastName}
                        onChange={(e) => updateWitness(witness.id, 'lastName', e.target.value)}
                        placeholder={t('evidenceWitness.witnesses.lastName')}
                        className="w-full p-3 rounded-lg border border-gray-300 focus:border-[#292A2D] focus:ring-1 focus:ring-[#292A2D] transition-all"
                      />
                    </div>
                  </div>
                ))}

                <button
                  onClick={addWitness}
                  className="w-full p-4 rounded-xl border-2 border-dashed border-gray-300 text-gray-600 hover:border-[#292A2D] hover:text-[#292A2D] transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  {t('evidenceWitness.witnesses.addWitness')}
                </button>
              </div>
            )}
          </div>

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

export default EvidenceWitness;