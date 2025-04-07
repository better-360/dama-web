import axios from "axios";
import adminInstance from "../http/adminInstance";

export const uploadFileToS3fromAdmin = async (
    file: File,
    originalName: string,
    contentType: string,
    folder: string,
    applicationNumber: string
  ) => {
    const response = await adminInstance.post(
      '/file-manager/presigned-url-from-admin',{
        originalName: originalName,
        contentType: contentType,
        folder: folder,
        applicationNumber,
      }
    );
    
    const { presignedUrl, fileKey } = response.data;
    
    // Dosyayı direkt S3'e yüklemek için PUT isteği gönderiyoruz
    const result = await axios.put(presignedUrl, file, {
      headers: {
        "Content-Type": file.type,
      },
    });
  
    if (result.status === 200) {
      console.log("File uploaded successfully");
    } else {
      console.error("Error uploading file:", result);
    }
  
    return { fileKey };
  };
  