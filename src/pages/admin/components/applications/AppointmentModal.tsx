import React, { useState } from 'react';
import { Calendar, Clock, X, MessageSquare, Video, Users } from 'lucide-react';
import { createAppointment } from '../../../../http/requests/admin';
import toast from 'react-hot-toast';

// Enum değerleri (Prisma modelinizle eşleşmeli)
export enum AppointmentType {
  ONLINE = 'ONLINE',
  IN_PERSON = 'INOFFICE',
}

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (param:any) => void;
  applicatorId: string;
}

export default function AppointmentModal({ isOpen, onClose, onSubmit,applicatorId }: AppointmentModalProps) {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [appointmentType, setAppointmentType] = useState<AppointmentType>(AppointmentType.ONLINE);

  if(!applicatorId){
    toast.error('Başvuru sahibi bulunamadı');
    return null;
  }
  // Modal açık değilse hiçbir şey render etme
  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dateTime = new Date(`${selectedDate}T${selectedTime}`);
    const appointmentData= {
      applicatorId,
      dateTime,
      notes,
      appointmentType,
    };
    // Call the onSubmit function with the appointment data
    try {
      await createAppointment(appointmentData);
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast.error('Randevu oluşturulurken bir hata oluştu');
    }
    onSubmit(dateTime);
  };

  // Generate time slots from 09:00 to 17:00
  const timeSlots = Array.from({ length: 17 }, (_, i) => {
    const hour = Math.floor(i / 2) + 9;
    const minute = i % 2 === 0 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minute}`;
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Randevu Oluştur</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>Tarih</span>
              </div>
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#292A2D] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>Saat</span>
              </div>
            </label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#292A2D] focus:border-transparent"
            >
              <option value="">Saat seçin</option>
              {timeSlots.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center gap-2">
                <MessageSquare size={16} />
                <span>Notlar (İsteğe bağlı)</span>
              </div>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Randevu ile ilgili notlar..."
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#292A2D] focus:border-transparent"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center gap-2">
                <Video size={16} />
                <span>Randevu Türü</span>
              </div>
            </label>
            <div className="flex gap-4 mt-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  checked={appointmentType === AppointmentType.ONLINE}
                  onChange={() => setAppointmentType(AppointmentType.ONLINE)}
                  className="form-radio text-[#292A2D] focus:ring-[#292A2D]"
                />
                <div className="flex items-center gap-1">
                  <Video size={16} />
                  <span>Online</span>
                </div>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  checked={appointmentType === AppointmentType.IN_PERSON}
                  onChange={() => setAppointmentType(AppointmentType.IN_PERSON)}
                  className="form-radio text-[#292A2D] focus:ring-[#292A2D]"
                />
                <div className="flex items-center gap-1">
                  <Users size={16} />
                  <span>Yüz yüze</span>
                </div>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-[#292A2D] rounded-md hover:bg-[#292A2D]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#292A2D]"
            >
              Randevu Oluştur
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}