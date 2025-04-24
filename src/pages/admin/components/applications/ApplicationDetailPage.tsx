import { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Download, Calendar, UserPlus } from 'lucide-react';
import type { ApplicationDetail } from '../../types/applicationDetail';
import { sectionLabels } from '../../types/applicationDetail';
import AppointmentModal from './AppointmentModal';
import ConfirmationModal from './ConfirmationModal';
import { getApplication, getFileUrl, setAsClient, updateApplicationStatus } from '../../../../http/requests/admin';
import { useNavigate } from 'react-router-dom';
import { ApplicationStatus } from '../../../../types/status';
import toast from 'react-hot-toast';

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
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | ''>('')


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
          {application.preApplicationData.map((section) => (
            <div key={section.section} className="p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                {sectionLabels[section.section]}
              </h4>
              
              {section.section === 'contact' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Ad Soyad</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {section.data.firstName} {section.data.lastName}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">E-posta</label>
                    <p className="mt-1 text-sm text-gray-900">{section.data.email}</p>
                  </div>
                </div>
              )}

              {section.section === 'incident' && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Olay Açıklaması</label>
                    <p className="mt-2 text-sm text-gray-900 break-words whitespace-pre-wrap">
                    {section.data.incidentDescription}
                    </p>
                </div>
              )}

              {['passport', 'employment', 'recognition', 'payment'].includes(section.section) && 
                renderFiles(getFilesForSection(section))}
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