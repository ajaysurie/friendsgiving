"use client";

import { useState } from "react";
import Image from "next/image";

interface GalleryUploadProps {
  onUploadComplete: () => void;
}

export default function GalleryUpload({ onUploadComplete }: GalleryUploadProps) {
  const [personName, setPersonName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [compressing, setCompressing] = useState(false);

  // Compress image on client side before upload
  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = document.createElement("img");
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Failed to get canvas context"));
            return;
          }

          // Calculate new dimensions (max 1920px on longest side)
          const MAX_SIZE = 1920;
          let width = img.width;
          let height = img.height;

          if (width > height && width > MAX_SIZE) {
            height = (height * MAX_SIZE) / width;
            width = MAX_SIZE;
          } else if (height > MAX_SIZE) {
            width = (width * MAX_SIZE) / height;
            height = MAX_SIZE;
          }

          canvas.width = width;
          canvas.height = height;

          // Draw and compress
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Failed to compress image"));
                return;
              }
              // Create new file with original name
              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            },
            "image/jpeg",
            0.85 // 85% quality
          );
        };
        img.onerror = () => reject(new Error("Failed to load image"));
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setError("");
      setCompressing(true);
      try {
        // Compress the image before setting it
        const compressedFile = await compressImage(file);
        setSelectedFile(compressedFile);
        setPreviewUrl(URL.createObjectURL(compressedFile));
      } catch (err: any) {
        setError(err.message || "Failed to process image");
      } finally {
        setCompressing(false);
      }
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile || !personName.trim()) {
      setError("Please select a photo and enter your name");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("personName", personName.trim());

      const response = await fetch("/api/gallery/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Upload failed (${response.status})`);
      }

      // Reset form
      setPersonName("");
      setSelectedFile(null);
      setPreviewUrl(null);
      onUploadComplete();
    } catch (err: any) {
      setError(err.message || "Failed to upload photo");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white">
      <h3 className="font-heading text-2xl font-bold text-thanksgiving-red mb-6">
        Share Your Memories 📸
      </h3>

      <form onSubmit={handleUpload} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-thanksgiving-cranberry mb-2">
            Your Name
          </label>
          <input
            type="text"
            value={personName}
            onChange={(e) => setPersonName(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border-2 border-thanksgiving-peach bg-white focus:border-thanksgiving-orange focus:outline-none transition-colors"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-thanksgiving-cranberry mb-2">
            Upload Photo
          </label>
          <div className="border-2 border-dashed border-thanksgiving-peach rounded-2xl p-6 text-center hover:border-thanksgiving-orange transition-colors cursor-pointer bg-white">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              {compressing ? (
                <div className="py-8">
                  <div className="text-4xl mb-2 animate-pulse">⏳</div>
                  <p className="text-thanksgiving-cranberry">
                    Optimizing image...
                  </p>
                </div>
              ) : previewUrl ? (
                <div className="relative w-full h-48 mb-2">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
              ) : (
                <div className="py-8">
                  <div className="text-4xl mb-2">📷</div>
                  <p className="text-thanksgiving-cranberry">
                    Click to select a photo
                  </p>
                </div>
              )}
            </label>
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={uploading || compressing || !selectedFile || !personName.trim()}
          className="w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-thanksgiving-orange to-thanksgiving-pumpkin text-white font-semibold hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {compressing ? "Optimizing..." : uploading ? "Uploading..." : "Upload Photo"}
        </button>
      </form>
    </div>
  );
}
