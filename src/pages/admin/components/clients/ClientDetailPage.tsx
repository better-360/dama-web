import React, { useState, useEffect, forwardRef } from "react";
import { ArrowLeft, FileText, Download, Link as LinkIcon, Edit, Save, X, Upload } from "lucide-react";
import type { ApplicationDetail } from "../../types/applicationDetail";
import { sectionLabels as preApplicationSectionLabels } from "../../types/applicationDetail";
import { sectionLabels as applicationSectionLabels } from "../../types/clientDetail";
import { getApplication, getFileUrl, updateApplicationStatus, updateApplication } from "../../../../http/requests/admin";
import { ApplicationStatus } from "../../../../types/status";
import toast from "react-hot-toast";
import AdminFileUploadComponent from "../applications/UploadComponent";
//@ts-ignore
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import tr from 'date-fns/locale/tr';
import { useTranslation } from 'react-i18next';
import InputMask from 'react-input-mask';

interface ClientDetailPageProps {
  id: string;
  onBack: () => void;
}

interface SectionData {
  firstName?: string;
  lastName?: string;
  email?: string;
  birthDate?: string;
  incidentDescription?: string;
  incidentFiles?: string[];
  passportFiles?: string[];
  employmentFiles?: string[];
  recognitionFiles?: string[];
  paymentFiles?: string[];
  [key: string]: any;
}


interface EditingSection {
  type: 'preApplicationData' | 'applicationData';
  index: number;
}

interface EditData extends SectionData {
  incidentDescription?: string;
  incidentFiles?: string[];
  passportFiles?: string[];
  employmentFiles?: string[];
  recognitionFiles?: string[];
  paymentFiles?: string[];
}

