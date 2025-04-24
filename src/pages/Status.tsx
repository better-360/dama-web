import { useEffect, useState } from "react";
import { MyStatusReponse, ApplicationStatus } from "../types/status";
import { getMyStatus } from "../http/requests/applicator";

const colors = {
  background: "#E2E0D6",
  darkText: "#292A2D",
  white: "#FFF",
  accent: "#3C4046",
};

const statuses = [
  {
    order: 1,
    name: "Başvuru Alındı",
    status: ApplicationStatus.PRE_APPLICATION,
    title: "Başvuru Alındı",
    description:
      "Başvurunuz DAMA danışmanlarımız tarafından alınmış ve inceleme sürecindedir. Bu aşamada danışmanlarımız bilgilerinizi gözden geçiriyor ve dosyanızın DBA kapsamına girip girmediğini değerlendiriyor.",
    warning: null,
  },
  {
    order: 2,
    name: "Ofis Randevusu Planlandı",
    status: ApplicationStatus.OFFICE_APPOINTMENT_SCHEDULED,
    title: "Ofis Randevusu Planlandı",
    description:
      "Başvurunuz ön incelemeden geçmiştir ve sürecinizi başlatmak için DAMA ofisimizde bir görüşme planlanmıştır. Bu randevuda, DBA süreciniz hakkında detaylı bilgilendirme yapılacak, gerekli belgeleri imzalayacak, vekaletname süreçleri tamamlanacak ve tıbbi değerlendirme için doktor randevularınız organize edilecektir.",
    warning:
      "Ofis randevunuza belirtilen tarih ve saatte gelmeniz ve kimlik belgenizi yanınızda bulundurmanız gerekmektedir. Ayrıca, yaralanmanızla ilgili varsa mevcut tıbbi raporları, iş sözleşmenizi ve diğer ilgili belgeleri getirmeniz süreci hızlandıracaktır.",
  },
  {
    order: 3,
    name: "Tıbbi Değerlendirme",
    status: ApplicationStatus.MEDICAL_EVALUATION,
    title: "Tıbbi Değerlendirme",
    description:
      "Başvurunuz ön incelemeden geçmiştir. Bu aşamada yaralanmanızın veya sağlık durumunuzun tıbbi olarak değerlendirilmesi için doktor randevunuz ayarlanmaktadır. Randevu detayları WhatsApp'tan iletilecektir.",
    warning:
      "Bildirilen tarih ve saatte doktor randevunuza katılmanız gerekmektedir.",
  },
  {
    order: 4,
    name: "Tıbbi Raporlar Bekleniyor",
    status: ApplicationStatus.MEDICAL_REPORTS_PENDING,
    title: "Tıbbi Raporlar Bekleniyor",
    description:
      "Doktor muayeneniz tamamlanmıştır. Şu anda doktorunuzdan gerekli tıbbi raporlar ve değerlendirmeler beklenmektedir. Bu raporlar başvurunuzun ilerleyen aşamaları için kritik öneme sahiptir.",
    warning: null,
  },
  {
    order: 5,
    name: "Uluslararası Başvuru Hazırlanıyor",
    status: ApplicationStatus.INTERNATIONAL_APPLICATION_PREPARATION,
    title: "Uluslararası Başvuru Hazırlanıyor",
    description:
      "Tıbbi raporlarınız alınmıştır ve şimdi DAMA ekibimiz uluslararası başvurunuzu hazırlamaktadır. Bu aşamada, gerekli tüm belgeler derlenmekte ve ABD makamlarına iletilmek üzere hazırlanmaktadır.",
    warning: null,
  },
  {
    order: 6,
    name: "DCN Numarası Bekleniyor",
    status: ApplicationStatus.DCN_NUMBER_PENDING,
    title: "DCN Numarası Bekleniyor",
    description:
      "Uluslararası başvurunuz tamamlanmış ve ABD'deki iş ortağı avukatlarımıza iletilmiştir. Şu anda başvurunuz Amerikan sistemine kaydedilmekte ve size özel bir Document Control Number (DCN) atanması beklenmektedir.",
    warning: null,
  },
  {
    order: 7,
    name: "OWCP İncelemesinde",
    status: ApplicationStatus.OWCP_REVIEW,
    title: "OWCP İncelemesinde",
    description:
      "Başvurunuz artık DCN numarası ile birlikte ABD Office of Workers' Compensation Programs (OWCP) tarafından incelenmektedir. Bu federal kurum, başvurunuzun detaylı bir değerlendirmesini yapmakta ve tazminat haklarınızı belirlemektedir.",
    warning: null,
  },
  {
    order: 8,
    name: "Başvuru Onaylandı",
    status: ApplicationStatus.APPLICATION_APPROVED,
    title: "Başvuru Onaylandı",
    description:
      "Tebrikler! Başvurunuz OWCP tarafından onaylanmıştır. Bu aşamada tazminat miktarınız hesaplanmakta ve ödeme sürecine geçilmektedir.",
    warning: null,
  },
  {
    order: 9,
    name: "Ödeme Süreci",
    status: ApplicationStatus.PAYMENT_PROCESS,
    title: "Ödeme Süreci",
    description:
      "Tazminat miktarınız belirlenmiş ve ödeme süreciniz başlatılmıştır. Bu aşamada size bildirilen banka hesabınıza ödemenin yapılması beklenmektedir.",
    warning: null,
  },
  {
    order: 10,
    name: "Tamamlandı",
    status: ApplicationStatus.COMPLETED,
    title: "Tamamlandı",
    description:
      "Başvuru süreciniz başarıyla tamamlanmış ve tazminatınız yatırılmıştır. DAMA olarak hizmetimizden memnun kalmanızı umuyoruz. Herhangi bir sorunuz veya ek talepleriniz olursa danışmanınızla iletişime geçebilirsiniz.",
    warning: null,
  },
];

