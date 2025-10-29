import { NextResponse } from "next/server";
import { getAllDishes } from "@/lib/kv";

export async function GET() {
  try {
    const dishes = await getAllDishes();
    return NextResponse.json(dishes);
  } catch (error) {
    console.error("Error fetching dishes:", error);
    return NextResponse.json(
      { error: "Failed to fetch dishes" },
      { status: 500 }
    );
  }
}
