import React from 'react';
import { Eye, Trash2 } from 'lucide-react';
import type { Client } from '../../types/client';
import { statusClasses, statusLabels } from '../../types/client';

interface ClientsTableProps {
  clients: Client[];
  onViewDetails: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ClientsTable({ clients, onViewDetails, onDelete }: ClientsTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ad Soyad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Telefon
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Durum
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {`${client.firstName} ${client.lastName}`}
                  </div>
                  <div className="text-sm text-gray-500">{client.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {client.telephone}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[client.status]}`}>
                    {statusLabels[client.status]}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onViewDetails(client.id)}
                      className="text-[#292A2D] hover:text-[#292A2D]/80 transition-colors"
                      title="Detayları Görüntüle"
                    >
                      <Eye size={20} />
                    </button>
                    <button
                      onClick={() => onDelete(client.id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                      title="Sil"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}