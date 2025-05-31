import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, Plus, Users, X, Link, FileText } from 'lucide-react';
import { useApplication } from '../context/ApplicationContext';
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

interface EvidenceWitnessData {
  evidenceLinks: EvidenceLink[];
  hasWitnesses: boolean | null;
  witnesses: Witness[];
}

interface EvidenceWitnessProps {
  onComplete: () => void;
  onBack: () => void;
}

const EvidenceWitness: React.FC<EvidenceWitnessProps> = ({
  onComplete,
  onBack,
}) => {
  const { t } = useTranslation();
  const { state, actions } = useApplication();
  const formData = state.evidenceWitness;

  const addWitness = () => {
    const newWitness = {
      id: Date.now().toString(),
      name: '',
      contact: '',
      relationship: ''
    };
    const newWitnesses = [...formData.witnesses, newWitness];
    actions.setEvidenceWitness({ witnesses: newWitnesses });
  };

  const updateWitness = (id: string, field: string, value: string) => {
    const updatedWitnesses = formData.witnesses.map((witness: any) =>
      witness.id === id ? { ...witness, [field]: value } : witness
    );
    actions.setEvidenceWitness({ witnesses: updatedWitnesses });
  };

  const removeWitness = (id: string) => {
    const filteredWitnesses = formData.witnesses.filter((witness: any) => witness.id !== id);
    actions.setEvidenceWitness({ witnesses: filteredWitnesses });
  };

  const addEvidenceLink = () => {
    const newLink = {
      id: Date.now().toString(),
      url: '',
      description: ''
    };
    const newLinks = [...formData.evidenceLinks, newLink];
    actions.setEvidenceWitness({ evidenceLinks: newLinks });
  };

  const updateEvidenceLink = (id: string, field: string, value: string) => {
    const updatedLinks = formData.evidenceLinks.map((link: any) =>
      link.id === id ? { ...link, [field]: value } : link
    );
    actions.setEvidenceWitness({ evidenceLinks: updatedLinks });
  };

  const removeEvidenceLink = (id: string) => {
    const filteredLinks = formData.evidenceLinks.filter((link: any) => link.id !== id);
    actions.setEvidenceWitness({ evidenceLinks: filteredLinks });
  };

  const isFormValid = () => {
    return true; // No validation required
  };

  const handleContinue = async () => {
    try {
      const sectionData = {
        step: 5,
        section: "evidenceWitness",
        data: formData,
      };

      console.log("Saving evidence witness data:", sectionData);
      await updateApplicationSection(sectionData);
      onComplete();
    } catch (error) {
      console.error("Error saving evidence witness data:", error);
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
                    <Link className="w-5 h-5 text-gray-500" />
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
                  onClick={() => actions.setEvidenceWitness({ hasWitnesses: true })}
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
                  onClick={() => actions.setEvidenceWitness({ hasWitnesses: false })}
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