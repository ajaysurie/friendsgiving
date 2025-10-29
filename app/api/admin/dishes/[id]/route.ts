import { NextRequest, NextResponse } from "next/server";
import { getDish, updateDish, deleteDish } from "@/lib/db";
import { generateDishImage } from "@/lib/gemini";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { dishName, dietaryTags } = body;

    const dish = await getDish(id);
    if (!dish) {
      return NextResponse.json({ error: "Dish not found" }, { status: 404 });
    }

    const updates: any = {};

    if (dishName && dishName !== dish.dishName) {
      updates.dishName = dishName;
      // Regenerate image if dish name changed
      updates.generatedImageUrl = await generateDishImage(dishName);
    }

    if (dietaryTags && Array.isArray(dietaryTags)) {
      updates.dietaryTags = dietaryTags;
    }

    await updateDish(id, updates);

    const updatedDish = await getDish(id);
    return NextResponse.json(updatedDish);
  } catch (error) {
    console.error("Error updating dish:", error);
    return NextResponse.json(
      { error: "Failed to update dish" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const dish = await getDish(id);
    if (!dish) {
      return NextResponse.json({ error: "Dish not found" }, { status: 404 });
    }

    await deleteDish(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting dish:", error);
    return NextResponse.json(
      { error: "Failed to delete dish" },
      { status: 500 }
    );
  }
}
