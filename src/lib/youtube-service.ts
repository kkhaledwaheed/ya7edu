import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
export { extractYouTubeId, obfuscateVideoToken, deobfuscateVideoToken } from '@/lib/video-utils';

/**
 * Checks if YouTube OAuth2 credentials are configured
 */
export function isYouTubeConfigured(): boolean {
  return !!(
    process.env.YOUTUBE_CLIENT_ID &&
    process.env.YOUTUBE_CLIENT_SECRET &&
    process.env.YOUTUBE_REFRESH_TOKEN
  );
}

/**
 * Uploads a video buffer/stream directly to YouTube as 'unlisted'
 */
export async function uploadVideoToYouTube({
  title,
  description,
  fileStream,
  mimeType = 'video/mp4'
}: {
  title: string;
  description: string;
  fileStream: Readable;
  mimeType?: string;
}): Promise<{ videoId: string; videoUrl: string }> {
  const clientId = process.env.YOUTUBE_CLIENT_ID;
  const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
  const refreshToken = process.env.YOUTUBE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      'لم يتم إعداد بيانات YouTube OAuth2 API (YOUTUBE_CLIENT_ID / YOUTUBE_CLIENT_SECRET / YOUTUBE_REFRESH_TOKEN) في ملف .env'
    );
  }

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    'https://developers.google.com/oauthplayground'
  );

  oauth2Client.setCredentials({
    refresh_token: refreshToken
  });

  const youtube = google.youtube({
    version: 'v3',
    auth: oauth2Client
  });

  const response = await youtube.videos.insert({
    part: ['snippet', 'status'],
    requestBody: {
      snippet: {
        title,
        description: `${description}\n\nتم الرفع عبر منظومة YA7EDU التعليمية - مشفر ومحمي بحقوق الملكية.`,
        tags: ['ya7edu', 'education', 'lecture'],
        categoryId: '27' // Education category
      },
      status: {
        privacyStatus: 'unlisted', // Always unlisted so no one on YouTube can find it
        selfDeclaredMadeForKids: false
      }
    },
    media: {
      mimeType,
      body: fileStream
    }
  });

  const videoId = response.data.id;
  if (!videoId) {
    throw new Error('فشل الحصول على معرّف الفيديو من يوتيوب');
  }

  return {
    videoId,
    videoUrl: `https://www.youtube.com/watch?v=${videoId}`
  };
}

/**
 * Fallback: Saves uploaded video file to local/VPS storage
 */
export async function saveVideoLocally(file: File): Promise<{ videoUrl: string; fileName: string; sizeBytes: number }> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const uniqueName = `lec_${Date.now()}_${cleanName}`;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'videos');

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, uniqueName);
  await fs.promises.writeFile(filePath, buffer);

  return {
    videoUrl: `/uploads/videos/${uniqueName}`,
    fileName: uniqueName,
    sizeBytes: file.size
  };
}
