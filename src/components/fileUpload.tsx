import React, { useState } from "react";
import { X, Download, Upload } from "lucide-react";
import { useTranslation } from "react-i18next";

interface FileUploadComponentProps {
  file: File | null;
  setFile: (file: File | null) => void;
  setError?: (error: string | null) => void;
  fileUrl?: string;
  accept?: string;
  allowedTypes?: string[];
  label?: string;
}

const FileUploadComponent: React.FC<FileUploadComponentProps> = ({
  file,
  setFile,
  setError,
  fileUrl,
  accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png",
  label = "a File",
  allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/png",
  ],
}) => {
  const { t } = useTranslation();

  const [localFileUrl, setLocalFileUrl] = useState<string | null>(fileUrl || null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return; // Kullanıcı dosya seçmeden iptal ettiyse hata gösterme

    // Dosya türü kontrolü
    if (!allowedTypes.includes(selectedFile.type)) {
      setError && setError(t("application.stepFive.errors.invalidFileType"));
      return;
    }

    // Dosya boyutu kontrolü (Maksimum 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError && setError(t("application.stepFive.errors.fileTooLarge"));
      return;
    }

    setError && setError(null); // Başarılı yükleme -> Hata mesajını sıfırla
    setFile(selectedFile); // Parent component'e dosyayı gönder
  };

  const handleDelete = () => {
    setFile(null);
    setLocalFileUrl(null); // Gelen fileUrl'yi lokal olarak sıfırla
    setError && setError(null);
  };

  const displayName = localFileUrl 
  ? label 
  : file 
  ? file.name 
  : `${t('common.upload')} ${label}`;

  return (
    <div className="relative flex flex-col items-center gap-2">
      {localFileUrl ? (
        <a
          href={localFileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full cursor-pointer"
        >
          <div className="w-full px-6 py-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 hover:border-primary transition-colors">
            <div className="flex flex-col items-center gap-2">
              <Download className="w-8 h-8 text-gray-400" />
              <span className="text-sm text-gray-500">{displayName}</span>
            </div>
          </div>
        </a>
      ) : (
        <label className="w-full cursor-pointer">
          <div className="w-full px-6 py-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 hover:border-primary transition-colors relative">
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-8 h-8 text-gray-400" />
              <span className="text-sm text-gray-500">{displayName}</span>
            </div>
          </div>
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            accept={accept}
          />
        </label>
      )}

      {/* Eğer dosya seçilmişse veya yüklenmişse silme butonunu göster */}
      {(file || localFileUrl) && (
        <button
          type="button"
          onClick={handleDelete}
          className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-100"
          title="Dosyayı Sil"
        >
          <X className="w-4 h-4 text-red-500" />
        </button>
      )}
    </div>
  );
};

export default FileUploadComponent;
