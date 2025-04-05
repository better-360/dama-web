import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Appointment } from '../../types/appointment';
import AppointmentsTable from './AppointmentsTable';
import { getAppointments } from '../../../../http/requests/admin';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
     const apps= await getAppointments();
      setAppointments(apps);
      setError(null);
    } catch (err) {
      setError('Randevular yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousMonth = () => {
    setSelectedDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setSelectedDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const filteredAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.dateTime);
    return (
      appointmentDate.getMonth() === selectedDate.getMonth() &&
      appointmentDate.getFullYear() === selectedDate.getFullYear()
    );
  });

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Randevular</h2>
          <p className="mt-1 text-sm text-gray-500">
            Müvekkil randevularını görüntüleyin ve yönetin
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200">
            <button
              onClick={handlePreviousMonth}
              className="p-2 hover:bg-gray-50 rounded-l-lg"
            >
              <ChevronLeft className="w-5 h-5 text-gray-500" />
            </button>
            
            <div className="px-4 py-2 flex items-center">
              <CalendarIcon className="w-5 h-5 text-gray-500 mr-2" />
              <span className="text-sm font-medium">
                {selectedDate.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
              </span>
            </div>

            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-50 rounded-r-lg"
            >
              <ChevronRight className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      <AppointmentsTable appointments={filteredAppointments} />
    </div>
  );
}