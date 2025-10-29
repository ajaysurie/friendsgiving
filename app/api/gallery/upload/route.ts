import { NextRequest, NextResponse } from "next/server";
import { createGalleryPhoto } from "@/lib/db";
import { GalleryPhoto } from "@/types";

// Use local mock Blob if Vercel Blob is not configured
let put: any;
if (process.env.BLOB_READ_WRITE_TOKEN) {
  put = require("@vercel/blob").put;
} else {
  put = require("@/lib/blob-local").put;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const personName = formData.get("personName") as string;

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    if (!personName) {
      return NextResponse.json(
        { error: "personName is required" },
        { status: 400 }
      );
    }

    // Upload to Vercel Blob
    const blob = await put(file.name, file, {
      access: "public",
    });

    const photo: GalleryPhoto = {
      id: `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      personName,
      originalPhotoUrl: blob.url,
      thanksgivingPhotoUrl: null,
      createdAt: Date.now(),
      year: new Date().getFullYear(), // Store the year for future filtering
    };

    await createGalleryPhoto(photo);

    return NextResponse.json(photo, { status: 201 });
  } catch (error) {
    console.error("Error uploading photo:", error);
    return NextResponse.json(
      { error: "Failed to upload photo" },
      { status: 500 }
    );
  }
}
