import { NextRequest, NextResponse } from "next/server";
import { deleteGalleryPhoto } from "@/lib/db";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await deleteGalleryPhoto(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting gallery photo:", error);
    return NextResponse.json(
      { error: "Failed to delete gallery photo" },
      { status: 500 }
    );
  }
}
