import React, { useState } from "react";
import { X, CheckCircle, Upload } from "lucide-react";
import { useTranslation } from "react-i18next";

interface MultiFileUploadComponentProps {
  files: File[];
  setFiles: (files: File[]) => void;
  setError?: (error: string | null) => void;
  fileUrls?: string[];
  accept?: string;
  allowedTypes?: string[];
  label?: string;
  maxSize?: number; // in MB
}

const MultiFileUploadComponent: React.FC<MultiFileUploadComponentProps> = ({
  files,
  setFiles,
  setError,
  fileUrls = [],
  accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png",
  label = "Files",
  allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/png",
  ],
  maxSize = 5, // Default 5MB
}) => {
  const { t } = useTranslation();
  const [dragActive, setDragActive] = useState(false);

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
  };

  // Process and validate files
  const handleFiles = (newFiles: File[]) => {
    // Filter valid file types
    const validFiles = newFiles.filter(file => 
      allowedTypes.includes(file.type)
    );

    // Check if any files were invalid
    if (validFiles.length < newFiles.length) {
      setError && setError(t("application.stepFive.errors.invalidFileType"));
      if (validFiles.length === 0) return; // Don't proceed if no valid files
    }

    // Check file sizes
    const validSizedFiles = validFiles.filter(
      (file) => file.size <= maxSize * 1024 * 1024
    );

    // Check if any files were too large
    if (validSizedFiles.length < validFiles.length) {
      setError && setError(t("application.stepFive.errors.fileTooLarge"));
      if (validSizedFiles.length === 0) return; // Don't proceed if no valid files
    }

    // Add valid files to the current list
    setFiles([...files, ...validSizedFiles]);
    
    // Clear error if we have at least some valid files
    if (validSizedFiles.length > 0) {
      setError && setError(null);
    }
  };

  // Remove a file by index
  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* File dropzone */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center
          ${dragActive ? 'border-[#292A2D] bg-[#292A2D] bg-opacity-5' : 'border-gray-300'}
          transition-all duration-300`}
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
        />

        <div className="space-y-4">
          <div className="flex justify-center">
            <Upload className={`w-12 h-12 ${dragActive ? 'text-[#292A2D]' : 'text-gray-400'}`} />
          </div>
          <div>
            <p className="text-lg font-medium text-gray-700">
              {t('common.dropFiles', { defaultValue: 'Drop files here or click to upload' })}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {t('common.dragAndDrop', { defaultValue: 'Drag and drop your files, or click to select', label })}
            </p>
          </div>
        </div>
      </div>

      {/* Display uploaded files */}
      {(files.length > 0 || fileUrls.length > 0) && (
        <div className="space-y-3">
          <h3 className="font-medium text-gray-700">
            {t('common.uploadedFiles', { defaultValue: 'Uploaded Files' })}
          </h3>
          
          {/* Show files with URLs (previously uploaded) */}
          {fileUrls.map((url, index) => (
            <div
              key={`url-${index}`}
              className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  {`${label} ${index + 1}`}
                </a>
              </div>
              <button
                type="button"
                onClick={() => {
                  // Implement the handler for removing uploaded files
                  // This would require additional implementation to handle backend deletion
                }}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
          
          {/* Show locally selected files */}
          {files.map((file, index) => (
            <div
              key={`file-${index}`}
              className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-600">{file.name}</span>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiFileUploadComponent;