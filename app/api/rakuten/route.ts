import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const genreId = searchParams.get('genreId') || '555164';

  const appId = process.env.NEXT_PUBLIC_RAKUTEN_APP_ID;
  const affiliateId = process.env.NEXT_PUBLIC_RAKUTEN_AFFILIATE_ID;

  const url = `https://app.rakuten.co.jp/services/api/IchibaItemRanking/20170628?format=json&applicationId=${appId}&affiliateId=${affiliateId}&genreId=${genreId}&hits=10`;

  console.log('🔍 リクエストURL:', url);

  try {
    const res = await fetch(url);
    console.log('🔍 ステータス:', res.status);

    const data = await res.json();
    console.log('🔍 APIレスポンス:', data);

    if (!res.ok) throw new Error(`楽天APIエラー: ${res.status}`);
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ API Error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
