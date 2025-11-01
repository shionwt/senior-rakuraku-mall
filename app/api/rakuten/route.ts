import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const genreId = searchParams.get('genreId') || '555164';

  const appId = process.env.NEXT_PUBLIC_RAKUTEN_APP_ID;
  const affiliateId = process.env.NEXT_PUBLIC_RAKUTEN_AFFILIATE_ID;

  // ✅ アフィリエイトID付きのリクエストURLに変更
  const url = `https://app.rakuten.co.jp/services/api/IchibaItem/Ranking/20170628?format=json&applicationId=${appId}&affiliateId=${affiliateId}&genreId=${genreId}&hits=30`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
      console.error('楽天APIエラー:', data);
      throw new Error(`楽天APIエラー: ${res.status}`);
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ API Error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
