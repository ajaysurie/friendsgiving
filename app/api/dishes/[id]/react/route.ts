import { NextRequest, NextResponse } from "next/server";
import { getDish, updateDish } from "@/lib/kv";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { emoji } = body;

    if (!emoji || typeof emoji !== "string") {
      return NextResponse.json(
        { error: "emoji is required" },
        { status: 400 }
      );
    }

    const dish = await getDish(id);
    if (!dish) {
      return NextResponse.json({ error: "Dish not found" }, { status: 404 });
    }

    const reactions = { ...dish.reactions };
    reactions[emoji] = (reactions[emoji] || 0) + 1;

    await updateDish(id, { reactions });

    const updatedDish = await getDish(id);
    return NextResponse.json(updatedDish);
  } catch (error) {
    console.error("Error adding reaction:", error);
    return NextResponse.json(
      { error: "Failed to add reaction" },
      { status: 500 }
    );
  }
}
