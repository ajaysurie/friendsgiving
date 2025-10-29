"use client";

import { GalleryPhoto } from "@/types";
import Image from "next/image";
import { useState } from "react";

interface GalleryPhotoCardProps {
  photo: GalleryPhoto;
  onUpdate: () => void;
}

export default function GalleryPhotoCard({ photo, onUpdate }: GalleryPhotoCardProps) {
  const [thanksgivingifying, setThanksgivingifying] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  const handleThanksgivingify = async () => {
    setThanksgivingifying(true);
    try {
      await fetch(`/api/gallery/${photo.id}/thanksgiving-ify`, {
        method: "POST",
      });
      onUpdate();
    } catch (error) {
      console.error("Failed to thanksgiving-ify:", error);
    } finally {
      setThanksgivingifying(false);
    }
  };

  const hasThanksgivingVersion = !!photo.thanksgivingPhotoUrl;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-white">
      {/* Images */}
      <div className="relative aspect-[4/3]">
        {hasThanksgivingVersion && showComparison ? (
          <div className="grid grid-cols-2 h-full">
            <div className="relative border-r-2 border-thanksgiving-peach">
              <Image
                src={photo.originalPhotoUrl}
                alt="Original"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                Before
              </div>
            </div>
            <div className="relative">
              <Image
                src={photo.thanksgivingPhotoUrl!}
                alt="Thanksgiving-ified"
                fill
                className="object-cover"
              />
              <div className="absolute bottom-2 right-2 bg-thanksgiving-orange text-white text-xs px-2 py-1 rounded">
                After
              </div>
            </div>
          </div>
        ) : (
          <Image
            src={hasThanksgivingVersion ? photo.thanksgivingPhotoUrl! : photo.originalPhotoUrl}
            alt={photo.personName}
            fill
            className="object-cover"
          />
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="font-semibold text-thanksgiving-red mb-3">
          {photo.personName}
        </p>

        {!hasThanksgivingVersion ? (
          <button
            onClick={handleThanksgivingify}
            disabled={thanksgivingifying}
            className="w-full px-4 py-3 rounded-2xl bg-gradient-to-r from-thanksgiving-orange to-thanksgiving-pumpkin text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50"
          >
            {thanksgivingifying ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">🦃</span>
                Thanksgiving-ifying...
              </span>
            ) : (
              "Thanksgiving-ify! 🎃"
            )}
          </button>
        ) : (
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="w-full px-4 py-3 rounded-2xl border-2 border-thanksgiving-orange text-thanksgiving-orange font-semibold hover:bg-thanksgiving-peach transition-colors"
          >
            {showComparison ? "Show Result" : "Show Before/After"}
          </button>
        )}
      </div>
    </div>
  );
}
