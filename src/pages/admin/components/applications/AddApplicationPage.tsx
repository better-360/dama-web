import React, { useState } from 'react';
import { ArrowLeft, Upload, Trash2, Info } from 'lucide-react';

interface AddApplicationPageProps {
  onBack: () => void;
  onSubmit: (applicationData: any) => void;
}

export default function AddApplicationPage({ onBack, onSubmit }: AddApplicationPageProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    contact: {
      firstName: '',
      lastName: '',
      email: '',
      telephone: ''
    },
    incident: {
      incidentDescription: ''
    },
    passport: {
      passportFiles: [] as string[]
    },
    employment: {
      employmentFiles: [] as string[]
    },
    recognition: {
      files: [] as string[],
      hasDocuments: false
    },
    payment: {
      paymentFiles: [] as string[]
    }
  });

  const handleInputChange = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const handleFileUpload = (section: string, fileField: string) => {
    // In a real implementation, this would handle actual file uploads
    const mockFileUrl = `http://example.com/file-${Date.now()}.pdf`;
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [fileField]: [...prev[section as keyof typeof prev][fileField as keyof typeof prev[keyof typeof prev]], mockFileUrl]
      }
    }));
  };

  const handleRemoveFile = (section: string, fileField: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [fileField]: prev[section as keyof typeof prev][fileField as keyof typeof prev[keyof typeof prev]].filter((_: any, i: number) => i !== index)
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const applicationData = {
      applicationNumber: `APP-${Math.floor(Math.random() * 90000000) + 10000000}`,
      preApplicationData: [
        { section: 'contact', step: 1, data: formData.contact },
        { section: 'incident', step: 2, data: formData.incident },
        { section: 'passport', step: 3, data: formData.passport },
        { section: 'employment', step: 4, data: formData.employment },
        { section: 'recognition', step: 5, data: formData.recognition },
        { section: 'payment', step: 6, data: formData.payment }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    onSubmit(applicationData);
  };

  const renderFileUploadSection = (section: string, fileField: string, files: string[]) => (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <button
          type="button"
          onClick={() => handleFileUpload(section, fileField)}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          <Upload className="w-4 h-4 mr-2" />
          Dosya Yükle
        </button>
      </div>
      
      {files.length > 0 && (
        <div className="grid grid-cols-1 gap-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <span className="text-sm text-gray-600 truncate">Dosya {index + 1}</span>
              <button
                type="button"
                onClick={() => handleRemoveFile(section, fileField, index)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderInfoBox = (title: string, description: string) => (
    <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
      <div className="flex items-start">
        <Info className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
        <div>
          <h4 className="text-sm font-medium text-blue-900">{title}</h4>
          <p className="mt-1 text-sm text-blue-700">{description}</p>
        </div>
      </div>
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Kişisel Bilgiler</h3>
            {renderInfoBox(
              "Kişisel Bilgiler Hakkında",
              "Başvuru sahibinin temel iletişim bilgilerini eksiksiz doldurunuz."
            )}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Ad</label>
                <input
                  type="text"
                  value={formData.contact.firstName}
                  onChange={(e) => handleInputChange('contact', 'firstName', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#292A2D] focus:ring-[#292A2D] sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Soyad</label>
                <input
                  type="text"
                  value={formData.contact.lastName}
                  onChange={(e) => handleInputChange('contact', 'lastName', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#292A2D] focus:ring-[#292A2D] sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">E-posta</label>
                <input
                  type="email"
                  value={formData.contact.email}
                  onChange={(e) => handleInputChange('contact', 'email', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#292A2D] focus:ring-[#292A2D] sm:text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Telefon</label>
                <input
                  type="tel"
                  value={formData.contact.telephone}
                  onChange={(e) => handleInputChange('contact', 'telephone', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#292A2D] focus:ring-[#292A2D] sm:text-sm"
                  required
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Üslerde Yaşanan Olaylar</h3>
            {renderInfoBox(
              "Olay Detayları Hakkında",
              "Başvuru sahibinin üslerde çalıştığı süre boyunca yaşadığı olayları detaylı bir şekilde açıklayan mektubu bu alana giriniz. Olayların tarihleri, yerleri ve detayları önemlidir."
            )}
            <div>
              <textarea
                rows={12}
                value={formData.incident.incidentDescription}
                onChange={(e) => handleInputChange('incident', 'incidentDescription', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#292A2D] focus:ring-[#292A2D] sm:text-sm"
                placeholder="Üslerde yaşanan olayları, tarihleri ve yerleri ile birlikte detaylı bir şekilde açıklayınız..."
                required
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Pasaport ve Seyahat Belgeleri</h3>
            {renderInfoBox(
              "Pasaport Belgeleri Hakkında",
              "Üslerde çalışırken kullanılan pasaport ve yurt dışı giriş-çıkış belgelerini yükleyiniz. Özellikle çalışma dönemindeki seyahat kayıtları önemlidir."
            )}
            {renderFileUploadSection('passport', 'passportFiles', formData.passport.passportFiles)}
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">İstihdam Belgeleri</h3>
            {renderInfoBox(
              "İstihdam Belgeleri Hakkında",
              "Çalışılan firmalara ait belgeler, iş sözleşmeleri, görev yazıları ve benzeri istihdam ilişkisini gösteren tüm belgeleri yükleyiniz."
            )}
            {renderFileUploadSection('employment', 'employmentFiles', formData.employment.employmentFiles)}
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Takdir ve Teşekkür Belgeleri</h3>
            {renderInfoBox(
              "Takdir Belgeleri Hakkında",
              "Çalışma süresince alınan takdir, teşekkür, başarı belgeleri ve benzeri dokümanları yükleyiniz. Bu belgeler başvurunuzu güçlendirecektir."
            )}
            <div className="space-y-4">
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.recognition.hasDocuments}
                    onChange={(e) => handleInputChange('recognition', 'hasDocuments', e.target.checked)}
                    className="rounded border-gray-300 text-[#292A2D] focus:ring-[#292A2D]"
                  />
                  <span className="text-sm text-gray-700">Takdir/Teşekkür belgelerim mevcut</span>
                </label>
              </div>
              {formData.recognition.hasDocuments && (
                renderFileUploadSection('recognition', 'files', formData.recognition.files)
              )}
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Ödeme Kayıtları</h3>
            {renderInfoBox(
              "Ödeme Belgeleri Hakkında",
              "Maaş ödemeleri, banka hesap hareketleri ve diğer finansal kayıtları yükleyiniz. Amerika'da iş ilişkisinin ispatında ilk ücret ödemesi önemlidir, kime yapıldığı önemli değildir."
            )}
            {renderFileUploadSection('payment', 'paymentFiles', formData.payment.paymentFiles)}
          </div>
        );
      default:
        return null;
    }
  };

  const steps = [
    { number: 1, title: 'Kişisel Bilgiler' },
    { number: 2, title: 'Olay Detayları' },
    { number: 3, title: 'Pasaport' },
    { number: 4, title: 'İstihdam' },
    { number: 5, title: 'Takdir' },
    { number: 6, title: 'Ödemeler' }
  ];

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
            <h2 className="text-2xl font-semibold text-gray-900">Yeni Başvuru Ekle</h2>
            <p className="text-sm text-gray-500">Tüm bilgileri eksiksiz doldurunuz</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex divide-x divide-gray-200">
            {steps.map((step) => (
              <button
                key={step.number}
                onClick={() => setCurrentStep(step.number)}
                className={`flex-1 px-4 py-3 text-sm font-medium ${
                  currentStep === step.number
                    ? 'text-[#292A2D] border-b-2 border-[#292A2D]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {step.title}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {renderStep()}
            
            <div className="mt-6 flex justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                disabled={currentStep === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Önceki
              </button>
              
              {currentStep < 6 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(prev => Math.min(6, prev + 1))}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#292A2D] rounded-md hover:bg-[#292A2D]/90"
                >
                  Sonraki
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                  Başvuruyu Tamamla
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}