const MaskedInput = forwardRef<HTMLInputElement, any>(({ value, onClick, onChange }, ref) => (
  <InputMask
    mask="99.99.9999"
    value={value}
    onChange={onChange}
  >
    {(inputProps: any) => (
      <input
        {...inputProps}
        ref={ref}
        onClick={onClick}
        placeholder="GG.AA.YYYY"
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-[#292A2D] focus:ring-1 focus:ring-[#292A2D] transition-all"
      />
    )}
  </InputMask>
));

MaskedInput.displayName = 'MaskedInput';

export default function ClientDetailPage({
  id,
  onBack,
}: ClientDetailPageProps) {
  const [application, setApplication] = useState<ApplicationDetail | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | ''>('')
  const [editMode, setEditMode] = useState(false);
  const [editingSection, setEditingSection] = useState<EditingSection | null>(null);
  const [editData, setEditData] = useState<EditData>({});
  const [tempFiles, setTempFiles] = useState<File[]>([]);
  const [fileUploadError, setFileUploadError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"pre-application" | "application">(
    "pre-application"
  );

  const { t } = useTranslation();

  useEffect(() => {
    fetchClientDetail();
  }, [id]);

  const fetchClientDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getApplication(id);
      setApplication(res);
    } catch (err) {
      console.error("Error fetching client detail:", err);
      setError("Müvekkil detayları yüklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (type: 'preApplicationData' | 'applicationData', index: number, data: any) => {
    setEditingSection({ type, index });
    setEditData({ ...data });
    setEditMode(true);
    setTempFiles([]);
    setFileUploadError(null);
  };

  const cancelEditing = () => {
    setEditingSection(null);
    setEditData({});
    setEditMode(false);
    setTempFiles([]);
    setFileUploadError(null);
  };

  const handleInputChange = (field: keyof EditData, value: any) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedInputChange = (parentField: string, field: string, value: any) => {
    setEditData((prev:any) => ({
      ...prev,
      [parentField]: {
        ...prev[parentField],
        [field]: value
      }
    }));
  };

  const handleUploadComplete = async (fileKeys: string[], sectionType: string) => {
    const fileField = getFileFieldName(sectionType);
    
    setEditData((prev: any) => {
      const currentFiles = prev[fileField] || [];
      return {
        ...prev,
        [fileField]: [...currentFiles, ...fileKeys]
      };
    });
    
    console.log(`Dosyalar yüklendi, ${fileField} alanına eklendi:`, fileKeys);
    
    toast.success(
      `${fileKeys.length} adet dosya başarıyla yüklendi. Değişiklikleri kaydetmek için lütfen Kaydet düğmesine basın.`,
      { duration: 5000 }
    );
  };

  const handleRemoveFile = (fileIndex: number, sectionType: string) => {
    const fileField = getFileFieldName(sectionType);
    
    setEditData((prev: any) => {
      const currentFiles = [...(prev[fileField] || [])];
      currentFiles.splice(fileIndex, 1);
      return {
        ...prev,
        [fileField]: currentFiles
      };
    });
    
    toast.success('Dosya kaldırıldı');
  };

  const getFileFieldName = (sectionType: string): string => {
    switch (sectionType) {
      case "passport":
        return "passportFiles";
      case "workConditions":
        return "loaFile";
      case "employment":
        return "employmentFiles";
      case "recognition":
        return "files";
      case "payment":
        return "paymentFiles";
      case "incident":
        return "incidentFiles";
      default:
        return "files";
    }
  };

  const getFolderName = (sectionType: string): string => {
    switch (sectionType) {
      case "passport":
        return "passport-documents";
      case "workConditions":
        return "workConditions-documents";
      case "employment":
        return "employment-documents";
      case "recognition":
        return "recognition-documents";
      case "payment":
        return "payment-documents";
      case "incident":
        return "incident-documents";
      default:
        return "documents";
    }
  };

  const getSectionLabel = (sectionType: string): string => {
    switch (sectionType) {
      case "passport":
        return "Pasaport Belgeleri";
      case "workConditions":
        return "Çalışma Koşulları Belgeleri";
      case "employment":
        return "İstihdam Belgeleri";
      case "recognition":
        return "Takdir Belgeleri";
      case "payment":
        return "Ödeme Belgeleri";
      case "incident":
        return "Olay Belgeleri";
      default:
        return "Belgeler";
    }
  };

  const saveChanges = async () => {
    if (!editingSection || !application) return;

    try {
      setLoading(true);
      console.log('Saving data:', editData);
      
      await updateApplication(application.applicatorId, editingSection.type, editingSection.index, editData);
      
      setApplication(prev => {
        if (!prev) return null;
        
        const updatedData = [...prev[editingSection.type]];
        updatedData[editingSection.index] = {
          ...updatedData[editingSection.index],
          data: editData
        };
        
        console.log('Updated application data:', updatedData[editingSection.index]);
        
        return {
          ...prev,
          [editingSection.type]: updatedData
        };
      });
      
      toast.success('Bilgiler başarıyla güncellendi');
      cancelEditing();
    } catch (err) {
      console.error('Error updating application section:', err);
      toast.error('Güncelleme başarısız oldu');
    } finally {
      setLoading(false);
    }
  };

  const getFilesForSection = (section: any) => {
    if (!section || !section.data) return undefined;

    switch (section.section) {
      case "incident":
        return section.data.incidentFiles;
      case "passport":
        return section.data.passportFiles;
      case "workConditions":
        return section.data.loaFile;
      case "employment":
        return section.data.employmentFiles;
      case "recognition":
        return section.data.files;
      case "payment":
        return section.data.paymentFiles;
      default:
        return undefined;
    }
  };

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as ApplicationStatus
    setSelectedStatus(newStatus)

    try {
      if(!application||application==null) {
       return toast.error('Başvuru alınamadı')
      }
      await updateApplicationStatus(application.applicatorId,newStatus)
      toast.success('Başvuru durumu güncellendi')
     
      setApplication((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          status: newStatus,
        };
      });
    } catch (err) {
      console.error(err)
      toast.error('Güncelleme başarısız')
    }
  }
  

  const getFileLink = async (file: string) => {
    try {
      const fileUrl = await getFileUrl(file);
      console.log('File URL:', fileUrl); // Debug log
      window.open(fileUrl, '_blank');
    } catch (error) {
      console.error('Error in getFileLink:', error);
    }
  };

  const renderEditableFiles = (section: any, sectionIndex: number, dataType: string) => {
    const sectionType = section.section;
    const fileField = getFileFieldName(sectionType);
    const folderName = getFolderName(sectionType);
    const sectionLabel = getSectionLabel(sectionType);
    
    if (editMode && editingSection?.type === dataType && editingSection.index === sectionIndex) {
      return (
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-500 mb-3">{sectionLabel}</label>
          
          {editData && editData[fileField] && editData[fileField].length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Yüklü Belgeler:</p>
              <div className="space-y-2">
                {editData[fileField].map((fileKey: string, idx: number) => (
                  <div 
                    key={idx} 
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-700 truncate max-w-xs">
                        {fileKey.split('/').pop() || `Belge ${idx + 1}`}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => getFileLink(fileKey)}
                        className="p-1 rounded-full text-blue-600 hover:bg-blue-50"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(idx, sectionType)}
                        className="p-1 rounded-full text-red-600 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Yeni Belge Ekle:</p>
            <AdminFileUploadComponent
              files={tempFiles}
              setFiles={setTempFiles}
              setError={setFileUploadError}
              applicationNumber={application?.applicationNumber || ''}
              folder={folderName}
              onUploadComplete={(fileKeys) => handleUploadComplete(fileKeys, sectionType)}
              label={sectionLabel}
              maxSize={10}
            />
            {fileUploadError && (
              <p className="text-sm text-red-600 mt-2">{fileUploadError}</p>
            )}
            
            {tempFiles.length > 0 && (
              <div className="bg-blue-50 text-blue-700 p-3 rounded-md mt-3 text-sm">
                Dosyaları yükledikten sonra, değişiklikleri kaydetmek için <b>Kaydet</b> düğmesine basmayı unutmayın.
              </div>
            )}
          </div>
        </div>
      );
    } else {
      return renderFiles(getFilesForSection(section));
    }
  };

  const renderFiles = (files: string[] | undefined) => {
    if (!files || files.length === 0) {
      return <p className="text-sm text-gray-500 italic">Dosya yüklenmemiş</p>
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {files.map((file, index) => (
          <p
            key={index}
            onClick={() => getFileLink(file)}
            className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FileText className="w-5 h-5 text-gray-500 mr-2" />
            <span className="text-sm text-gray-700 truncate">
              {file.split('/').pop()}
            </span>
            <Download className="w-4 h-4 text-gray-500 ml-auto" />
          </p>
        ))}
      </div>
    );
  };

  const renderPreApplicationData = () => {
    if (!application) return null;

    return (
      <div className="divide-y divide-gray-200">
        {application.preApplicationData.map((section, sectionIndex) => (
          <div key={section.section} className="p-6 relative">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-medium text-gray-900">
                {preApplicationSectionLabels[section.section]}
              </h4>
              {editMode && editingSection?.type === 'preApplicationData' && editingSection.index === sectionIndex ? (
                <div className="flex space-x-3">
                  <button
                    onClick={saveChanges}
                    className="px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Kaydet</span>
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="px-3 py-1.5 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors flex items-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>İptal</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => startEditing('preApplicationData', sectionIndex, section.data)}
                  className="p-1 bg-gray-50 text-gray-600 rounded hover:bg-gray-100"
                >
                  <Edit className="w-4 h-4" />
                </button>
              )}
            </div>

            {section.section === "contact" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Ad Soyad
                  </label>
                  {editMode && editingSection?.type === 'preApplicationData' && editingSection.index === sectionIndex ? (
                    <div className="mt-1 flex space-x-2">
                      <input
                        type="text"
                        value={editData.firstName || ''}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Ad"
                      />
                      <input
                        type="text"
                        value={editData.lastName || ''}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Soyad"
                      />
                    </div>
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">
                      {section.data.firstName} {section.data.lastName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    E-posta
                  </label>
                  {editMode && editingSection?.type === 'preApplicationData' && editingSection.index === sectionIndex ? (
                    <input
                      type="email"
                      value={editData.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">
                      {section.data.email}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Doğum Tarihi
                  </label>
                  {editMode && editingSection?.type === 'preApplicationData' && editingSection.index === sectionIndex ? (
                    <div className="mt-1 relative">
                      <DatePicker
                        selected={editData.birthDate ? new Date(editData.birthDate) : null}
                        onChange={(date: Date | null) => {
                          if (date) {
                            const formattedDate = date.toISOString().split('T')[0];
                            handleInputChange('birthDate', formattedDate);
                          } else {
                            handleInputChange('birthDate', '');
                          }
                        }}
                        customInput={<MaskedInput />}
                        dateFormat="dd.MM.yyyy"
                        maxDate={new Date()}
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        locale={tr}
                        isClearable
                      />
                    </div>
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">
                      {section.data.birthDate ? new Date(section.data.birthDate).toLocaleDateString('tr-TR') : '-'}
                    </p>
                  )}
                </div>
              </div>
            )}

            {section.section === "incident" && (
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Olay Açıklaması
                </label>
                {editMode && editingSection?.type === 'preApplicationData' && editingSection.index === sectionIndex ? (
                  <textarea
                    value={editData.incidentDescription || ''}
                    onChange={(e) => handleInputChange('incidentDescription', e.target.value)}
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={5}
                  />
                ) : (
                  <p className="mt-2 text-sm text-gray-900 whitespace-pre-wrap">
                    {section.data.incidentDescription}
                  </p>
                )}
                
                {renderEditableFiles(section, sectionIndex, 'preApplicationData')}
              </div>
            )}

            {["passport", "employment", "recognition", "payment"].includes(section.section) && (
              <div>
                {renderEditableFiles(section, sectionIndex, 'preApplicationData')}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };
  
  const safe = (value: any) =>
    value === null || value === undefined || value === ""
      ? "Belirtilmemiş"
      : value;
  
  const renderApplicationData = () => {
    if (!application?.applicationData) return null;
  
    return (
      <div className="divide-y divide-gray-200">
        {application.applicationData.map((section: any, sectionIndex: number) => (
          <div key={section.section} className="p-6 relative">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-medium text-gray-900">
                {applicationSectionLabels[section.section]}
              </h4>
              {editMode && editingSection?.type === 'applicationData' && editingSection.index === sectionIndex ? (
                <div className="flex space-x-3">
                  <button
                    onClick={saveChanges}
                    className="px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Kaydet</span>
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="px-3 py-1.5 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors flex items-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>İptal</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => startEditing('applicationData', sectionIndex, section.data)}
                  className="p-1 bg-gray-50 text-gray-600 rounded hover:bg-gray-100"
                >
                  <Edit className="w-4 h-4" />
                </button>
              )}
            </div>
  
            {section.section === "marital" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Medeni Durum
                  </label>
                  {editMode && editingSection?.type === 'applicationData' && editingSection.index === sectionIndex ? (
                    <select
                      value={editData.maritalStatus || ''}
                      onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Seçiniz</option>
                      <option value="Bekar">Bekar</option>
                      <option value="Evli">Evli</option>
                      <option value="Boşanmış">Boşanmış</option>
                    </select>
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">
                      {safe(section.data.maritalStatus)}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Eş Adı
                  </label>
                  {editMode && editingSection?.type === 'applicationData' && editingSection.index === sectionIndex ? (
                    <input
                      type="text"
                      value={editData.spouseName || ''}
                      onChange={(e) => handleInputChange('spouseName', e.target.value)}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">
                      {safe(section.data.spouseName)}
                    </p>
                  )}
                </div>
                {(section.data.hasChildren || (editMode && editingSection?.type === 'applicationData' && editingSection.index === sectionIndex && editData.hasChildren)) && (
                  <div>
                    <div className="flex items-center mb-2">
                      <label className="block text-sm font-medium text-gray-500 mr-3">
                        Çocuklar
                      </label>
                      {editMode && editingSection?.type === 'applicationData' && editingSection.index === sectionIndex && (
                        <input
                          type="checkbox"
                          checked={editData.hasChildren || false}
                          onChange={(e) => handleInputChange('hasChildren', e.target.checked)}
                          className="h-4 w-4"
                        />
                      )}
                    </div>
                    
                    {editMode && editingSection?.type === 'applicationData' && editingSection.index === sectionIndex && editData.hasChildren ? (
                      <div className="space-y-2">
                        {(editData.children || []).map((child: any, childIndex: number) => (
                          <div key={childIndex} className="flex space-x-2">
                            <input
                              type="text"
                              value={child.name || ''}
                              onChange={(e) => {
                                const newChildren = [...editData.children];
                                newChildren[childIndex] = {...newChildren[childIndex], name: e.target.value};
                                handleInputChange('children', newChildren);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              placeholder="Çocuk adı"
                            />
                            <input
                              type="date"
                              value={child.birthDate || ''}
                              onChange={(e) => {
                                const newChildren = [...editData.children];
                                newChildren[childIndex] = {...newChildren[childIndex], birthDate: e.target.value};
                                handleInputChange('children', newChildren);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                            <button
                              onClick={() => {
                                const newChildren = [...editData.children];
                                newChildren.splice(childIndex, 1);
                                handleInputChange('children', newChildren);
                              }}
                              className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            const newChildren = [...(editData.children || []), { name: '', birthDate: '' }];
                            handleInputChange('children', newChildren);
                          }}
                          className="px-3 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 text-sm"
                        >
                          Çocuk Ekle
                        </button>
                      </div>
                    ) : (
                      <div className="mt-2 space-y-2">
                        {section.data.children && section.data.children.map((child: any, index: number) => (
                          <div key={index} className="text-sm text-gray-900">
                            {safe(child.name)} - {safe(child.birthDate)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
  
            {section.section === "employment" && (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      İşveren
                    </label>
                    {editMode && editingSection?.type === 'applicationData' && editingSection.index === sectionIndex ? (
                      <input
                        type="text"
                        value={editData.employerName || ''}
                        onChange={(e) => handleInputChange('employerName', e.target.value)}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">
                        {safe(section.data.employerName)}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Pozisyon
                    </label>
                    {editMode && editingSection?.type === 'applicationData' && editingSection.index === sectionIndex ? (
                      <input
                        type="text"
                        value={editData.position || ''}
                        onChange={(e) => handleInputChange('position', e.target.value)}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">
                        {safe(section.data.position)}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Maaş
                    </label>
                    {editMode && editingSection?.type === 'applicationData' && editingSection.index === sectionIndex ? (
                      <input
                        type="text"
                        value={editData.salary || ''}
                        onChange={(e) => handleInputChange('salary', e.target.value)}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">
                        {safe(section.data.salary)}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Başlangıç Tarihi
                    </label>
                    {editMode && editingSection?.type === 'applicationData' && editingSection.index === sectionIndex ? (
                      <input
                        type="date"
                        value={editData.startDate || ''}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">
                        {safe(section.data.startDate)}
                      </p>
                    )}
                  </div>
                </div>
                {renderEditableFiles(section, sectionIndex, 'applicationData')}
              </div>
            )}
  
            {section.section === "workConditions" && (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Üsler
                    </label>
                    {editMode && editingSection?.type === 'applicationData' && editingSection.index === sectionIndex ? (
                      <input
                        type="text"
                        value={editData.bases || ''}
                        onChange={(e) => handleInputChange('bases', e.target.value)}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">
                        {safe(section.data.bases)}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Günlük Çalışma Saati
                    </label>
                    {editMode && editingSection?.type === 'applicationData' && editingSection.index === sectionIndex ? (
                      <input
                        type="number"
                        value={editData.dailyHours || ''}
                        onChange={(e) => handleInputChange('dailyHours', e.target.value)}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">
                        {safe(section.data.dailyHours)}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Haftalık Çalışma Günü
                    </label>
                    {editMode && editingSection?.type === 'applicationData' && editingSection.index === sectionIndex ? (
                      <input
                        type="number"
                        value={editData.weeklyDays || ''}
                        onChange={(e) => handleInputChange('weeklyDays', e.target.value)}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">
                        {safe(section.data.weeklyDays)}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Son Çalışma Tarihi
                    </label>
                    {editMode && editingSection?.type === 'applicationData' && editingSection.index === sectionIndex ? (
                      <input
                        type="date"
                        value={editData.lastWorkDate || ''}
                        onChange={(e) => handleInputChange('lastWorkDate', e.target.value)}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">
                        {safe(section.data.lastWorkDate)}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Yönetici
                    </label>
                    {editMode && editingSection?.type === 'applicationData' && editingSection.index === sectionIndex ? (
                      <input
                        type="text"
                        value={editData.supervisorName || ''}
                        onChange={(e) => handleInputChange('supervisorName', e.target.value)}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">
                        {safe(section.data.supervisorName)}
                      </p>
                    )}
                  </div>
                </div>
                {renderEditableFiles(section, sectionIndex, 'applicationData')}
              </div>
            )}
  
            {section.section === "postEmployment" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Şu Anki Şirket
                    </label>
                    {editMode && editingSection?.type === 'applicationData' && editingSection.index === sectionIndex ? (
                      <input
                        type="text"
                        value={editData.currentCompany || ''}
                        onChange={(e) => handleInputChange('currentCompany', e.target.value)}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">
                        {safe(section.data.currentCompany)}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Şu Anki Maaş
                    </label>
                    {editMode && editingSection?.type === 'applicationData' && editingSection.index === sectionIndex ? (
                      <input
                        type="text"
                        value={editData.currentSalary || ''}
                        onChange={(e) => handleInputChange('currentSalary', e.target.value)}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">
                        {safe(section.data.currentSalary)}
                      </p>
                    )}
                  </div>
                </div>
  
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Önceki İşler
                  </label>
                  {editMode && editingSection?.type === 'applicationData' && editingSection.index === sectionIndex ? (
                    <div className="space-y-2">
                      {(editData.previousJobs || []).map((job: any, jobIndex: number) => (
                        <div key={jobIndex} className="flex space-x-2">
                          <input
                            type="text"
                            value={job.company || ''}
                            onChange={(e) => {
                              const newJobs = [...editData.previousJobs];
                              newJobs[jobIndex] = {...newJobs[jobIndex], company: e.target.value};
                              handleInputChange('previousJobs', newJobs);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="Şirket"
                          />
                          <input
                            type="date"
                            value={job.startDate || ''}
                            onChange={(e) => {
                              const newJobs = [...editData.previousJobs];
                              newJobs[jobIndex] = {...newJobs[jobIndex], startDate: e.target.value};
                              handleInputChange('previousJobs', newJobs);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="Başlangıç"
                          />
                          <input
                            type="date"
                            value={job.endDate || ''}
                            onChange={(e) => {
                              const newJobs = [...editData.previousJobs];
                              newJobs[jobIndex] = {...newJobs[jobIndex], endDate: e.target.value};
                              handleInputChange('previousJobs', newJobs);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="Bitiş"
                          />
                          <button
                            onClick={() => {
                              const newJobs = [...editData.previousJobs];
                              newJobs.splice(jobIndex, 1);
                              handleInputChange('previousJobs', newJobs);
                            }}
                            className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          const newJobs = [...(editData.previousJobs || []), { company: '', startDate: '', endDate: '' }];
                          handleInputChange('previousJobs', newJobs);
                        }}
                        className="px-3 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 text-sm"
                      >
                        İş Ekle
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {section.data.previousJobs && section.data.previousJobs.map((job: any, index: number) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm font-medium text-gray-900">
                            {safe(job.company)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {safe(job.startDate)} - {safe(job.endDate)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
  
            {section.section === "evidenceWitness" && (
              <div className="space-y-6">
                {(section.data.hasWitnesses || (editMode && editingSection?.type === 'applicationData' && editingSection.index === sectionIndex && editData.hasWitnesses)) && (
                  <div>
                    <div className="flex items-center mb-2">
                      <label className="block text-sm font-medium text-gray-500 mr-3">
                        Tanıklar
                      </label>
                      {editMode && editingSection?.type === 'applicationData' && editingSection.index === sectionIndex && (
                        <input
                          type="checkbox"
                          checked={editData.hasWitnesses || false}
                          onChange={(e) => handleInputChange('hasWitnesses', e.target.checked)}
                          className="h-4 w-4"
                        />
                      )}
                    </div>
                    
                    {editMode && editingSection?.type === 'applicationData' && editingSection.index === sectionIndex && editData.hasWitnesses ? (
                      <div className="space-y-2">
                        {(editData.witnesses || []).map((witness: any, witnessIndex: number) => (
                          <div key={witnessIndex} className="flex space-x-2">
                            <input
                              type="text"
                              value={witness.firstName || ''}
                              onChange={(e) => {
                                const newWitnesses = [...editData.witnesses];
                                newWitnesses[witnessIndex] = {...newWitnesses[witnessIndex], firstName: e.target.value};
                                handleInputChange('witnesses', newWitnesses);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              placeholder="Ad"
                            />
                            <input
                              type="text"
                              value={witness.lastName || ''}
                              onChange={(e) => {
                                const newWitnesses = [...editData.witnesses];
                                newWitnesses[witnessIndex] = {...newWitnesses[witnessIndex], lastName: e.target.value};
                                handleInputChange('witnesses', newWitnesses);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              placeholder="Soyad"
                            />
                            <button
                              onClick={() => {
                                const newWitnesses = [...editData.witnesses];
                                newWitnesses.splice(witnessIndex, 1);
                                handleInputChange('witnesses', newWitnesses);
                              }}
                              className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            const newWitnesses = [...(editData.witnesses || []), { firstName: '', lastName: '' }];
                            handleInputChange('witnesses', newWitnesses);
                          }}
                          className="px-3 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 text-sm"
                        >
                          Tanık Ekle
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {section.data.witnesses && section.data.witnesses.map((witness: any, index: number) => (
                          <div key={index} className="text-sm text-gray-900">
                            {`${safe(witness.firstName)} ${safe(witness.lastName)}`}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
  
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Kanıt Bağlantıları
                  </label>
                  {editMode && editingSection?.type === 'applicationData' && editingSection.index === sectionIndex ? (
                    <div className="space-y-2">
                      {(editData.evidenceLinks || []).map((link: any, linkIndex: number) => (
                        <div key={linkIndex} className="flex space-x-2">
                          <input
                            type="url"
                            value={link.url || ''}
                            onChange={(e) => {
                              const newLinks = [...editData.evidenceLinks];
                              newLinks[linkIndex] = {...newLinks[linkIndex], url: e.target.value};
                              handleInputChange('evidenceLinks', newLinks);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="URL"
                          />
                          <button
                            onClick={() => {
                              const newLinks = [...editData.evidenceLinks];
                              newLinks.splice(linkIndex, 1);
                              handleInputChange('evidenceLinks', newLinks);
                            }}
                            className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          const newLinks = [...(editData.evidenceLinks || []), { url: '' }];
                          handleInputChange('evidenceLinks', newLinks);
                        }}
                        className="px-3 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 text-sm"
                      >
                        Bağlantı Ekle
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {section.data.evidenceLinks && section.data.evidenceLinks.map((evidenceLink:any, index: number) => (
                        <a
                          key={index}
                          href={evidenceLink.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                        >
                          <LinkIcon className="w-4 h-4 mr-1" />
                          {safe(evidenceLink.url)}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };
  

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#292A2D]"></div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <p className="text-red-800">{error || "Müvekkil bulunamadı"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Müvekkil Detayı
            </h2>
            <p className="text-sm text-gray-500">
              Başvuru No: {application.applicationNumber}
            </p>
          </div>
        </div>
        <div className="">
          <p className="text-sm text-gray-500">Update Status</p>
          <select
            value={selectedStatus}
            onChange={handleStatusChange}
            className="px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300 text-sm"
          >
            <option value="" disabled>
              Select a Status
            </option>
            {Object.values(ApplicationStatus).map((status) => (
              <option key={status} value={status}>
                {status.split('_').join(' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex divide-x divide-gray-200">
            <button
              onClick={() => setActiveTab("pre-application")}
              className={`flex-1 px-4 py-3 text-sm font-medium ${
                activeTab === "pre-application"
                  ? "text-[#292A2D] border-b-2 border-[#292A2D]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Ön Başvuru Bilgileri
            </button>
            <button
              onClick={() => setActiveTab("application")}
              className={`flex-1 px-4 py-3 text-sm font-medium ${
                activeTab === "application"
                  ? "text-[#292A2D] border-b-2 border-[#292A2D]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Detaylı Başvuru Bilgileri
            </button>
          </nav>
        </div>

        {activeTab === "pre-application"
          ? renderPreApplicationData()
          : renderApplicationData()}
      </div>
    </div>
  );
}
