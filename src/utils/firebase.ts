import instance from "../http/instance";
import axios from "axios";


export const uploadFileToS3 = async (
  file: File,
  originalName: string,
  contentType: string,
  folder: string
) => {
  const response = await instance.post(
    '/file-manager/presigned-url',{
      originalName: originalName,
      contentType: contentType,
      folder: folder,
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
