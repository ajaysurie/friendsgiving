import { NextRequest, NextResponse } from "next/server";
import { getGalleryPhoto, updateGalleryPhoto } from "@/lib/db";
import { thanksgivingifyImage } from "@/lib/gemini";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const photo = await getGalleryPhoto(id);
    if (!photo) {
      return NextResponse.json({ error: "Photo not found" }, { status: 404 });
    }

    if (photo.thanksgivingPhotoUrl) {
      return NextResponse.json(
        { error: "Photo is already Thanksgiving-ified" },
        { status: 400 }
      );
    }

    // Generate Thanksgiving-ified version
    const thanksgivingPhotoUrl = await thanksgivingifyImage(
      photo.originalPhotoUrl
    );

    await updateGalleryPhoto(id, { thanksgivingPhotoUrl });

    const updatedPhoto = await getGalleryPhoto(id);
    return NextResponse.json(updatedPhoto);
  } catch (error) {
    console.error("Error thanksgiving-ifying photo:", error);
    return NextResponse.json(
      { error: "Failed to thanksgiving-ify photo" },
      { status: 500 }
    );
  }
}
