import { NextRequest, NextResponse } from 'next/server';
import { Readable } from 'stream';
import {
  isYouTubeConfigured,
  uploadVideoToYouTube,
  saveVideoLocally,
  extractYouTubeId,
  obfuscateVideoToken
} from '@/lib/youtube-service';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let file: File | null = null;
    let title = 'محاضرة تعليمية جديدة';
    let description = 'تم الرفع عبر منصة YA7EDU';
    let directYouTubeUrl: string | null = null;

    if (contentType.includes('application/json')) {
      const body = await req.json();
      title = body.title || title;
      description = body.description || description;
      directYouTubeUrl = body.youtubeUrl || null;
    } else {
      const formData = await req.formData();
      file = formData.get('file') as File | null;
      title = (formData.get('title') as string) || title;
      description = (formData.get('description') as string) || description;
      directYouTubeUrl = formData.get('youtubeUrl') as string | null;
    }

    // Case 1: Direct YouTube URL provided
    if (directYouTubeUrl && directYouTubeUrl.trim()) {
      const ytId = extractYouTubeId(directYouTubeUrl.trim());
      if (!ytId) {
        return NextResponse.json(
          { error: 'رابط يوتيوب غير صالح. يرجى التأكد من كتابة الرابط بشكل صحيح.' },
          { status: 400 }
        );
      }
      return NextResponse.json({
        success: true,
        source: 'youtube',
        videoId: ytId,
        videoUrl: `https://www.youtube.com/watch?v=${ytId}`,
        secureToken: obfuscateVideoToken(ytId),
        title
      });
    }

    // Case 2: Raw Video File Uploaded
    if (!file) {
      return NextResponse.json(
        { error: 'لم يتم إرفاق ملف فيديو للرفع' },
        { status: 400 }
      );
    }

    // Check file size (e.g. limit or warning)
    const sizeInMB = file.size / (1024 * 1024);

    // Try YouTube Upload if configured
    if (isYouTubeConfigured()) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const stream = Readable.from(buffer);

        const ytResult = await uploadVideoToYouTube({
          title,
          description,
          fileStream: stream,
          mimeType: file.type || 'video/mp4'
        });

        return NextResponse.json({
          success: true,
          source: 'youtube_uploaded',
          videoId: ytResult.videoId,
          videoUrl: ytResult.videoUrl,
          secureToken: obfuscateVideoToken(ytResult.videoId),
          sizeMB: sizeInMB.toFixed(1),
          message: 'تم رفع الفيديو بنجاح إلى قناة اليوتيوب كفيديو غير مدرج (Unlisted)'
        });
      } catch (ytError: any) {
        console.error('YouTube upload failed, falling back to local storage:', ytError);
        // Fallback to local storage if YouTube upload fails
        const local = await saveVideoLocally(file);
        return NextResponse.json({
          success: true,
          source: 'local_storage',
          videoUrl: local.videoUrl,
          secureToken: obfuscateVideoToken(local.videoUrl),
          sizeMB: sizeInMB.toFixed(1),
          warning: `تعذر الاتصال بـ YouTube API (${ytError.message}). تم حفظ الفيديو بنجاح على سيرفر المنصة كبديل آمن.`
        });
      }
    } else {
      // Local VPS Storage upload
      const local = await saveVideoLocally(file);
      return NextResponse.json({
        success: true,
        source: 'local_storage',
        videoUrl: local.videoUrl,
        secureToken: obfuscateVideoToken(local.videoUrl),
        sizeMB: sizeInMB.toFixed(1),
        message: 'تم حفظ الفيديو بنجاح على سيرفر المنصة الآمن (جاهز للتشغيل بالمشغل المحمي)'
      });
    }
  } catch (error: any) {
    console.error('Error handling video upload:', error);
    return NextResponse.json(
      { error: error?.message || 'حدث خطأ أثناء معالجة رفع الفيديو' },
      { status: 500 }
    );
  }
}
