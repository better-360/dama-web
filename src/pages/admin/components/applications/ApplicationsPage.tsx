import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import ApplicationsTable from './ApplicationsTable';
import ApplicationDetailPage from './ApplicationDetailPage';
import AddApplicationPage from './AddApplicationPage';
import type { Application } from '../../types/application';
import { deleteApplication, getApplicators } from '../../../../http/requests/admin';

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  const [isAddingApplication, setIsAddingApplication] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await getApplicators();
      console.log('Fetched applications:', response); // Debug log
      setApplications(response);
      setLoading(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (id: string) => {
    console.log('Setting selected application ID:', id); // Debug log
    setSelectedApplicationId(id);
  };

  const handleBack = () => {
    setSelectedApplicationId(null);
    setIsAddingApplication(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bu başvuruyu silmek istediğinizden emin misiniz?')) {
     try {
      setLoading(true);
      await deleteApplication(id);
      setApplications(applications.filter(app => app.applicatorId !== id));
     } catch (error) {
      console.error('Error deleting application:', error);
      setError('Başvuru silinirken bir hata oluştu');
     } finally {
      setLoading(false);
     }
    }
  };

  const handleAddApplication = (applicationData: any) => {
    const newApplication = {
      applicatorId: `app-${Date.now()}`,
      telephone: applicationData.preApplicationData.find((section: any) => section.section === 'contact')?.data.telephone || '',
      firstName: applicationData.preApplicationData.find((section: any) => section.section === 'contact')?.data.firstName || '',
      lastName: applicationData.preApplicationData.find((section: any) => section.section === 'contact')?.data.lastName || '',
      email: applicationData.preApplicationData.find((section: any) => section.section === 'contact')?.data.email || '',
      birthDate: null,
      address: null,
      status: "APPLICATOR" as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null
    };

    setApplications(prev => [newApplication, ...prev]);
    setIsAddingApplication(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#292A2D]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  if (isAddingApplication) {
    return <AddApplicationPage onBack={handleBack} onSubmit={handleAddApplication} />;
  }

  if (selectedApplicationId) {
    return <ApplicationDetailPage id={selectedApplicationId} onBack={handleBack} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Başvurular</h2>
          <p className="mt-1 text-sm text-gray-500">
            Tüm başvuruları görüntüleyin ve yönetin
          </p>
        </div>

        <button
          onClick={() => setIsAddingApplication(true)}
          className="flex items-center px-4 py-2 bg-[#292A2D] text-white rounded-lg hover:bg-[#292A2D]/90 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          <span>Yeni Başvuru Ekle</span>
        </button>
      </div>

      <ApplicationsTable
        applications={applications}
        onViewDetails={handleViewDetails}
        onDelete={handleDelete}
      />
    </div>
  );
}