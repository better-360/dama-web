import React, { useState } from 'react';
import { ArrowLeft, Info, Check, AlertCircle, Loader, Phone, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AdminFileUploadComponent from './UploadComponent';

// SectionData type definition - matches the API format directly
interface SectionData {
  step: number;
  section: string;
  data: any;
}

// API Functions
const createApplication = async (contactData: any): Promise<string> => {
  // Simulate API call to create application with contact data
  console.log('Creating application with contact data:', contactData);
  
  // Simulate API delay and return a fake ID
  await new Promise(resolve => setTimeout(resolve, 1000));
  return `app-${Date.now()}`;
};

const updateApplicationStep = async (applicationId: string, stepData: SectionData): Promise<boolean> => {
  // Simulate API call to update a specific step
  console.log(`Updating application ${applicationId} with step data:`, stepData);
  
  // Simulate API delay and return success
  await new Promise(resolve => setTimeout(resolve, 1000));
  return true;
};

interface AddApplicationPageProps {
  onBack: () => void;
  onSubmit: (applicationData: SectionData[]) => void;
}

export default function AddApplicationPage({ onBack, onSubmit }: AddApplicationPageProps) {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [applicationCreated, setApplicationCreated] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  
  // Track which steps are completed
  const [stepsCompleted, setStepsCompleted] = useState<{[key: number]: boolean}>({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false
  });
  
  // Local file management states
  const [passportFiles, setPassportFiles] = useState<File[]>([]);
  const [employmentFiles, setEmploymentFiles] = useState<File[]>([]);
  const [recognitionFiles, setRecognitionFiles] = useState<File[]>([]);
  const [paymentFiles, setPaymentFiles] = useState<File[]>([]);
  
  // Error management per section
  const [passportError, setPassportError] = useState<string | null>(null);
  const [employmentError, setEmploymentError] = useState<string | null>(null);
  const [recognitionError, setRecognitionError] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  
  // Main form data structure - using the exact format expected by the API
  const [sectionsData, setSectionsData] = useState<SectionData[]>([
    {
      step: 1,
      section: "contact",
      data: {
        firstName: "",
        lastName: "",
        birthDate: new Date().toISOString().split('T')[0],
        email: "",
        telephone: "",
      },
    },
    {
      step: 2,
      section: "incident",
      data: {
        incidentDescription: "",
      },
    },
    {
      step: 3,
      section: "passport",
      data: {
        employmentFiles: [],
      },
    },
    {
      step: 4,
      section: "employment",
      data: {
        employmentFiles: [],
      },
    },
    {
      step: 5,
      section: "recognition",
      data: {
        files: [],
        hasDocuments: false,
      },
    },
    {
      step: 6,
      section: "payment",
      data: {
        paymentFiles: [],
      },
    }
  ]);

  // Helper function to get a specific section data
  const getSectionData = (sectionName: string): any => {
    const section = sectionsData.find(section => section.section === sectionName);
    return section ? section.data : null;
  };

  // Helper function to update a specific field in a section
  const updateSectionField = (sectionName: string, fieldName: string, value: any) => {
    setSectionsData(prevSections => 
      prevSections.map(section => 
        section.section === sectionName 
          ? { 
              ...section, 
              data: { 
                ...section.data, 
                [fieldName]: value 
              } 
            } 
          : section
      )
    );
  };

  // Helper function to update an entire section's data
  const updateSectionData = (sectionName: string, newData: any) => {
    setSectionsData(prevSections => 
      prevSections.map(section => 
        section.section === sectionName 
          ? { 
              ...section, 
              data: newData
            } 
          : section
      )
    );
  };

  // Handle file uploads for each section
  const handlePassportFileUpload = (fileKeys: string[]) => {
    const currentFiles = getSectionData('passport')?.employmentFiles || [];
    updateSectionField('passport', 'employmentFiles', [...currentFiles, ...fileKeys]);
  };

  const handleEmploymentFileUpload = (fileKeys: string[]) => {
    const currentFiles = getSectionData('employment')?.employmentFiles || [];
    updateSectionField('employment', 'employmentFiles', [...currentFiles, ...fileKeys]);
  };

  const handleRecognitionFileUpload = (fileKeys: string[]) => {
    const currentFiles = getSectionData('recognition')?.files || [];
    updateSectionField('recognition', 'files', [...currentFiles, ...fileKeys]);
  };

  const handlePaymentFileUpload = (fileKeys: string[]) => {
    const currentFiles = getSectionData('payment')?.paymentFiles || [];
    updateSectionField('payment', 'paymentFiles', [...currentFiles, ...fileKeys]);
  };

  // Validation functions for each step
  const validateContactInfo = (): boolean => {
    const contactData = getSectionData('contact');
    
    if (!contactData.firstName.trim()) {
      setFormError('Ad alanı zorunludur');
      return false;
    }
    if (!contactData.lastName.trim()) {
      setFormError('Soyad alanı zorunludur');
      return false;
    }
    if (!contactData.telephone.trim()) {
      setFormError('Telefon numarası zorunludur');
      return false;
    }
    // Add phone number validation
    const phoneRegex = /^[0-9+\s()-]{10,15}$/;
    if (!phoneRegex.test(contactData.telephone)) {
      setFormError('Geçerli bir telefon numarası giriniz');
      return false;
    }
    return true;
  };

  const validateIncidentInfo = (): boolean => {
    const incidentData = getSectionData('incident');
    
    if (!incidentData.incidentDescription.trim()) {
      setFormError('Olay açıklaması zorunludur');
      return false;
    }
    if (incidentData.incidentDescription.length < 50) {
      setFormError('Olay açıklaması en az 50 karakter olmalıdır');
      return false;
    }
    return true;
  };

  const validatePassportFiles = (): boolean => {
    const passportData = getSectionData('passport');
    
    if (passportData.employmentFiles.length === 0) {
      setFormError('En az bir pasaport belgesi yüklemeniz gerekmektedir');
      return false;
    }
    return true;
  };

  const validateEmploymentFiles = (): boolean => {
    const employmentData = getSectionData('employment');
    
    if (employmentData.employmentFiles.length === 0) {
      setFormError('En az bir istihdam belgesi yüklemeniz gerekmektedir');
      return false;
    }
    return true;
  };

  const validateRecognitionInfo = (): boolean => {
    const recognitionData = getSectionData('recognition');
    
    if (recognitionData.hasDocuments && recognitionData.files.length === 0) {
      setFormError('Takdir belgesi olduğunu belirttiniz, en az bir belge yüklemeniz gerekmektedir');
      return false;
    }
    return true;
  };

  const validatePaymentFiles = (): boolean => {
    const paymentData = getSectionData('payment');
    
    if (paymentData.paymentFiles.length === 0) {
      setFormError('En az bir ödeme belgesi yüklemeniz gerekmektedir');
      return false;
    }
    return true;
  };

  // Validate current step
  const validateCurrentStep = (): boolean => {
    setFormError(null);
    
    switch (currentStep) {
      case 1:
        return validateContactInfo();
      case 2:
        return validateIncidentInfo();
      case 3:
        return validatePassportFiles();
      case 4:
        return validateEmploymentFiles();
      case 5:
        return validateRecognitionInfo();
      case 6:
        return validatePaymentFiles();
      default:
        return true;
    }
  };

  // Create application with contact info
  const handleCreateApplication = async () => {
    if (!validateContactInfo()) {
      return;
    }
    
    setIsSubmitting(true);
    setFormError(null);
    
    try {
      const contactData = getSectionData('contact');
      
      // Call API to create application with contact data
      const appId = await createApplication(contactData);
      
      // Update state to indicate application has been created
      setApplicationId(appId);
      setApplicationCreated(true);
      setStepsCompleted(prev => ({ ...prev, 1: true }));
      
      // Move to next step
      setCurrentStep(2);
    } catch (error) {
      console.error('Error creating application:', error);
      setFormError('Başvuru oluşturulurken bir hata oluştu. Lütfen tekrar deneyiniz.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Save current step and continue
  const handleSaveAndContinue = async () => {
    if (!validateCurrentStep() || !applicationId) {
      return;
    }
    
    setIsSubmitting(true);
    setFormError(null);
    
    try {
      // Get the current step data
      const currentSectionData = sectionsData.find(section => section.step === currentStep);
      
      if (!currentSectionData) {
        throw new Error(`Step data not found for step ${currentStep}`);
      }
      
      // Call API to update step
      const success = await updateApplicationStep(applicationId, currentSectionData);
      
      if (success) {
        // Update completion status
        setStepsCompleted(prev => ({ ...prev, [currentStep]: true }));
        
        // Move to next step
        setCurrentStep(prev => Math.min(6, prev + 1));
      } else {
        setFormError('Adım kaydedilirken bir hata oluştu. Lütfen tekrar deneyiniz.');
      }
    } catch (error) {
      console.error('Error saving step:', error);
      setFormError('Adım kaydedilirken bir hata oluştu. Lütfen tekrar deneyiniz.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Move to previous step
  const handlePrevStep = () => {
    setFormError(null);
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  // Submit final form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate the current step first
    if (!validateCurrentStep() || !applicationId) {
      return;
    }
    
    setIsSubmitting(true);
    setFormError(null);
    
    try {
      // Get the current step data
      const currentSectionData = sectionsData.find(section => section.step === currentStep);
      
      if (!currentSectionData) {
        throw new Error(`Step data not found for step ${currentStep}`);
      }
      
      // Update the final step
      const success = await updateApplicationStep(applicationId, currentSectionData);
      
      if (success) {
        // Call the onSubmit callback with all section data
        onSubmit(sectionsData);
      } else {
        setFormError('Başvuru tamamlanırken bir hata oluştu. Lütfen tekrar deneyiniz.');
      }
    } catch (error) {
      console.error('Form gönderim hatası:', error);
      setFormError('Başvuru gönderilirken bir hata oluştu. Lütfen tekrar deneyiniz.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle direct step navigation
  const handleStepNavigation = (step: number) => {
    // Only allow navigating to completed steps or the current active step
    if (step === 1 || stepsCompleted[step - 1] || currentStep === step) {
      setCurrentStep(step);
    }
  };

  // Render information box
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

  // Render content for each step
  const renderStep = () => {
    const contactData = getSectionData('contact');
    const incidentData = getSectionData('incident');
    const passportData = getSectionData('passport');
    const employmentData = getSectionData('employment');
    const recognitionData = getSectionData('recognition');
    const paymentData = getSectionData('payment');
    
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Kişisel Bilgiler</h3>
            {renderInfoBox(
              "Kişisel Bilgiler Hakkında",
              "Başvuru sahibinin temel iletişim bilgilerini eksiksiz doldurunuz. Telefon numarası benzersiz tanımlayıcı olarak kullanılacaktır."
            )}
            
            {/* Highlight the phone number field as important */}
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-start">
                <Phone className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-sm text-yellow-700">
                  <span className="font-medium">Önemli:</span> Telefon numarası, başvurunuz için benzersiz tanımlayıcı olarak kullanılacaktır. Lütfen doğru ve güncel bir numara giriniz.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Ad</label>
                <input
                  type="text"
                  value={contactData.firstName}
                  onChange={(e) => updateSectionField('contact', 'firstName', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#292A2D] focus:ring-[#292A2D] sm:text-sm"
                  required
                  disabled={applicationCreated}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Soyad</label>
                <input
                  type="text"
                  value={contactData.lastName}
                  onChange={(e) => updateSectionField('contact', 'lastName', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#292A2D] focus:ring-[#292A2D] sm:text-sm"
                  required
                  disabled={applicationCreated}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Doğum Tarihi</label>
                <input
                  type="date"
                  value={contactData.birthDate}
                  onChange={(e) => updateSectionField('contact', 'birthDate', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#292A2D] focus:ring-[#292A2D] sm:text-sm"
                  required
                  disabled={applicationCreated}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">E-posta</label>
                <input
                  type="email"
                  value={contactData.email}
                  onChange={(e) => updateSectionField('contact', 'email', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#292A2D] focus:ring-[#292A2D] sm:text-sm"
                  disabled={applicationCreated}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefon Numarası <span className="text-red-500">*</span>
                </label>
                <div className={`relative ${applicationCreated ? 'opacity-75' : ''}`}>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    value={contactData.telephone}
                    onChange={(e) => updateSectionField('contact', 'telephone', e.target.value)}
                    className="mt-1 block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-[#292A2D] focus:ring-[#292A2D] sm:text-sm"
                    placeholder="+90 (___) ___ __ __"
                    required
                    disabled={applicationCreated}
                  />
                  {applicationCreated && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Örnek: +90 555 123 4567
                </p>
              </div>
            </div>
            
            {!applicationCreated && (
              <button
                type="button"
                onClick={handleCreateApplication}
                disabled={isSubmitting}
                className="w-full mt-6 flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#292A2D] hover:bg-[#292A2D]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#292A2D]"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Oluşturuluyor...
                  </>
                ) : "Oluştur ve Devam Et"}
              </button>
            )}
            
            {applicationCreated && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-start">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-green-700">
                      Başvurunuz oluşturuldu! 
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      Başvuru No: {applicationId}
                    </p>
                    <p className="text-sm text-green-600">
                      Lütfen formu doldurmaya devam ediniz.
                    </p>
                  </div>
                </div>
              </div>
            )}
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
                value={incidentData.incidentDescription}
                onChange={(e) => updateSectionField('incident', 'incidentDescription', e.target.value)}
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
            <AdminFileUploadComponent
              files={passportFiles}
              setFiles={setPassportFiles}
              setError={setPassportError}
              fileUrls={passportData.employmentFiles}
              folder="passport"
              label="Pasaport"
              onUploadComplete={handlePassportFileUpload}
              allowedTypes={[
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "image/jpeg",
                "image/png",
                "image/jpg",
              ]}
            />
            {passportError && (
              <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                {passportError}
              </div>
            )}
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
            <AdminFileUploadComponent
              files={employmentFiles}
              setFiles={setEmploymentFiles}
              setError={setEmploymentError}
              fileUrls={employmentData.employmentFiles}
              folder="employment"
              label="İstihdam"
              onUploadComplete={handleEmploymentFileUpload}
              allowedTypes={[
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "image/jpeg",
                "image/png",
                "image/jpg",
              ]}
            />
            {employmentError && (
              <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                {employmentError}
              </div>
            )}
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
                    checked={recognitionData.hasDocuments}
                    onChange={(e) => updateSectionField('recognition', 'hasDocuments', e.target.checked)}
                    className="rounded border-gray-300 text-[#292A2D] focus:ring-[#292A2D]"
                  />
                  <span className="text-sm text-gray-700">Takdir/Teşekkür belgelerim mevcut</span>
                </label>
              </div>
              {recognitionData.hasDocuments && (
                <>
                  <AdminFileUploadComponent
                    files={recognitionFiles}
                    setFiles={setRecognitionFiles}
                    setError={setRecognitionError}
                    fileUrls={recognitionData.files}
                    folder="recognition"
                    label="Takdir"
                    onUploadComplete={handleRecognitionFileUpload}
                    allowedTypes={[
                      "application/pdf",
                      "application/msword",
                      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                      "image/jpeg",
                      "image/png",
                      "image/jpg",
                    ]}
                  />
                  {recognitionError && (
                    <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                      {recognitionError}
                    </div>
                  )}
                </>
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
            <AdminFileUploadComponent
              files={paymentFiles}
              setFiles={setPaymentFiles}
              setError={setPaymentError}
              fileUrls={paymentData.paymentFiles}
              folder="payment"
              label="Ödeme"
              onUploadComplete={handlePaymentFileUpload}
              allowedTypes={[
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "application/vnd.ms-excel",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "image/jpeg",
                "image/png",
                "image/jpg",
              ]}
            />
            {paymentError && (
              <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm flex items-center">
                <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                {paymentError}
              </div>
            )}
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
        
        {applicationId && (
          <div className="text-right">
            <div className="text-sm font-medium text-gray-500">Başvuru No</div>
            <div className="text-base font-semibold text-gray-900">{applicationId}</div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        {/* Progress Indicator */}
        <div className="px-6 pt-6">
          <div className="relative">
            <div className="overflow-hidden h-2 mb-6 text-xs flex rounded bg-gray-200">
              <div 
                style={{ width: `${(currentStep / 6) * 100}%` }} 
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#292A2D] transition-all duration-300"
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              {steps.map((step) => {
                // Determine if this step is completed, active, or locked
                const isCompleted = stepsCompleted[step.number];
                const isActive = currentStep === step.number;
                const isLocked = !isCompleted && !isActive && step.number !== 1 && !stepsCompleted[step.number - 1];
                
                return (
                  <div 
                    key={step.number}
                    className={`flex flex-col items-center ${
                      isLocked ? 'opacity-50' : 
                      isCompleted || isActive ? 'text-[#292A2D]' : 'text-gray-400'
                    }`}
                  >
                    <button
                      onClick={() => handleStepNavigation(step.number)}
                      disabled={isLocked}
                      className={`rounded-full w-6 h-6 flex items-center justify-center mb-1 
                        ${isCompleted 
                          ? 'bg-[#292A2D] text-white' 
                          : isActive 
                          ? 'bg-white border-2 border-[#292A2D] text-[#292A2D]' 
                          : 'bg-gray-200 text-gray-500'
                        } ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      {isLocked && <Lock size={10} />}
                      {isCompleted && <Check size={14} />}
                      {!isLocked && !isCompleted && step.number}
                    </button>
                    <span className="text-center">{step.title}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200 mt-6">
          <nav className="flex divide-x divide-gray-200">
            {steps.map((step) => {
              // Determine if this step is accessible
              const isAccessible = step.number === 1 || stepsCompleted[step.number - 1] || currentStep === step.number;
              
              return (
                <button
                  key={step.number}
                  onClick={() => isAccessible && handleStepNavigation(step.number)}
                  disabled={!isAccessible}
                  className={`flex-1 px-4 py-3 text-sm font-medium
                    ${currentStep === step.number
                      ? 'text-[#292A2D] border-b-2 border-[#292A2D]'
                      : isAccessible
                      ? 'text-gray-500 hover:text-gray-700'
                      : 'text-gray-300 cursor-not-allowed'
                    }`}
                >
                  {step.title}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {formError && (
            <div className="mb-6 p-3 rounded-lg bg-red-50 text-red-700 text-sm flex items-center border border-red-200">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              {formError}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {renderStep()}
            
            {/* Only show navigation buttons for steps 2-6 after application is created */}
            {applicationCreated && currentStep > 1 && (
              <div className="mt-6 flex justify-between">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Önceki
                </button>
                
                {currentStep < 6 ? (
                  <button
                    type="button"
                    onClick={handleSaveAndContinue}
                    disabled={isSubmitting}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-[#292A2D] rounded-md hover:bg-[#292A2D]/90"
                  >
                    {isSubmitting && <Loader className="w-4 h-4 mr-2 animate-spin" />}
                    {isSubmitting ? 'Kaydediliyor...' : 'Kaydet ve Devam Et'}
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    {isSubmitting && <Loader className="w-4 h-4 mr-2 animate-spin" />}
                    {isSubmitting ? 'Gönderiliyor...' : 'Başvuruyu Tamamla'}
                  </button>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}