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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
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
        throw new Error("Failed to upload photo");
      }

      // Reset form
      setPersonName("");
      setSelectedFile(null);
      setPreviewUrl(null);
      onUploadComplete();
    } catch (err: any) {
      setError(err.message);
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
              {previewUrl ? (
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
          disabled={uploading || !selectedFile || !personName.trim()}
          className="w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-thanksgiving-orange to-thanksgiving-pumpkin text-white font-semibold hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? "Uploading..." : "Upload Photo"}
        </button>
      </form>
    </div>
  );
}
