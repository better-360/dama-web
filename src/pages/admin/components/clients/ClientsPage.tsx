import { useState, useEffect } from 'react';
import ClientsTable from './ClientsTable';
import ClientDetailPage from './ClientDetailPage';
import type { Client } from '../../types/client';
import { deleteApplication } from '../../../../http/requests/admin';

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch('https://apidama.betterdemo.com.tr/api/admin/clients');
      if (!response.ok) {
        throw new Error('Müvekkiller yüklenirken bir hata oluştu');
      }
      const data = await response.json();
      setClients(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (id: string) => {
    setSelectedClientId(id);
  };

  const handleBack = () => {
    setSelectedClientId(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bu Clientı silmek istediğinizden emin misiniz?')) {
     try {
      setLoading(true);
      await deleteApplication(id);
      setClients(clients.filter(client => client.id !== id));
     } catch (error) {
      console.error('Error deleting application:', error);
      setError('Başvuru silinirken bir hata oluştu');
     } finally {
      setLoading(false);
     }
    }
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

  if (selectedClientId) {
    return <ClientDetailPage id={selectedClientId} onBack={handleBack} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Müvekkiller</h2>
          <p className="mt-1 text-sm text-gray-500">
            Tüm müvekkilleri görüntüleyin ve yönetin
          </p>
        </div>
      </div>

      <ClientsTable
        clients={clients}
        onViewDetails={handleViewDetails}
        onDelete={handleDelete}
      />
    </div>
  );
}