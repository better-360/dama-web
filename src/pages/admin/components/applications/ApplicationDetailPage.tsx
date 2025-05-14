import { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Download, Calendar, UserPlus, Edit, Save, X } from 'lucide-react';
import type { ApplicationDetail } from '../../types/applicationDetail';
import { sectionLabels } from '../../types/applicationDetail';
import AppointmentModal from './AppointmentModal';
import ConfirmationModal from './ConfirmationModal';
import { getApplication, getFileUrl, setAsClient, updateApplicationStatus, updateApplication } from '../../../../http/requests/admin';
import { useNavigate } from 'react-router-dom';
import { ApplicationStatus } from '../../../../types/status';
import toast from 'react-hot-toast';
import AdminFileUploadComponent from './UploadComponent';

interface ApplicationDetailPageProps {
  id: string;
  onBack: () => void;
}

export default function ApplicationDetailPage({ id, onBack }: ApplicationDetailPageProps) {
  const [application, setApplication] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | ''>('');
  const [editMode, setEditMode] = useState(false);
  const [editingSection, setEditingSection] = useState<{ index: number } | null>(null);
  const [editData, setEditData] = useState<any>(null);
  const [tempFiles, setTempFiles] = useState<File[]>([]);
  const [fileUploadError, setFileUploadError] = useState<string | null>(null);

  const navigate=useNavigate();
  useEffect(() => {
    fetchApplicationDetail();
  }, [id]);

  const fetchApplicationDetail = async () => {
    try {
      setLoading(true);
      setError(null);    

      const res= await getApplication(id);

      console.log('Fetched application detail:', res); // Debug log
      setApplication(res);
    } catch (err) {
      console.error('Error in fetchApplicationDetail:', err);
      setError('Başvuru detayları yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (index: number, data: any) => {
    setEditingSection({ index });
    setEditData({ ...data });
    setEditMode(true);
    setTempFiles([]); // Reset files when starting to edit
    setFileUploadError(null);
  };

  const cancelEditing = () => {
    setEditingSection(null);
    setEditData(null);
    setEditMode(false);
    setTempFiles([]);
    setFileUploadError(null);
  };

  const handleInputChange = (field: string, value: any) => {
    setEditData((prev:any) => ({
      ...prev,
      [field]: value
    }));
  };

  const getFileFieldName = (sectionType: string): string => {
    switch (sectionType) {
      case 'passport':
        return 'passportFiles';
      case 'employment':
        return 'employmentFiles';
      case 'recognition':
        return 'files';
      case 'payment':
        return 'paymentFiles';
      case 'incident':
        return 'incidentFiles';
      default:
        return 'files';
    }
  };

  const getFolderName = (sectionType: string): string => {
    switch (sectionType) {
      case 'passport':
        return 'passport-documents';
      case 'employment':
        return 'employment-documents';
      case 'recognition':
        return 'recognition-documents';
      case 'payment':
        return 'payment-documents';
      case 'incident':
        return 'incident-documents';
      default:
        return 'documents';
    }
  };

  const getSectionLabel = (sectionType: string): string => {
    switch (sectionType) {
      case 'passport':
        return 'Pasaport Belgeleri';
      case 'employment':
        return 'İstihdam Belgeleri';
      case 'recognition':
        return 'Takdir Belgeleri';
      case 'payment':
        return 'Ödeme Belgeleri';
      case 'incident':
        return 'Olay Belgeleri';
      default:
        return 'Belgeler';
    }
  };

  const handleUploadComplete = async (fileKeys: string[], sectionType: string) => {
    const fileField = getFileFieldName(sectionType);
    
    // Mevcut dosyalara yeni dosyaları ekle
    setEditData((prev: any) => {
      const currentFiles = prev[fileField] || [];
      return {
        ...prev,
        [fileField]: [...currentFiles, ...fileKeys]
      };
    });
    
    console.log(`Dosyalar yüklendi, ${fileField} alanına eklendi:`, fileKeys);
    
    // Kullanıcıya bilgi ver ve Kaydet düğmesine basmasını hatırlat
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

  const saveChanges = async () => {
    if (!editingSection || !application) return;

    try {
      setLoading(true);
      console.log('Saving data:', editData);
      
      await updateApplication(application.applicatorId, 'preApplicationData', editingSection.index, editData);
      
      // Update local state
      setApplication(prev => {
        if (!prev) return null;
        
        const updatedData = [...prev.preApplicationData];
        updatedData[editingSection.index] = {
          ...updatedData[editingSection.index],
          data: editData
        };
        
        console.log('Updated application data:', updatedData[editingSection.index]);
        
        return {
          ...prev,
          preApplicationData: updatedData
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

  const handleAppointmentSubmit = async (date: Date) => {
    try {
      if (application) {
        setApplication((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            status: 'APPOINTMENT_SCHEDULED',
            appointmentDate: date.toISOString()
          };
        });
      }
      
      setIsAppointmentModalOpen(false);
      // You could show a success message here
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      // You could show an error message here
    }
  };

  const handleAddAsClient = async () => {
    try {      
      if(!application) return;
      await setAsClient(application.applicatorId)
      if (application) {
        const updatedApplication = {
          ...application,
          status: 'CLIENT'
        };
        setApplication(updatedApplication);
        navigate('/admin/clients',{replace:true})
      }
      
      // You could show a success message here
    } catch (error) {
      console.error('Error adding as client:', error);
      // You could show an error message here
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
  

  const getFilesForSection = (section: any) => {
    if (!section || !section.data) return undefined;

    switch (section.section) {
      case 'passport':
        return section.data.passportFiles;
      case 'employment':
        return section.data.employmentFiles;
      case 'recognition':
        return section.data.files;
      case 'payment':
        return section.data.paymentFiles;
      case 'incident':
        return section.data.incidentFiles;
      default:
        return undefined;
    }
  };

  const getFileLink = async (file: string) => {
    try {
      const fileUrl = await getFileUrl(file);
      console.log('File URL:', fileUrl); // Debug log
      window.open(fileUrl, '_blank');
    } catch (error) {
      console.error('Error in getFileLink:', error);
    }
  };

  const renderFiles = (files: string[] | undefined) => {
    if (!files || files.length === 0) {
      return (
        <p className="text-sm text-gray-500 italic">Dosya yüklenmemiş</p>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {files.map((file, index) => (
          <button
            key={index}
            onClick={() => getFileLink(file)}
            className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FileText className="w-5 h-5 text-gray-500 mr-2" />
            <span className="text-sm text-gray-700 truncate">Dosya {file}</span>
            <Download className="w-4 h-4 text-gray-500 ml-auto" />
          </button>
        ))}
      </div>
    );
  };

  const renderEditableFiles = (section: any, sectionIndex: number) => {
    const sectionType = section.section;
    const fileField = getFileFieldName(sectionType);
    const folderName = getFolderName(sectionType);
    const sectionLabel = getSectionLabel(sectionType);
    
    if (editMode && editingSection?.index === sectionIndex) {
      // Edit modundayız, AdminFileUploadComponent'i göster ve mevcut dosyaları da listele
      return (
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-500 mb-3">{sectionLabel}</label>
          
          {/* Mevcut yüklenmiş dosyaları göster */}
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
          
          {/* Yeni dosya yükleme komponenti */}
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
              maxSize={10} // 10MB limit
            />
            {fileUploadError && (
              <p className="text-sm text-red-600 mt-2">{fileUploadError}</p>
            )}
            
            {/* Kullanıcıya hatırlatma */}
            {tempFiles.length > 0 && (
              <div className="bg-blue-50 text-blue-700 p-3 rounded-md mt-3 text-sm">
                Dosyaları yükledikten sonra, değişiklikleri kaydetmek için sayfanın üstündeki <b>Kaydet</b> düğmesine basmayı unutmayın.
              </div>
            )}
          </div>
        </div>
      );
    } else {
      // Normal görüntüleme modundayız, mevcut dosyaları göster
      return renderFiles(getFilesForSection(section));
    }
  };

  const getUserFullName = () => {
    const contactSection = application?.preApplicationData.find(section => section.section === 'contact');
    if (contactSection?.data) {
      return `${contactSection.data.firstName} ${contactSection.data.lastName}`;
    }
    return 'Kullanıcı';
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
        <p className="text-red-800">{error || 'Başvuru bulunamadı'}</p>
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
            <h2 className="text-2xl font-semibold text-gray-900">Başvuru Detayı</h2>
            <p className="text-sm text-gray-500">Başvuru No: {application.applicationNumber}</p>
          </div>
        </div>
        
        <div className="flex space-x-3">  
          {/* ——— Status Dropdown ——— */}
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
            {status.split('_').join(' ')}  {/* alt çizgileri boşlukla değiştirir */}
          </option>
        ))}
      </select>

          <button
            onClick={() => setIsConfirmationModalOpen(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            <span>Müvekkil Olarak Ekle</span>
          </button>
          
          <button
            onClick={() => setIsAppointmentModalOpen(true)}
            className="flex items-center px-4 py-2 bg-[#292A2D] text-white rounded-lg hover:bg-[#292A2D]/90 transition-colors"
          >
            <Calendar className="w-5 h-5 mr-2" />
            <span>Randevu Oluştur</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Ön Başvuru Bilgileri</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {application.preApplicationData.map((section, sectionIndex) => (
            <div key={section.section} className="p-6 relative">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-medium text-gray-900">
                  {sectionLabels[section.section]}
                </h4>
                {editMode && editingSection?.index === sectionIndex ? (
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
                    onClick={() => startEditing(sectionIndex, section.data)}
                    className="p-1 bg-gray-50 text-gray-600 rounded hover:bg-gray-100"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              {section.section === 'contact' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Ad Soyad</label>
                    {editMode && editingSection?.index === sectionIndex ? (
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
                    <label className="block text-sm font-medium text-gray-500">E-posta</label>
                    {editMode && editingSection?.index === sectionIndex ? (
                      <input
                        type="email"
                        value={editData.email || ''}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">{section.data.email}</p>
                    )}
                  </div>
                </div>
              )}

              {section.section === 'incident' && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Olay Açıklaması</label>
                  {editMode && editingSection?.index === sectionIndex ? (
                    <textarea
                      value={editData.incidentDescription || ''}
                      onChange={(e) => handleInputChange('incidentDescription', e.target.value)}
                      className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md"
                      rows={5}
                    />
                  ) : (
                    <p className="mt-2 text-sm text-gray-900 break-words whitespace-pre-wrap">
                      {section.data.incidentDescription}
                    </p>
                  )}
                  
                  {/* Dosya render işlemi için ortak fonksiyonu kullan */}
                  {renderEditableFiles(section, sectionIndex)}
                </div>
              )}

              {/* Tüm dosya bölümleri için ortak yaklaşım */}
              {['passport', 'employment', 'recognition', 'payment'].includes(section.section) && (
                <div>
                  {renderEditableFiles(section, sectionIndex)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <AppointmentModal
        applicatorId={application.applicatorId}
        isOpen={isAppointmentModalOpen}
        onClose={() => setIsAppointmentModalOpen(false)}
        onSubmit={handleAppointmentSubmit}
      />

      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        onConfirm={handleAddAsClient}
        title="Müvekkil Olarak Ekle"
        message={`${getUserFullName()} müvekkil olarak eklenecektir. Bu işlem geri alınamaz. Onaylıyor musunuz?`}
        confirmText="Müvekkil Olarak Ekle"
        cancelText="İptal"
      />
    </div>
  );
}