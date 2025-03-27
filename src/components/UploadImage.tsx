"use client";
import React, { useState } from "react";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/config/firebase";
import Image from "next/image";

const UploadImage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState<string>("");

  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const fileRef = ref(storage, `images/${file.name}`);
    await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);
    setUrl(downloadURL);
    setLoading(false);
  };

  return (
    <div>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>

      {url && <Image src={url} alt="Uploaded" width={200} height={200} />}
    </div>
  );
};

export default UploadImage;
