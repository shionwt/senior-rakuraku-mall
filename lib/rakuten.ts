export async function fetchRakutenItems(genreId: string) {
  const appId = process.env.NEXT_PUBLIC_RAKUTEN_APP_ID;
  const affiliateId = process.env.NEXT_PUBLIC_RAKUTEN_AFFILIATE_ID;

  const url = `https://app.rakuten.co.jp/services/api/IchibaItemRanking/20170628?format=json&applicationId=${appId}&affiliateId=${affiliateId}&genreId=${genreId}&hits=30`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("楽天ランキングデータ取得に失敗しました");
  return res.json();
}
