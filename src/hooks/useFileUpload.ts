import { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/config/firebase";
import { toast } from "sonner";

export const useFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadFile = async (file: File) => {
    try {
      setIsUploading(true);

      if (!file) throw new Error("Vui lòng chọn file ảnh");

      // Validate file size
      const MAX_FILE_SIZE = 5 * 1024 * 1024;
      if (file.size > MAX_FILE_SIZE) {
        throw new Error("Kích thước file không được vượt quá 5MB");
      }

      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/heic",
      ];
      if (!allowedTypes.includes(file.type)) {
        throw new Error("Chỉ chấp nhận file ảnh định dạng JPG, PNG hoặc WebP");
      }

      // Create unique filename
      const fileExtension = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`;
      const storageRef = ref(storage, `images/${fileName}`);

      const metadata = {
        contentType: file.type,
        customMetadata: { originalName: file.name },
      };

      const snapshot = await uploadBytes(storageRef, file, metadata);
      const downloadURL = await getDownloadURL(snapshot.ref);

      toast.success("Tải ảnh lên thành công");
      return downloadURL;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Lỗi không xác định khi tải ảnh";
      toast.error(message);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadFile, isUploading };
};
