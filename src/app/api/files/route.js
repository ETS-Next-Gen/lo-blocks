// src/app/api/files/route.js
import { FileStorageProvider } from '@/lib/storage';

export async function GET() {
  const provider = new FileStorageProvider('./content');
  const tree = await provider.listFiles();
  return Response.json({ ok: true, tree });
}
