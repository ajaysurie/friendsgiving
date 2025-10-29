// Local mock for Vercel Blob during development
// This allows testing without Vercel Blob configured

export async function put(
  filename: string,
  file: File | Blob,
  options?: { access: string }
): Promise<{ url: string }> {
  console.log(`[Local Blob] Mock upload: ${filename}`);

  // Convert blob to buffer
  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = buffer.toString('base64');
  const mimeType = file.type || 'image/jpeg';

  // Create a data URL for local testing
  const dataUrl = `data:${mimeType};base64,${base64}`;

  return {
    url: dataUrl,
  };
}
