import { NextRequest, NextResponse } from "next/server";
import { getDish, updateDish } from "@/lib/kv";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { personName } = body;

    if (!personName || typeof personName !== "string") {
      return NextResponse.json(
        { error: "personName is required" },
        { status: 400 }
      );
    }

    const dish = await getDish(id);
    if (!dish) {
      return NextResponse.json({ error: "Dish not found" }, { status: 404 });
    }

    if (dish.claimedBy) {
      return NextResponse.json(
        { error: "Dish is already claimed" },
        { status: 400 }
      );
    }

    await updateDish(id, { claimedBy: personName });

    const updatedDish = await getDish(id);
    return NextResponse.json(updatedDish);
  } catch (error) {
    console.error("Error claiming dish:", error);
    return NextResponse.json(
      { error: "Failed to claim dish" },
      { status: 500 }
    );
  }
}
