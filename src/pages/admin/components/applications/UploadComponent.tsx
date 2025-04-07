import React, { useState, useEffect } from "react";
import { X, CheckCircle, Upload, AlertCircle, File as FileIcon, Loader } from "lucide-react";
import { useTranslation } from "react-i18next";
import { uploadFileToS3fromAdmin } from "../../../../utils/upload";

interface AdminFileUploadComponentProps {
  files: File[];
  setFiles: (files: File[]) => void;
  setError?: (error: string | null) => void;
  fileUrls?: string[];
  accept?: string;
  allowedTypes?: string[];
  label?: string;
  maxSize?: number; // in MB
  folder?: string; // S3 folder name
  applicationNumber: string; // Optional application number
  onUploadComplete?: (fileKeys: string[]) => void;
}

const AdminFileUploadComponent: React.FC<AdminFileUploadComponentProps> = ({
  files,
  setFiles,
  setError,
  applicationNumber,
  fileUrls = [],
  accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png",
  label = "Files",
  allowedTypes =[
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/vnd.ms-access",
    "image/jpeg",
    "image/png",
    "image/jpg",
  ],
  maxSize = 5, // Default 5MB
  folder = "uploads",
  onUploadComplete
}) => {
  const { t } = useTranslation();
  const [dragActive, setDragActive] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<{ [key: string]: boolean }>({});
  const [fileErrors, setFileErrors] = useState<{ [key: string]: string }>({});
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [uploadedKeys, setUploadedKeys] = useState<string[]>([]);

  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    handleFiles(selectedFiles);
    
    // Reset the input value to allow selecting the same file again
    if (e.target.value) {
      e.target.value = '';
    }
  };

  // Process and validate files
  const handleFiles = (newFiles: File[]) => {
    // Clear previous errors
    setError && setError(null);
    
    const validFiles: File[] = [];
    const invalidFiles: File[] = [];
    
    // First perform validation
    for (const file of newFiles) {
      // Check file type
      if (!allowedTypes.includes(file.type)) {
        setFileErrors(prev => ({ 
          ...prev, 
          [file.name]: t("application.errors.invalidFileType", "Geçersiz dosya türü") 
        }));
        invalidFiles.push(file);
        continue;
      }
      
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        setFileErrors(prev => ({ 
          ...prev, 
          [file.name]: t("application.errors.fileTooLarge", `Dosya ${maxSize}MB'dan büyük olamaz`) 
        }));
        invalidFiles.push(file);
        continue;
      }
      
      validFiles.push(file);
    }
    
    // If there are any invalid files, show an error
    if (invalidFiles.length > 0) {
      if (invalidFiles.length === newFiles.length) {
        // All files are invalid
        setError && setError(t("application.errors.allFilesInvalid", "Seçilen tüm dosyalar geçersiz"));
      } else {
        // Some files are invalid
        setError && setError(t("application.errors.someFilesInvalid", "Bazı dosyalar geçersiz, geçerli dosyalar yüklenecek"));
      }
    }
    
    // Add valid files to the current list
    if (validFiles.length > 0) {
      setFiles([...files, ...validFiles]);
    }
  };

  // Upload all files
  const handleUploadAll = async (): Promise<string[]> => {
    const uploadedFileKeys: string[] = [];
    
    // Reset uploaded keys
    setUploadedKeys([]);
    
    for (const file of files) {
      try {
        // Set uploading state for this file
        setUploadingFiles(prev => ({ ...prev, [file.name]: true }));
        
        // Initialize progress for this file
        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));
        
        // Upload the file
        const { fileKey } = await uploadFileToS3fromAdmin(
          file,
          file.name,
          file.type,
          folder,
          applicationNumber
        );
        
        // Add the file key to the list
        uploadedFileKeys.push(fileKey);
        setUploadedKeys(prev => [...prev, fileKey]);
        
        // Set progress to 100%
        setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
      } catch (err) {
        console.error("Error uploading file:", file.name, err);
        setError && setError(`Dosya ${file.name} yüklenirken hata oluştu.`);
        // Set error for this file
        setFileErrors(prev => ({ 
          ...prev, 
          [file.name]: t("application.errors.uploadFailed", "Yükleme başarısız oldu") 
        }));
      } finally {
        // Clear uploading state for this file
        setUploadingFiles(prev => {
          const newState = { ...prev };
          delete newState[file.name];
          return newState;
        });
      }
    }
    
    // Clear files after successful upload
    setFiles([]);
    
    // Call onUploadComplete if provided
    onUploadComplete && onUploadComplete(uploadedFileKeys);
    
    return uploadedFileKeys;
  };

  // Trigger upload when files change
  useEffect(() => {
    // Don't upload if there are no files
    if (files.length === 0) return;
    
    // Don't automatically upload, provide a manual trigger instead
    // If you want automatic upload, uncomment the line below
    // handleUploadAll();
  }, [files]);

  // Remove a file by index
  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  // Get file icon based on type
  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) {
      return <FileIcon className="w-5 h-5 text-red-500" />;
    } else if (fileType.includes('word') || fileType.includes('doc')) {
      return <FileIcon className="w-5 h-5 text-blue-500" />;
    } else if (fileType.includes('image')) {
      return <FileIcon className="w-5 h-5 text-green-500" />;
    }
    return <FileIcon className="w-5 h-5 text-gray-500" />;
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Check if any files are currently uploading
  const isUploading = Object.keys(uploadingFiles).length > 0;
  
  // Get filename from URL
  const getFileNameFromUrl = (url: string): string => {
    const parts = url.split('/');
    return parts[parts.length - 1];
  };

  return (
    <div className="space-y-4">
      {/* File dropzone */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 ${
          dragActive 
            ? 'border-[#292A2D] bg-[#292A2D]/5' 
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept={accept}
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />

        <div className="space-y-3">
          <div className="flex justify-center">
            <Upload className={`w-10 h-10 ${dragActive ? 'text-[#292A2D]' : 'text-gray-400'}`} />
          </div>
          <div>
            <p className="text-base font-medium text-gray-700">
              {isUploading 
                ? t('common.uploading', 'Dosyalar yükleniyor...') 
                : t('common.dropFiles', 'Dosyaları buraya sürükleyin veya tıklayın')}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {t('common.acceptedFormats', { 
                defaultValue: 'Kabul edilen formatlar: {{formats}}',
                formats: accept.replace(/\./g, ' ').toUpperCase()
              })}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {t('common.maxSize', { 
                defaultValue: 'Maksimum dosya boyutu: {{size}}MB',
                size: maxSize
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Upload button - Only show when files are selected and not uploading */}
      {files.length > 0 && !isUploading && (
        <button
          type="button"
          onClick={handleUploadAll}
          className="w-full py-2 px-4 bg-[#292A2D] text-white font-medium rounded-md hover:bg-[#292A2D]/90 transition-colors"
        >
          {t('common.uploadFiles', 'Dosyaları Yükle')} ({files.length})
        </button>
      )}

      {/* Display selected files waiting to be uploaded */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium text-gray-700 flex items-center">
            <FileIcon className="w-4 h-4 text-gray-500 mr-2" />
            {t('common.selectedFiles', 'Seçilen Dosyalar')} ({files.length})
          </h3>
          
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {files.map((file, index) => (
              <div
                key={`file-${index}`}
                className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200"
              >
                <div className="flex items-center space-x-3">
                  {getFileIcon(file.type)}
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
                      {file.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </span>
                  </div>
                </div>
                
                {/* Show upload progress or remove button */}
                {uploadingFiles[file.name] ? (
                  <div className="flex items-center">
                    <Loader className="w-5 h-5 text-blue-500 animate-spin mr-2" />
                    <span className="text-sm text-blue-500">
                      {t('common.uploading', 'Yükleniyor...')}
                    </span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    disabled={isUploading}
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Display previously uploaded files */}
      {(fileUrls.length > 0 || uploadedKeys.length > 0) && (
        <div className="space-y-3">
          <h3 className="font-medium text-gray-700 flex items-center">
            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
            {t('common.uploadedFiles', 'Yüklenen Dosyalar')} ({fileUrls.length + uploadedKeys.length})
          </h3>
          
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {/* Show existing file URLs */}
            {fileUrls.map((url, index) => (
              <div
                key={`url-${index}`}
                className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200"
              >
                <div className="flex items-center space-x-3">
                  <FileIcon className="w-5 h-5 text-blue-500" />
                  <div className="flex flex-col">
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline truncate max-w-[200px]"
                    >
                      {getFileNameFromUrl(url)}
                    </a>
                    <span className="text-xs text-green-500 font-medium">
                      {t('common.uploaded', 'Yüklendi')}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
            
            {/* Show newly uploaded files */}
            {uploadedKeys.map((fileKey, index) => (
              <div
                key={`uploaded-${index}`}
                className="flex items-center justify-between bg-green-50 p-3 rounded-lg border border-green-200"
              >
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
                      {fileKey.split('/').pop() || `Dosya ${index + 1}`}
                    </span>
                    <span className="text-xs text-green-500 font-medium">
                      {t('common.uploaded', 'Yüklendi')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Display file errors */}
      {Object.keys(fileErrors).length > 0 && (
        <div className="space-y-3">
          <h3 className="font-medium text-red-600 flex items-center">
            <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
            {t('common.errors', 'Hatalar')} ({Object.keys(fileErrors).length})
          </h3>
          
          <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
            {Object.entries(fileErrors).map(([fileName, errorMessage], index) => (
              <div
                key={`error-${index}`}
                className="flex items-center justify-between bg-red-50 p-3 rounded-lg border border-red-200"
              >
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-red-700 truncate max-w-[200px]">
                      {fileName}
                    </span>
                    <span className="text-xs text-red-600">
                      {errorMessage}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFileErrors(prev => {
                    const newErrors = {...prev};
                    delete newErrors[fileName];
                    return newErrors;
                  })}
                  className="text-red-400 hover:text-red-600 transition-colors p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFileUploadComponent;