export async function fetchRakutenItems(genreId: string) {
  const res = await fetch(`/api/rakuten?genreId=${genreId}`);
  if (!res.ok) throw new Error("楽天ランキングデータ取得に失敗しました");
  return res.json();
}
