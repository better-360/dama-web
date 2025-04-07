import React, { useState, useEffect } from "react";
import { ArrowLeft, FileText, Download, Link as LinkIcon } from "lucide-react";
import type { ApplicationDetail } from "../../types/applicationDetail";
import { sectionLabels as preApplicationSectionLabels } from "../../types/applicationDetail";
import { sectionLabels as applicationSectionLabels } from "../../types/clientDetail";
import { mockApplicationDetail } from "../../data/mockApplicationDetail";
import { getApplication, getFileUrl } from "../../../../http/requests/admin";

interface ClientDetailPageProps {
  id: string;
  onBack: () => void;
}

export default function ClientDetailPage({
  id,
  onBack,
}: ClientDetailPageProps) {
  const [application, setApplication] = useState<ApplicationDetail | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"pre-application" | "application">(
    "pre-application"
  );

  useEffect(() => {
    fetchClientDetail();
  }, [id]);

  const fetchClientDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getApplication(id);
      setApplication(res);
    } catch (err) {
      console.error("Error fetching client detail:", err);
      setError("Müvekkil detayları yüklenirken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const getFilesForSection = (section: any) => {
    if (!section || !section.data) return undefined;

    switch (section.section) {
      case "passport":
        return section.data.passportFiles;
      case "employment":
        return section.data.employmentFiles;
      case "recognition":
        return section.data.files;
      case "payment":
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
      return <p className="text-sm text-gray-500 italic">Dosya yüklenmemiş</p>;
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {files.map((file, index) => (
          <p
            key={index}
            onClick={() => getFileLink(file)}
            className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FileText className="w-5 h-5 text-gray-500 mr-2" />
            <span className="text-sm text-gray-700 truncate">
              Dosya {index + 1}
            </span>
            <Download className="w-4 h-4 text-gray-500 ml-auto" />
          </p>
        ))}
      </div>
    );
  };

  const renderPreApplicationData = () => {
    if (!application) return null;

    return (
      <div className="divide-y divide-gray-200">
        {application.preApplicationData.map((section) => (
          <div key={section.section} className="p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              {preApplicationSectionLabels[section.section]}
            </h4>

            {section.section === "contact" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Ad Soyad
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {section.data.firstName} {section.data.lastName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    E-posta
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {section.data.email}
                  </p>
                </div>
              </div>
            )}

            {section.section === "incident" && (
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Olay Açıklaması
                </label>
                <p className="mt-2 text-sm text-gray-900 whitespace-pre-wrap">
                  {section.data.incidentDescription}
                </p>
              </div>
            )}

            {["passport", "employment", "recognition", "payment"].includes(
              section.section
            ) && renderFiles(getFilesForSection(section))}
          </div>
        ))}
      </div>
    );
  };
  const safe = (value: any) =>
    value === null || value === undefined || value === ""
      ? "Belirtilmemiş"
      : value;
  
  const renderApplicationData = () => {
    if (!application?.applicationData) return null;
  
    return (
      <div className="divide-y divide-gray-200">
        {application.applicationData.map((section: any) => (
          <div key={section.section} className="p-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              {applicationSectionLabels[section.section]}
            </h4>
  
            {section.section === "marital" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Medeni Durum
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {safe(section.data.maritalStatus)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Eş Adı
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {safe(section.data.spouseName)}
                  </p>
                </div>
                {section.data.hasChildren && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Çocuklar
                    </label>
                    <div className="mt-2 space-y-2">
                      {section.data.children.map((child: any, index: number) => (
                        <div key={index} className="text-sm text-gray-900">
                          {safe(child.name)} - {safe(child.birthDate)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
  
            {section.section === "employment" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    İşveren
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {safe(section.data.employerName)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Pozisyon
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {safe(section.data.position)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Maaş
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {safe(section.data.salary)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Başlangıç Tarihi
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {safe(section.data.startDate)}
                  </p>
                </div>
                {section.data.hasContract && section.data.contractFile && (
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                      Sözleşme
                    </label>
                    <a
                      href={section.data.contractFile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors w-fit"
                    >
                      <FileText className="w-5 h-5 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-700">
                        Sözleşme Dosyası
                      </span>
                      <Download className="w-4 h-4 text-gray-500 ml-2" />
                    </a>
                  </div>
                )}
              </div>
            )}
  
            {section.section === "workConditions" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Üsler
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {safe(section.data.bases)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Günlük Çalışma Saati
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {safe(section.data.dailyHours)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Haftalık Çalışma Günü
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {safe(section.data.weeklyDays)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Son Çalışma Tarihi
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {safe(section.data.lastWorkDate)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Yönetici
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {safe(section.data.supervisorName)}
                  </p>
                </div>
              </div>
            )}
  
            {section.section === "postEmployment" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Şu Anki Şirket
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {safe(section.data.currentCompany??'')}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Şu Anki Maaş
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {safe(section.data.currentSalary)}
                    </p>
                  </div>
                </div>
  
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Önceki İşler
                  </label>
                  <div className="space-y-3">
                    {section.data.previousJobs.map((job: any, index: number) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm font-medium text-gray-900">
                          {safe(job.company)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {safe(job.startDate)} - {safe(job.endDate)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
  
            {section.section === "evidenceWitness" && (
              <div className="space-y-6">
                {section.data.hasWitnesses && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                      Tanıklar
                    </label>
                    <div className="space-y-2">
                      {section.data.witnesses.map((witness: any, index: number) => (
                        <div key={index} className="text-sm text-gray-900">
                          {`${safe(witness.firstName)} ${safe(witness.lastName)}`}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
  
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Kanıt Bağlantıları
                  </label>
                  <div className="space-y-2">
                    {section.data.evidenceLinks.map((link: string, index: number) => (
                      <a
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                      >
                        <LinkIcon className="w-4 h-4 mr-1" />
                        {safe(link)}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
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
        <p className="text-red-800">{error || "Müvekkil bulunamadı"}</p>
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
            <h2 className="text-2xl font-semibold text-gray-900">
              Müvekkil Detayı
            </h2>
            <p className="text-sm text-gray-500">
              Başvuru No: {application.applicationNumber}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex divide-x divide-gray-200">
            <button
              onClick={() => setActiveTab("pre-application")}
              className={`flex-1 px-4 py-3 text-sm font-medium ${
                activeTab === "pre-application"
                  ? "text-[#292A2D] border-b-2 border-[#292A2D]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Ön Başvuru Bilgileri
            </button>
            <button
              onClick={() => setActiveTab("application")}
              className={`flex-1 px-4 py-3 text-sm font-medium ${
                activeTab === "application"
                  ? "text-[#292A2D] border-b-2 border-[#292A2D]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Detaylı Başvuru Bilgileri
            </button>
          </nav>
        </div>

        {activeTab === "pre-application"
          ? renderPreApplicationData()
          : renderApplicationData()}
      </div>
    </div>
  );
}
