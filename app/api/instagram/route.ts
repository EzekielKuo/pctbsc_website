import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const INSTAGRAM_OEMBED_ACCESS_TOKEN = process.env.INSTAGRAM_OEMBED_ACCESS_TOKEN;

async function fetchInstagramDescription(url: string): Promise<string | null> {
  if (INSTAGRAM_OEMBED_ACCESS_TOKEN) {
    try {
      const graphUrl = `https://graph.facebook.com/v18.0/instagram_oembed?url=${encodeURIComponent(
        url
      )}&access_token=${INSTAGRAM_OEMBED_ACCESS_TOKEN}`;
      const response = await fetch(graphUrl);
      if (response.ok) {
        const data = await response.json();
        if (data.title) {
          return data.title.trim();
        }
      } else {
        console.warn('Instagram oEmbed 回傳錯誤', await response.text());
      }
    } catch (error) {
      console.warn('Instagram oEmbed 請求失敗:', error);
    }
  } else {
    console.warn('缺少 INSTAGRAM_OEMBED_ACCESS_TOKEN，無法呼叫 Graph API');
  }

  try {
    const pageResponse = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });
    if (pageResponse.ok) {
      const html = await pageResponse.text();
      const ogMatch = html.match(/<meta\s+property="og:description"\s+content="([^"]+)"/i);
      if (ogMatch && ogMatch[1]) {
        return ogMatch[1].trim();
      }
      const ldMatch = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i);
      if (ldMatch) {
        try {
          const payload = JSON.parse(ldMatch[1]);
          if (payload.caption || payload.description) {
            return (payload.caption || payload.description).trim();
          }
        } catch {
          // JSON 解析失敗
        }
      }
      const sharedDataMatch = html.match(/window\._sharedData\s*=\s*({.+?});/s);
      if (sharedDataMatch) {
        try {
          const sharedData = JSON.parse(sharedDataMatch[1]);
          const entry = sharedData?.entry_data?.PostPage?.[0]?.graphql?.shortcode_media;
          if (entry?.edge_media_to_caption?.edges?.[0]?.node?.text) {
            return entry.edge_media_to_caption.edges[0].node.text.trim();
          }
        } catch {
          // 解析失敗
        }
      }
    }
  } catch (error) {
    console.warn('透過網頁提取 Instagram 描述失敗:', error);
  }

  return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(_: NextRequest) {
  try {
    const posts = await prisma.instagramPost.findMany({
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    return NextResponse.json({ success: true, data: posts });
  } catch (error) {
    console.error('獲取 Instagram 貼文錯誤:', error);
    return NextResponse.json(
      { success: false, error: '獲取 Instagram 貼文失敗' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, name, order } = body;

    if (!url) {
      return NextResponse.json(
        { success: false, error: '缺少必要欄位：url' },
        { status: 400 }
      );
    }

    // 驗證 Instagram URL 格式
    if (!url.includes('instagram.com/p/') && !url.includes('instagram.com/reel/')) {
      return NextResponse.json(
        { success: false, error: '請提供有效的 Instagram 貼文 URL' },
        { status: 400 }
      );
    }

    // 自動從 Instagram URL 抓取貼文描述
    const description = await fetchInstagramDescription(url);

    const post = await prisma.instagramPost.create({
      data: {
        url,
        name: name || null,
        description: description || null,
        order: order !== undefined ? order : 0,
      },
    });

    return NextResponse.json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error('新增 Instagram 貼文錯誤:', error);
    return NextResponse.json(
      { success: false, error: '新增 Instagram 貼文失敗' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, url, name, order } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: '缺少必要欄位：id' },
        { status: 400 }
      );
    }

    const updateData: { url?: string; description?: string | null; name?: string | null; order?: number } = {};
    if (url) {
      // 驗證 Instagram URL 格式
      if (!url.includes('instagram.com/p/') && !url.includes('instagram.com/reel/')) {
        return NextResponse.json(
          { success: false, error: '請提供有效的 Instagram 貼文 URL' },
          { status: 400 }
        );
      }
      updateData.url = url;
      // 如果 URL 改變了，重新抓取描述
      const description = await fetchInstagramDescription(url);
      updateData.description = description || null;
    }
    if (name !== undefined) updateData.name = name || null;
    if (order !== undefined) updateData.order = order;

    const post = await prisma.instagramPost.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: post });
  } catch (error) {
    console.error('更新 Instagram 貼文錯誤:', error);
    return NextResponse.json(
      { success: false, error: '更新 Instagram 貼文失敗' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: '缺少必要參數：id' },
        { status: 400 }
      );
    }

    await prisma.instagramPost.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('刪除 Instagram 貼文錯誤:', error);
    return NextResponse.json(
      { success: false, error: '刪除 Instagram 貼文失敗' },
      { status: 500 }
    );
  }
}
