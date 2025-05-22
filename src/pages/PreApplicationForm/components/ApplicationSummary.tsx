import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ChevronRight, Edit2, CheckCircle, User, FileText, Import as Passport, Briefcase, Award, DollarSign, X, Save, Upload, Trash2 } from 'lucide-react';

interface ApplicationSummaryProps {
  onBack: () => void;
  onSubmit: () => void;
  data: {
    contactInfo: {
      firstName: string;
      lastName: string;
      email?: string;
    };
    incidentDescription: string;
    passportFiles: File[];
    employmentFiles: File[];
    recognitionInfo: {
      hasDocuments: boolean;
      files: File[];
    };
    paymentFiles: File[];
  };
  onUpdateData: (newData: Partial<ApplicationSummaryProps['data']>) => void;
}

const ApplicationSummary: React.FC<ApplicationSummaryProps> = ({ onBack, onSubmit, data, onUpdateData }) => {
  const { t } = useTranslation();
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [editValues, setEditValues] = useState({
    firstName: data.contactInfo.firstName,
    lastName: data.contactInfo.lastName,
    email: data.contactInfo.email || '',
    incidentDescription: data.incidentDescription
  });
  const [showFullDescription, setShowFullDescription] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent, section: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles, section);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>, section: string) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    handleFiles(selectedFiles, section);
  };

  const handleFiles = (newFiles: File[], section: string) => {
    const validFiles = newFiles.filter(file => 
      file.type === 'application/pdf' || 
      file.type.startsWith('image/')
    );

    switch (section) {
      case 'passport':
        onUpdateData({ passportFiles: [...data.passportFiles, ...validFiles] });
        break;
      case 'employment':
        onUpdateData({ employmentFiles: [...data.employmentFiles, ...validFiles] });
        break;
      case 'recognition':
        onUpdateData({
          recognitionInfo: {
            hasDocuments: true,
            files: [...data.recognitionInfo.files, ...validFiles]
          }
        });
        break;
      case 'payment':
        onUpdateData({ paymentFiles: [...data.paymentFiles, ...validFiles] });
        break;
    }
  };

  const handleDeleteFile = (section: string, index: number) => {
    switch (section) {
      case 'passport':
        onUpdateData({
          passportFiles: data.passportFiles.filter((_, i) => i !== index)
        });
        break;
      case 'employment':
        onUpdateData({
          employmentFiles: data.employmentFiles.filter((_, i) => i !== index)
        });
        break;
      case 'recognition':
        onUpdateData({
          recognitionInfo: {
            ...data.recognitionInfo,
            files: data.recognitionInfo.files.filter((_, i) => i !== index)
          }
        });
        break;
      case 'payment':
        onUpdateData({
          paymentFiles: data.paymentFiles.filter((_, i) => i !== index)
        });
        break;
    }
  };

  const handleSave = (section: string) => {
    switch (section) {
      case 'personalInfo':
        onUpdateData({
          contactInfo: {
            firstName: editValues.firstName,
            lastName: editValues.lastName,
            ...(editValues.email && { email: editValues.email })
          }
        });
        break;
      case 'incident':
        onUpdateData({
          incidentDescription: editValues.incidentDescription
        });
        break;
    }
    setEditingSection(null);
  };

  const renderFileUpload = (section: string) => (
    <div
      className={`relative border-2 border-dashed rounded-xl p-6 text-center mt-4
        ${dragActive ? 'border-[#292A2D] bg-[#292A2D] bg-opacity-5' : 'border-gray-300'}
        transition-all duration-300`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={(e) => handleDrop(e, section)}
    >
      <input
        type="file"
        multiple
        accept="image/*,application/pdf"
        onChange={(e) => handleFileInput(e, section)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      
      <div className="space-y-2">
        <div className="flex justify-center">
          <Upload className={`w-8 h-8 ${dragActive ? 'text-[#292A2D]' : 'text-gray-400'}`} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">
            {t('summary.dropzone.title')}
          </p>
          <p className="text-xs text-gray-500">
            {t('summary.dropzone.subtitle')}
          </p>
        </div>
      </div>
    </div>
  );

  const renderFileList = (files: File[], section: string) => (
    <ul className="mt-2 space-y-2">
      {files.map((file, index) => (
        <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
          <span className="text-sm text-gray-600">{file.name}</span>
          <button
            onClick={() => handleDeleteFile(section, index)}
            className="text-red-500 hover:text-red-700 transition-colors p-1"
            title={t('common.delete')}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </li>
      ))}
    </ul>
  );

  const renderEditableSection = (
    icon: React.ReactNode,
    title: string,
    content: React.ReactNode,
    section: string,
    editForm?: React.ReactNode,
    canEdit: boolean = true,
    canAddFiles: boolean = false
  ) => (
    <div className="bg-gray-50 rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#292A2D] bg-opacity-5 rounded-lg">
            {icon}
          </div>
          <h3 className="font-medium text-[#292A2D]">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          {canEdit && editingSection === section ? (
            <>
              <button
                onClick={() => setEditingSection(null)}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                <X className="w-4 h-4" />
                {t('common.cancel')}
              </button>
              <button
                onClick={() => handleSave(section)}
                className="flex items-center gap-1 text-sm text-green-600 hover:text-green-800 transition-colors"
              >
                <Save className="w-4 h-4" />
                {t('common.save')}
              </button>
            </>
          ) : (
            <>
              {canEdit && (
                <button
                  onClick={() => setEditingSection(section)}
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  {t('summary.edit')}
                </button>
              )}
              {canAddFiles && (
                <button
                  onClick={() => setEditingSection(section)}
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors ml-2"
                >
                  <Upload className="w-4 h-4" />
                  {t('summary.addFiles')}
                </button>
              )}
            </>
          )}
        </div>
      </div>
      {editingSection === section && editForm ? editForm : content}
      {editingSection === section && canAddFiles && renderFileUpload(section)}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#E2E0D6] flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-lg p-6 sm:p-8 my-8">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-[#292A2D] transition-colors mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
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

        <div className="space-y-4 mb-8">
          {renderEditableSection(
            <User className="w-5 h-5 text-[#292A2D]" />,
            t('summary.sections.personalInfo'),
            <div className="text-gray-600">
              <p>{data.contactInfo.firstName} {data.contactInfo.lastName}</p>
              {data.contactInfo.email && <p className="text-sm">{data.contactInfo.email}</p>}
            </div>,
            'personalInfo',
            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('contactInfo.firstName')}
                </label>
                <input
                  type="text"
                  value={editValues.firstName}
                  onChange={(e) => setEditValues(prev => ({ ...prev, firstName: e.target.value }))}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#292A2D] focus:ring-1 focus:ring-[#292A2D] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('contactInfo.lastName')}
                </label>
                <input
                  type="text"
                  value={editValues.lastName}
                  onChange={(e) => setEditValues(prev => ({ ...prev, lastName: e.target.value }))}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#292A2D] focus:ring-1 focus:ring-[#292A2D] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('contactInfo.email')}
                </label>
                <input
                  type="email"
                  value={editValues.email}
                  onChange={(e) => setEditValues(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#292A2D] focus:ring-1 focus:ring-[#292A2D] transition-colors"
                />
              </div>
            </div>
          )}

          {renderEditableSection(
            <FileText className="w-5 h-5 text-[#292A2D]" />,
            t('summary.sections.incident'),
            <div className="text-gray-600">
              <div className="relative">
                <p className={`whitespace-pre-wrap ${!showFullDescription && 'line-clamp-3'}`}>
                  {data.incidentDescription}
                </p>
                {data.incidentDescription.length > 150 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-blue-600 hover:text-blue-800 text-sm mt-1"
                  >
                    {showFullDescription ? t('common.showLess') : t('common.showMore')}
                  </button>
                )}
              </div>
            </div>,
            'incident',
            <div className="mt-4">
              <textarea
                value={editValues.incidentDescription}
                onChange={(e) => setEditValues(prev => ({ ...prev, incidentDescription: e.target.value }))}
                className="w-full h-48 p-4 border-2 border-gray-200 rounded-xl focus:border-[#292A2D] focus:ring-1 focus:ring-[#292A2D] transition-colors resize-none"
                placeholder={t('incidentForm.placeholder')}
              />
            </div>
          )}

          {renderEditableSection(
            <Passport className="w-5 h-5 text-[#292A2D]" />,
            t('summary.sections.passport'),
            <div className="text-gray-600">
              <p>{t('summary.filesUploaded', { count: data.passportFiles.length })}</p>
              {renderFileList(data.passportFiles, 'passport')}
            </div>,
            'passport',
            undefined,
            false,
            true
          )}

          {renderEditableSection(
            <Briefcase className="w-5 h-5 text-[#292A2D]" />,
            t('summary.sections.employment'),
            <div className="text-gray-600">
              <p>{t('summary.filesUploaded', { count: data.employmentFiles.length })}</p>
              {renderFileList(data.employmentFiles, 'employment')}
            </div>,
            'employment',
            undefined,
            false,
            true
          )}

          {renderEditableSection(
            <Award className="w-5 h-5 text-[#292A2D]" />,
            t('summary.sections.recognition'),
            <div className="text-gray-600">
              {data.recognitionInfo.hasDocuments ? (
                <>
                  <p>{t('summary.filesUploaded', { count: data.recognitionInfo.files.length })}</p>
                  {renderFileList(data.recognitionInfo.files, 'recognition')}
                </>
              ) : (
                <p>{t('summary.noDocuments')}</p>
              )}
            </div>,
            'recognition',
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {t('recognition.hasDocuments')}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateData({
                        recognitionInfo: {
                          hasDocuments: true,
                          files: data.recognitionInfo.files
                        }
                      });
                      setEditingSection(null);
                    }}
                    className={`p-4 rounded-xl font-medium transition-all duration-200 ${
                      data.recognitionInfo.hasDocuments
                        ? "bg-[#292A2D] text-white"
                        : "bg-gray-50 hover:bg-gray-100 text-[#292A2D]"
                    }`}
                  >
                    {t("common.yes")}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateData({
                        recognitionInfo: {
                          hasDocuments: false,
                          files: []
                        }
                      });
                      setEditingSection(null);
                    }}
                    className={`p-4 rounded-xl font-medium transition-all duration-200 ${
                      !data.recognitionInfo.hasDocuments
                        ? "bg-[#292A2D] text-white"
                        : "bg-gray-50 hover:bg-gray-100 text-[#292A2D]"
                    }`}
                  >
                    {t("common.no")}
                  </button>
                </div>
              </div>
            </div>,
            true,
            data.recognitionInfo.hasDocuments
          )}

          {renderEditableSection(
            <DollarSign className="w-5 h-5 text-[#292A2D]" />,
            t('summary.sections.payment'),
            <div className="text-gray-600">
              <p>{t('summary.filesUploaded', { count: data.paymentFiles.length })}</p>
              {renderFileList(data.paymentFiles, 'payment')}
            </div>,
            'payment',
            undefined,
            false,
            true
          )}
        </div>

        <button
          onClick={onSubmit}
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

export default ApplicationSummary;