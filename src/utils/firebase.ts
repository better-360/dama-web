import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { fireStorage } from "../config/firebase";
export const uploadFirestorage = async (file: File, folder: string, applicationId: string): Promise<string | null> => {
      const fileExtension = file.name.split(".").pop();
      const fileName = `${folder}/${applicationId}/${Date.now()}.${fileExtension}`;
      const storageRef = ref(fireStorage, fileName);
      try {
        const snapshot = await uploadBytes(storageRef, file);
        return await getDownloadURL(snapshot.ref);
      } catch (error) {
        console.error("Error uploading file:", error);
        throw new Error("Failed to upload file");
      }
    };

