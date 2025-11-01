import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const genreId = searchParams.get('genreId') || '555164';

  const appId = process.env.NEXT_PUBLIC_RAKUTEN_APP_ID;
  const affiliateId = process.env.NEXT_PUBLIC_RAKUTEN_AFFILIATE_ID;

  // ✅ 正しいURL（スラッシュなし）
  const url = `https://app.rakuten.co.jp/services/api/IchibaItemRanking/20170628?format=json&applicationId=${appId}&affiliateId=${affiliateId}&genreId=${genreId}&hits=30`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error('楽天APIリクエスト失敗');
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'failed to fetch data' }, { status: 500 });
  }
}
