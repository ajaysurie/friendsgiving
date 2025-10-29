import { NextRequest, NextResponse } from "next/server";
import { createDish } from "@/lib/db";
import { generateDishImage } from "@/lib/gemini";
import { Dish } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { dishName, dietaryTags } = body;

    if (!dishName || !Array.isArray(dietaryTags)) {
      return NextResponse.json(
        { error: "dishName and dietaryTags are required" },
        { status: 400 }
      );
    }

    // Generate AI image for the dish
    const generatedImageUrl = await generateDishImage(dishName);

    const dish: Dish = {
      id: `dish_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      dishName,
      dietaryTags,
      generatedImageUrl,
      claimedBy: null,
      reactions: {},
      createdAt: Date.now(),
      year: new Date().getFullYear(), // Store the year for future filtering
    };

    await createDish(dish);

    return NextResponse.json(dish, { status: 201 });
  } catch (error) {
    console.error("Error creating dish:", error);
    return NextResponse.json(
      { error: "Failed to create dish" },
      { status: 500 }
    );
  }
}
