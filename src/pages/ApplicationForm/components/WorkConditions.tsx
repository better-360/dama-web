import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronLeft, Clock } from 'lucide-react';
import { updateApplicationSection } from '../../../http/requests/applicator';
import { uploadFileToS3 } from '../../../utils/firebase';
import MultiFileUploadComponent from '../../../components/MultipleFileUpload';

interface WorkConditionsInfo {
  dailyHours: string;
  weeklyDays: string;
  lastWorkDate: string;
  supervisorName: string;
  bases: string;
  loaFile?: File;
}

interface WorkConditionsProps {
  onComplete: () => void;
  onBack: () => void;
}

const WorkConditions: React.FC<WorkConditionsProps> = ({ onComplete,onBack }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<WorkConditionsInfo>({
    dailyHours: '',
    weeklyDays: '',
    lastWorkDate: '',
    supervisorName: '',
    bases: '',
    loaFile: undefined,
  });

  const folder = "loa-files";
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  
    useEffect(() => {
      setFormData((prev) => ({
        ...prev,
        loaFile: files[0],
      }));
    }
    , [files]);

    const handleUploadAll = async (): Promise<string[]> => {
      const uploadedFileKeys: string[] = [];
  
      for (const file of files) {
        try {
          const { fileKey } = await uploadFileToS3(
            file,
            file.name,
            file.type,
            folder
          );
          // Dosya URL'sini oluşturmak yerine fileKey'i saklıyoruz
          uploadedFileKeys.push(fileKey);
        } catch (err) {
          console.error("Error uploading file:", file.name, err);
          setError(`Dosya ${file.name} yüklenirken hata oluştu.`);
        }
      }
      // İstersen burada da files'ı temizleyebilirsin.
      setFiles([]);
      return uploadedFileKeys;
    };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };


  const isFormValid = () => {
    const {
      dailyHours,
      weeklyDays,
      lastWorkDate,
      supervisorName,
      bases,
    } = formData;

    return (
      dailyHours &&
      weeklyDays &&
      lastWorkDate &&
      supervisorName &&
      bases
    );
  };


  const handleSaveStep3 = async(urls:string[]) => {
    const data = {
      step: 3,
      section: "workConditions",
      data: {
        ...formData,
        loaFile: urls[0] || undefined,
      }
    };
     await updateApplicationSection(data);
  };

  const handleContinue = async () => {
    if (isFormValid()) {
      setSaving(true);
      const uploadedUrls = await handleUploadAll();
      handleSaveStep3(uploadedUrls);
      setSaving(false);
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-[#E2E0D6] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        <button 
          onClick={onBack}
          className="text-[#292A2D] mb-6 flex items-center gap-1 hover:opacity-80 transition-opacity">
          <ChevronLeft className="w-5 h-5" />
          {t('common.back')}
        </button>

        <div className="flex items-center justify-center mb-6">
          <Clock className="w-12 h-12 text-[#292A2D]" />
        </div>

        <h1 className="text-3xl font-bold text-center text-[#292A2D] mb-2">
          {t('workConditions.title')}
        </h1>
        <p className="text-center text-gray-600 mb-8">
          {t('workConditions.subtitle')}
        </p>

        <div className="space-y-6">
          {/* Work Schedule */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[#292A2D]">
              {t('workConditions.schedule')}
            </h2>
            
            <div className="space-y-3">
              <input
                type="number"
                name="dailyHours"
                value={formData.dailyHours}
                onChange={handleInputChange}
                placeholder={t('workConditions.dailyHours')}
                min="1"
                max="24"
                className="w-full p-4 rounded-xl border border-gray-300 focus:border-[#292A2D] focus:ring-1 focus:ring-[#292A2D] transition-all"
              />
              
              <input
                type="number"
                name="weeklyDays"
                value={formData.weeklyDays}
                onChange={handleInputChange}
                placeholder={t('workConditions.weeklyDays')}
                min="1"
                max="7"
                className="w-full p-4 rounded-xl border border-gray-300 focus:border-[#292A2D] focus:ring-1 focus:ring-[#292A2D] transition-all"
              />
            </div>
          </div>

          {/* Last Work Date */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[#292A2D]">
              {t('workConditions.lastWorkDate')}
            </h2>
            
            <input
              type="date"
              name="lastWorkDate"
              value={formData.lastWorkDate}
              onChange={handleInputChange}
              className="w-full p-4 rounded-xl border border-gray-300 focus:border-[#292A2D] focus:ring-1 focus:ring-[#292A2D] transition-all"
            />
          </div>

          {/* Supervisor and Work Location */}
          <div className="space-y-4">
            <div className="space-y-3">
              <input
                type="text"
                name="supervisorName"
                value={formData.supervisorName}
                onChange={handleInputChange}
                placeholder={t('workConditions.supervisor')}
                className="w-full p-4 rounded-xl border border-gray-300 focus:border-[#292A2D] focus:ring-1 focus:ring-[#292A2D] transition-all"
              />

              <textarea
                name="bases"
                value={formData.bases}
                onChange={handleInputChange}
                placeholder={t('workConditions.basesPlaceholder')}
                className="w-full p-4 rounded-xl border border-gray-300 focus:border-[#292A2D] focus:ring-1 focus:ring-[#292A2D] transition-all resize-none h-24"
              />
            </div>
          </div>

          {/* LOA Document */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-[#292A2D] mb-1">
                {t('workConditions.loa.title')}
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                {t('workConditions.loa.subtitle')}
              </p>
            </div>

            <MultiFileUploadComponent
                    files={files}
                    setFiles={setFiles}
                    setError={setError}
                    label="Loa File"
                    allowedTypes={[
                      "application/pdf",
                      "application/msword",
                      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                      "application/vnd.ms-excel",
                      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                      "application/vnd.ms-powerpoint",
                      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                      "application/vnd.ms-access",
                      "image/jpeg",
                      "image/png",
                      "image/jpg",
                    ]}
                  />
            
          </div>

          <button
            onClick={handleContinue}
            disabled={!isFormValid()}
            className="w-full bg-[#292A2D] text-white py-4 rounded-xl font-medium hover:bg-opacity-90 transition-all duration-200 disabled:opacity-50 disable

d:cursor-not-allowed"
          >
            {t('common.continue')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkConditions;