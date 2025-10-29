import { GoogleGenerativeAI } from "@google/generative-ai";

function getGenAI() {
  if (!process.env.GOOGLE_AI_API_KEY) {
    throw new Error("GOOGLE_AI_API_KEY is not set");
  }
  return new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
}

export async function generateDishImage(dishName: string): Promise<string> {
  // Skip image generation in development mode
  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    console.log(`[Dev Mode] Skipping image generation for: ${dishName}`);
    return `https://placehold.co/600x400/FF7518/FFF8E7/png?text=${encodeURIComponent(dishName)}&font=roboto`;
  }

  try {
    const genAI = getGenAI();
    // Use Gemini 2.5 Flash image generation model (nanobanana)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-image" });

    const prompt = `A beautiful, appetizing photo of ${dishName} on a festive table setting, professional food photography, warm lighting`;

    const result = await model.generateContent(prompt);
    const response = result.response;

    // The response should contain the generated image
    // Check if there are any parts with inline data
    const candidates = response.candidates;
    if (candidates && candidates[0]?.content?.parts) {
      const imagePart = candidates[0].content.parts.find((part: any) => part.inlineData);
      if (imagePart?.inlineData) {
        // Convert base64 image to data URL
        const mimeType = imagePart.inlineData.mimeType || 'image/png';
        const data = imagePart.inlineData.data;
        return `data:${mimeType};base64,${data}`;
      }
    }

    // If no image found, use fallback
    console.warn("No image data in Gemini response, using fallback");
    return `https://placehold.co/600x400/FF7518/FFF8E7/png?text=${encodeURIComponent(dishName)}&font=roboto`;
  } catch (error) {
    console.error("Error generating dish image:", error);
    // Return a fallback placeholder image using a reliable service
    return `https://placehold.co/600x400/FF7518/FFF8E7/png?text=${encodeURIComponent(dishName)}&font=roboto`;
  }
}

export async function thanksgivingifyImage(imageUrl: string): Promise<string> {
  // Skip image generation in development mode
  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    console.log(`[Dev Mode] Skipping Thanksgiving-ify transformation`);
    return imageUrl; // Just return original image in dev
  }

  try {
    const genAI = getGenAI();
    // Use Gemini 2.5 Flash image generation model (nanobanana)
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-image" });

    const prompt = `Transform this image into a festive Thanksgiving scene. Add autumn leaves, warm fall colors (oranges, reds, yellows), pumpkins, turkeys, and a cozy holiday atmosphere while keeping the people recognizable.`;

    // For image transformation, we'd need to pass the original image
    // This is a simplified version - may need to fetch and convert the image
    const result = await model.generateContent(prompt);
    const response = result.response;

    // Check for generated image in response
    const candidates = response.candidates;
    if (candidates && candidates[0]?.content?.parts) {
      const imagePart = candidates[0].content.parts.find((part: any) => part.inlineData);
      if (imagePart?.inlineData) {
        const mimeType = imagePart.inlineData.mimeType || 'image/png';
        const data = imagePart.inlineData.data;
        return `data:${mimeType};base64,${data}`;
      }
    }

    console.warn("No transformed image in response, returning original");
    return imageUrl;
  } catch (error) {
    console.error("Error thanksgiving-ifying image:", error);
    // Return original image as fallback
    return imageUrl;
  }
}
