import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const genreId = searchParams.get('genreId') || '555164';

  const appId = process.env.NEXT_PUBLIC_RAKUTEN_APP_ID;
  if (!appId) {
    return NextResponse.json({ error: 'Missing NEXT_PUBLIC_RAKUTEN_APP_ID' }, { status: 500 });
  }

  // ✅ 正しいエンドポイント（スラッシュあり）
  const url = new URL('https://app.rakuten.co.jp/services/api/IchibaItem/Ranking/20170628');
  url.searchParams.set('format', 'json');
  url.searchParams.set('applicationId', appId);
  url.searchParams.set('genreId', genreId);
  url.searchParams.set('hits', '30');

  // ⚠️ まずは affiliateId を付けずに動作確認（400の切り分け）
  // 付けたければ↓コメントアウト解除
  // const affiliateId = process.env.NEXT_PUBLIC_RAKUTEN_AFFILIATE_ID;
  // if (affiliateId) url.searchParams.set('affiliateId', affiliateId);

  try {
    const res = await fetch(url.toString(), { cache: 'no-store' });
    const data = await res.json();

    // ログ（Vercel Functionsで確認）
    console.log('🔍 URL:', url.toString());
    console.log('🔍 STATUS:', res.status);
    console.log('🔍 BODY keys:', Object.keys(data || {}));

    if (!res.ok) {
      // 楽天のエラー内容をそのままログへ
      console.error('❌ Rakuten API Error payload:', data);
      throw new Error(`楽天APIエラー: ${res.status}`);
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('❌ API Error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