// ApplicationStatus enum değerini order numarasına çeviren yardımcı fonksiyon
const getStatusOrder = (status: ApplicationStatus): number => {
  const foundStatus = statuses.find((s) => s.status === status);
  return foundStatus ? foundStatus.order : 0;
};

// Tarih formatı için yardımcı fonksiyon
const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString('tr-TR', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const StatusPage = () => {
  // Aktif durumu göster ve açıklama gösterme durumu
  const [expandedStatus, setExpandedStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [clientInfo, setClientInfo] = useState<MyStatusReponse | null>(null);
  const [activeStatus, setActiveStatus] = useState<number>(0);

  const fetchMyApplicationStatus = async () => {
    try {
      const stats = await getMyStatus();
      setClientInfo(stats);
      
      // Eğer uygulama varsa, aktif durumu belirle
      if (stats && stats.application) {
        setActiveStatus(getStatusOrder(stats.application.status));
      }
      
      // Yükleme durumunu güncelle
      setLoading(false);
    } catch (error) {
      console.error("Error fetching application data:", error);
      // Hata durumunda da yüklemeyi durdur
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyApplicationStatus();
  }, []);

  // Başka bir aşamaya tıklandığında açıklamasını gösterme fonksiyonu
  const toggleStatusDetails = (statusId: number) => {
    if (expandedStatus === statusId) {
      setExpandedStatus(null);
    } else {
      setExpandedStatus(statusId);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader"></div>
      </div>
    );
  }

  if (!clientInfo || !clientInfo.application) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Başvuru Bulunamadı</h2>
          <p className="text-gray-600">
            Başvurunuz bulunamadı veya henüz oluşturulmamış olabilir.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ backgroundColor: colors.background, color: colors.darkText }}
    >
      <header
        className="py-6 px-4 md:px-8"
        style={{ backgroundColor: colors.accent }}
      >
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold" style={{ color: colors.white }}>
            DAMA DBA Başvuru Takip
          </h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto py-8 px-4 md:px-8">
        {/* Müvekkil formu hatırlatma kutusu - formCompleted false ise göster */}
        {(!clientInfo.application.applicationCompleted &&clientInfo.application.status!==ApplicationStatus.PRE_APPLICATION) && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-lg shadow-md mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-lg font-semibold text-blue-800 mb-1">
                  Müvekkil Formu Doldurmanız Gerekiyor
                </h3>
                <p className="text-blue-700">
                  Başvurunuzu tamamlamak ve süreci hızlandırmak için müvekkil
                  bilgi formunu doldurmalısınız. Bu form, durumunuzu daha iyi
                  değerlendirmemize yardımcı olacak detaylı bilgileri
                  içermektedir.
                </p>
              </div>
              <div className="mt-3 md:mt-0">
                <button
                  className="px-6 py-2 text-white rounded-md font-medium shadow-sm"
                  style={{ backgroundColor: colors.accent }}
                  onClick={() => (window.location.href = "/forms/application-form")}
                >
                  Formu Doldur
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Müvekkil bilgileri kartı */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Müvekkil Bilgileri</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Başvuru Numarası
                </h3>
                <p className="font-semibold">{clientInfo.application.applicationNumber}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Ad Soyad</h3>
                <p className="font-semibold">
                  {clientInfo.firstName} {clientInfo.lastName}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">E-Posta</h3>
                <p>{clientInfo.email}</p>
              </div>

            </div>

            <div className="flex flex-col space-y-4">
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Başvuru Tarihi
                </h3>
                <p>{formatDate(clientInfo.application.createdAt)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Telefon</h3>
                <p className="font-semibold">{clientInfo.telephone}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">Başvuru Durumunuz</h2>

          {/* Aşama listesi */}
          <div className="space-y-4">
            {statuses.map((status) => (
              <div
                key={status.name}
                className={`p-4 rounded-lg border-l-4 ${
                  status.order < activeStatus
                    ? "bg-green-50 border-green-500"
                    : status.order === activeStatus
                    ? "bg-blue-50 border-blue-500"
                    : "bg-gray-50 border-gray-300"
                } cursor-pointer`}
                onClick={() => toggleStatusDetails(status.order)}
              >
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 text-white ${
                      status.order < activeStatus
                        ? "bg-green-500"
                        : status.order === activeStatus
                        ? "bg-blue-500"
                        : "bg-gray-300"
                    }`}
                  >
                    {status.order}
                  </div>
                  <h4 className="font-medium">{status.title}</h4>
                </div>

                {/* Genişletilmiş aşama açıklaması */}
                {expandedStatus === status.order && (
                  <div className="mt-4 ml-11">
                    <p className="mb-3">{status.description}</p>
                    {status.warning && (
                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-2">
                        <p className="font-medium text-yellow-800">Uyarı:</p>
                        <p className="text-yellow-700">{status.warning}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer
        className="py-4 px-4 md:px-8"
        style={{ backgroundColor: colors.accent }}
      >
        <div
          className="container mx-auto text-center"
          style={{ color: colors.white }}
        >
          <p>©️ 2025 DAMA Danışmanlık. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
};

export default StatusPage;