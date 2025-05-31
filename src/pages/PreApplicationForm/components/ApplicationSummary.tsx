import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ChevronRight, Edit2, CheckCircle, User, FileText, Import as Passport, Briefcase, Award, DollarSign, X, Save, Trash2, ExternalLink } from 'lucide-react';
import MultiFileUploadComponent from '../../../components/MultipleFileUpload';
import { uploadFileToS3 } from '../../../utils/firebase';
import { usePreApplication } from '../context/PreApplicationContext';

interface ApplicationSummaryProps {
  onBack: () => void;
  onSubmit: () => void;
}

const ApplicationSummary: React.FC<ApplicationSummaryProps> = ({ onBack, onSubmit }) => {
  const { t } = useTranslation();
  const { state, actions } = usePreApplication();
  const [editingSection, setEditingSection] = useState<string | null>(null);
  
  // File upload states for each section
  const [incidentFiles, setIncidentFiles] = useState<File[]>([]);
  const [passportFiles, setPassportFiles] = useState<File[]>([]);
  const [employmentFiles, setEmploymentFiles] = useState<File[]>([]);
  const [recognitionFiles, setRecognitionFiles] = useState<File[]>([]);
  const [paymentFiles, setPaymentFiles] = useState<File[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const [editValues, setEditValues] = useState({
    firstName: state.contactInfo?.firstName || '',
    lastName: state.contactInfo?.lastName || '',
    email: state.contactInfo?.email || '',
    birthDate: state.contactInfo?.birthDate || '',
    incidentDescription: state.incidentDescription || ''
  });
  const [showFullDescription, setShowFullDescription] = useState(false);

  // File upload helper
  const uploadFilesToS3 = async (files: File[], folder: string): Promise<string[]> => {
    const uploadedFileKeys: string[] = [];
    setUploading(true);
    
    try {
      for (const file of files) {
        const { fileKey } = await uploadFileToS3(file, file.name, file.type, folder);
        uploadedFileKeys.push(fileKey);
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      setUploadError('Dosyalar yüklenirken hata oluştu.');
    } finally {
      setUploading(false);
    }
    
    return uploadedFileKeys;
  };

  const handleSave = async (section: string) => {
    setUploadError(null);
    
    switch (section) {
      case 'personalInfo':
        actions.setContactInfo({
          firstName: editValues.firstName,
          lastName: editValues.lastName,
          birthDate: editValues.birthDate,
          ...(editValues.email && { email: editValues.email })
        });
        break;
      case 'incident':
        let newIncidentFiles = [...state.incidentFiles || []];
        if (incidentFiles.length > 0) {
          const uploadedFiles = await uploadFilesToS3(incidentFiles, 'incident-files');
          newIncidentFiles = [...newIncidentFiles, ...uploadedFiles];
          setIncidentFiles([]);
        }
        actions.setIncidentDescription(editValues.incidentDescription);
        actions.setIncidentFiles(newIncidentFiles);
        break;
      case 'passport':
        let newPassportFiles = [...state.passportFiles || []];
        if (passportFiles.length > 0) {
          const uploadedFiles = await uploadFilesToS3(passportFiles, 'passport');
          newPassportFiles = [...newPassportFiles, ...uploadedFiles];
          setPassportFiles([]);
        }
        actions.setPassportFiles(newPassportFiles);
        break;
      case 'employment':
        let newEmploymentFiles = [...state.employmentFiles || []];
        if (employmentFiles.length > 0) {
          const uploadedFiles = await uploadFilesToS3(employmentFiles, 'employment');
          newEmploymentFiles = [...newEmploymentFiles, ...uploadedFiles];
          setEmploymentFiles([]);
        }
        actions.setEmploymentFiles(newEmploymentFiles);
        break;
      case 'recognition':
        let newRecognitionFiles = [...state.recognitionInfo?.files || []];
        if (recognitionFiles.length > 0) {
          const uploadedFiles = await uploadFilesToS3(recognitionFiles, 'recognition');
          newRecognitionFiles = [...newRecognitionFiles, ...uploadedFiles];
          setRecognitionFiles([]);
        }
        actions.setRecognitionInfo({
          ...state.recognitionInfo,
          files: newRecognitionFiles
        });
        break;
      case 'payment':
        let newPaymentFiles = [...state.paymentFiles || []];
        if (paymentFiles.length > 0) {
          const uploadedFiles = await uploadFilesToS3(paymentFiles, 'payment');
          newPaymentFiles = [...newPaymentFiles, ...uploadedFiles];
          setPaymentFiles([]);
        }
        actions.setPaymentFiles(newPaymentFiles);
        break;
    }
    setEditingSection(null);
  };

  // Helper function to get file name from URL
  const getFileNameFromUrl = (url: string): string => {
    try {
      const urlParts = url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      // Remove any query parameters
      return fileName.split('?')[0] || 'Document';
    } catch {
      return 'Document';
    }
  };

  // Helper function to handle file deletion (this would need to call backend)
  const handleDeleteFile = (section: string, index: number) => {
    switch (section) {
      case 'incident':
        actions.setIncidentFiles(state.incidentFiles?.filter((_, i) => i !== index) || []);
        break;
      case 'passport':
        actions.setPassportFiles(state.passportFiles?.filter((_, i) => i !== index) || []);
        break;
      case 'employment':
        actions.setEmploymentFiles(state.employmentFiles?.filter((_, i) => i !== index) || []);
        break;
      case 'recognition':
        actions.setRecognitionInfo({
          ...state.recognitionInfo,
          files: state.recognitionInfo?.files?.filter((_, i) => i !== index) || []
        });
        break;
      case 'payment':
        actions.setPaymentFiles(state.paymentFiles?.filter((_, i) => i !== index) || []);
        break;
    }
  };

  const renderFileList = (files: string[], section: string) => (
    <ul className="mt-2 space-y-2">
      {files.map((fileUrl, index) => (
        <li key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-sm text-gray-600 truncate">
              {getFileNameFromUrl(fileUrl)}
            </span>
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 transition-colors p-1"
              title={t('common.viewFile')}
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
          <button
            onClick={() => handleDeleteFile(section, index)}
            className="text-red-500 hover:text-red-700 transition-colors p-1 ml-2"
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
    canEdit: boolean = true
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
                onClick={() => {
                  setEditingSection(null);
                  setUploadError(null);
                  // Clear file inputs
                  setIncidentFiles([]);
                  setPassportFiles([]);
                  setEmploymentFiles([]);
                  setRecognitionFiles([]);
                  setPaymentFiles([]);
                }}
                disabled={uploading}
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
              >
                <X className="w-4 h-4" />
                {t('common.cancel')}
              </button>
              <button
                onClick={() => handleSave(section)}
                disabled={uploading}
                className="flex items-center gap-1 text-sm text-green-600 hover:text-green-800 transition-colors disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                    {t('common.uploading')}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {t('common.save')}
                  </>
                )}
              </button>
            </>
          ) : (
            canEdit && (
              <button
                onClick={() => setEditingSection(section)}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                {t('summary.edit')}
              </button>
            )
          )}
        </div>
      </div>
      {editingSection === section && editForm ? editForm : content}
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
              <p>{state.contactInfo?.firstName} {state.contactInfo?.lastName}</p>
              {state.contactInfo?.email && <p className="text-sm">{state.contactInfo.email}</p>}
              {state.contactInfo?.birthDate && <p className="text-sm">{t('contactInfo.birthDate')}: {state.contactInfo.birthDate}</p>}
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
                  {t('contactInfo.birthDate')}
                </label>
                <input
                  type="date"
                  value={editValues.birthDate}
                  onChange={(e) => setEditValues(prev => ({ ...prev, birthDate: e.target.value }))}
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
                  {state.incidentDescription}
                </p>
                {state.incidentDescription && state.incidentDescription.length > 150 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-blue-600 hover:text-blue-800 text-sm mt-1"
                  >
                    {showFullDescription ? t('common.showLess') : t('common.showMore')}
                  </button>
                )}
              </div>
              {state.incidentFiles?.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">{t('summary.attachedFiles')}</p>
                  {renderFileList(state.incidentFiles, 'incident')}
                </div>
              )}
            </div>,
            'incident',
            <div className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('incidentForm.label')}
                </label>
                <textarea
                  value={editValues.incidentDescription}
                  onChange={(e) => setEditValues(prev => ({ ...prev, incidentDescription: e.target.value }))}
                  className="w-full h-48 p-4 border-2 border-gray-200 rounded-xl focus:border-[#292A2D] focus:ring-1 focus:ring-[#292A2D] transition-colors resize-none"
                  placeholder={t('incidentForm.placeholder')}
                />
              </div>
              {state.incidentFiles?.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">{t('summary.attachedFiles')}</p>
                  {renderFileList(state.incidentFiles, 'incident')}
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">{t('summary.addNewFiles')}</p>
                <MultiFileUploadComponent
                  files={incidentFiles}
                  setFiles={setIncidentFiles}
                  setError={setUploadError}
                  label="New Incident Files"
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
              {uploadError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                  {uploadError}
                </div>
              )}
            </div>
          )}

          {renderEditableSection(
            <Passport className="w-5 h-5 text-[#292A2D]" />,
            t('summary.sections.passport'),
            <div className="text-gray-600">
              <p>{t('summary.filesUploaded', { count: state.passportFiles?.length || 0 })}</p>
              {renderFileList(state.passportFiles || [], 'passport')}
            </div>,
            'passport',
            <div className="space-y-4 mt-4">
              {state.passportFiles?.length > 0 ? (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">{t('summary.currentFiles')}</p>
                  {renderFileList(state.passportFiles, 'passport')}
                </div>
              ) : (
                <p className="text-sm text-gray-500">{t('summary.noFilesUploaded')}</p>
              )}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">{t('summary.addNewFiles')}</p>
                <MultiFileUploadComponent
                  files={passportFiles}
                  setFiles={setPassportFiles}
                  setError={setUploadError}
                  label="New Passport Files"
                  allowedTypes={[
                    "application/pdf",
                    "application/msword",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    "image/jpeg",
                    "image/png",
                    "image/jpg",
                  ]}
                />
              </div>
              {uploadError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                  {uploadError}
                </div>
              )}
            </div>,
            true
          )}

          {renderEditableSection(
            <Briefcase className="w-5 h-5 text-[#292A2D]" />,
            t('summary.sections.employment'),
            <div className="text-gray-600">
              <p>{t('summary.filesUploaded', { count: state.employmentFiles?.length || 0 })}</p>
              {renderFileList(state.employmentFiles || [], 'employment')}
            </div>,
            'employment',
            <div className="space-y-4 mt-4">
              {state.employmentFiles?.length > 0 ? (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">{t('summary.currentFiles')}</p>
                  {renderFileList(state.employmentFiles, 'employment')}
                </div>
              ) : (
                <p className="text-sm text-gray-500">{t('summary.noFilesUploaded')}</p>
              )}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">{t('summary.addNewFiles')}</p>
                <MultiFileUploadComponent
                  files={employmentFiles}
                  setFiles={setEmploymentFiles}
                  setError={setUploadError}
                  label="New Employment Files"
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
              {uploadError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                  {uploadError}
                </div>
              )}
            </div>,
            true
          )}

          {renderEditableSection(
            <Award className="w-5 h-5 text-[#292A2D]" />,
            t('summary.sections.recognition'),
            <div className="text-gray-600">
              {state.recognitionInfo?.hasDocuments ? (
                <>
                  <p>{t('summary.filesUploaded', { count: state.recognitionInfo.files?.length || 0 })}</p>
                  {renderFileList(state.recognitionInfo.files || [], 'recognition')}
                </>
              ) : (
                <p>{t('summary.noDocuments')}</p>
              )}
            </div>,
            'recognition',
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  {t('recognitionUpload.hasDocuments')}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      actions.setRecognitionInfo({
                        ...state.recognitionInfo,
                        hasDocuments: true,
                        files: state.recognitionInfo.files
                      });
                      setEditingSection(null);
                    }}
                    className={`p-4 rounded-xl font-medium transition-all duration-200 ${
                      state.recognitionInfo.hasDocuments
                        ? "bg-[#292A2D] text-white"
                        : "bg-gray-50 hover:bg-gray-100 text-[#292A2D]"
                    }`}
                  >
                    {t("common.yes")}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      actions.setRecognitionInfo({
                        ...state.recognitionInfo,
                        hasDocuments: false,
                        files: []
                      });
                      setEditingSection(null);
                    }}
                    className={`p-4 rounded-xl font-medium transition-all duration-200 ${
                      !state.recognitionInfo.hasDocuments
                        ? "bg-[#292A2D] text-white"
                        : "bg-gray-50 hover:bg-gray-100 text-[#292A2D]"
                    }`}
                  >
                    {t("common.no")}
                  </button>
                </div>
              </div>
              {state.recognitionInfo.hasDocuments && (
                <>
                  {state.recognitionInfo.files?.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        {t('summary.currentFiles')}
                      </p>
                      {renderFileList(state.recognitionInfo.files, 'recognition')}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">{t('summary.addNewFiles')}</p>
                    <MultiFileUploadComponent
                      files={recognitionFiles}
                      setFiles={setRecognitionFiles}
                      setError={setUploadError}
                      label="New Recognition Files"
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
                </>
              )}
              {uploadError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                  {uploadError}
                </div>
              )}
            </div>,
            true
          )}

          {renderEditableSection(
            <DollarSign className="w-5 h-5 text-[#292A2D]" />,
            t('summary.sections.payment'),
            <div className="text-gray-600">
              <p>{t('summary.filesUploaded', { count: state.paymentFiles?.length || 0 })}</p>
              {renderFileList(state.paymentFiles || [], 'payment')}
            </div>,
            'payment',
            <div className="space-y-4 mt-4">
              {state.paymentFiles?.length > 0 ? (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">{t('summary.currentFiles')}</p>
                  {renderFileList(state.paymentFiles, 'payment')}
                </div>
              ) : (
                <p className="text-sm text-gray-500">{t('summary.noFilesUploaded')}</p>
              )}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">{t('summary.addNewFiles')}</p>
                <MultiFileUploadComponent
                  files={paymentFiles}
                  setFiles={setPaymentFiles}
                  setError={setUploadError}
                  label="New Payment Files"
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
              {uploadError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                  {uploadError}
                </div>
              )}
            </div>,
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