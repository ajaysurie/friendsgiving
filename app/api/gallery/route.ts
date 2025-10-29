import { NextResponse } from "next/server";
import { getAllGalleryPhotos } from "@/lib/db";

export async function GET() {
  try {
    const photos = await getAllGalleryPhotos();
    return NextResponse.json(photos);
  } catch (error) {
    console.error("Error fetching gallery photos:", error);
    return NextResponse.json(
      { error: "Failed to fetch gallery photos" },
      { status: 500 }
    );
  }
}
