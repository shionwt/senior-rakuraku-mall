'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [genreId, setGenreId] = useState("100939"); // 初期ジャンル：コスメ
  const [rankingType, setRankingType] = useState<'sales' | 'discount'>('sales'); // 人気順 or 割引順

  const appId = process.env.NEXT_PUBLIC_RAKUTEN_APP_ID;
  const affiliateId = process.env.NEXT_PUBLIC_RAKUTEN_AFFILIATE_ID;

  // ジャンル定義
  const categories = [
    { name: "健康食品", id: "100987" },
    { name: "家電", id: "211742" }, // 生活家電
    { name: "飲料", id: "100316" },
    { name: "コスメ", id: "100939" },
    { name: "キッチン", id: "558944" },
  ];

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        let url = '';
        if (rankingType === 'sales') {
          // 売上順（公式ランキング）
          url = `https://app.rakuten.co.jp/services/api/IchibaItem/Ranking/20220601?format=json&applicationId=${appId}&affiliateId=${affiliateId}&genreId=${genreId}`;
        } else {
          // 割引順（Search API）+ 500円未満除外
          url = `https://app.rakuten.co.jp/services/api/IchibaItem/Search/20220601?format=json&applicationId=${appId}&affiliateId=${affiliateId}&genreId=${genreId}&hits=30&sort=%2BitemPrice&minPrice=500`;
        }

        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) throw new Error(`APIエラー: ${res.status}`);
        const data = await res.json();

        // 売上順
        if (rankingType === 'sales' && data && data.Items) {
          setItems(data.Items.map((i: any) => i.Item));
        }
        // 割引順
        else if (rankingType === 'discount' && data && data.Items) {
          const withDiscount = data.Items.map((obj: any) => {
            const item = obj.Item;
            const regular = item.itemPriceBeforeDiscount || item.itemPrice * 1.2; // 仮定: 通常価格 ≒ 1.2倍
            const discountRate =
              regular && item.itemPrice
                ? Math.round(((regular - item.itemPrice) / regular) * 100)
                : 0;
            return { ...item, discountRate, regularPrice: regular };
          });

          // 割引率が高い順に並べ替え
          const sorted = withDiscount.sort((a, b) => b.discountRate - a.discountRate);
          setItems(sorted);
        } else {
          setError('データが見つかりませんでした');
        }
      } catch (err: any) {
        console.error('API取得失敗:', err);
        setError('通信エラーまたはAPIエラー');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [genreId, rankingType]);

  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#fff', color: '#222' }}>
      {/* ヘッダー */}
      <header
        style={{
          backgroundColor: '#fff',
          padding: '12px 0',
          borderBottom: '1px solid #ddd',
          textAlign: 'center',
          fontSize: '26px',
          fontWeight: 'bold',
        }}
      >
        らく得セレクト
      </header>

      {/* ランキング種別タブ */}
      <nav
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          padding: '10px',
          background: '#f3f3f3',
          borderBottom: '1px solid #ddd',
        }}
      >
        <button
          onClick={() => setRankingType('sales')}
          style={{
            backgroundColor: rankingType === 'sales' ? '#E60012' : '#ccc',
            color: '#fff',
            fontSize: '16px',
            padding: '8px 14px',
            borderRadius: '18px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          人気順
        </button>
        <button
          onClick={() => setRankingType('discount')}
          style={{
            backgroundColor: rankingType === 'discount' ? '#E60012' : '#ccc',
            color: '#fff',
            fontSize: '16px',
            padding: '8px 14px',
            borderRadius: '18px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          割引順
        </button>
      </nav>

      {/* ジャンルタブ */}
      <nav
        style={{
          display: 'flex',
          overflowX: 'auto',
          gap: '10px',
          padding: '10px',
          background: '#f8f8f8',
          borderBottom: '1px solid #ddd',
        }}
      >
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setGenreId(c.id)}
            style={{
              flexShrink: 0,
              backgroundColor: genreId === c.id ? '#E60012' : '#ccc',
              color: '#fff',
              fontSize: '18px',
              fontWeight: 600,
              padding: '8px 14px',
              borderRadius: '20px',
              border: 'none',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
            }}
          >
            {c.name}
          </button>
        ))}
      </nav>

      {/* ステータス表示 */}
      {loading && <p style={{ textAlign: 'center', marginTop: '40px' }}>📡 データ取得中...</p>}
      {error && <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>}

      {/* 商品一覧 */}
      <main style={{ padding: '20px' }}>
        {!loading &&
          !error &&
          items.map((item: any, i) => (
            <div
              key={i}
              style={{
                backgroundColor: '#fff',
                borderRadius: '16px',
                border: '1px solid #ddd',
                padding: '14px',
                marginBottom: '18px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                transition: 'transform 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    fontSize: '26px',
                    fontWeight: 'bold',
                    color: '#E60012',
                    width: '32px',
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </div>

                {/* 商品画像 */}
                <img
                  src={item.mediumImageUrls?.[0]?.imageUrl?.replace('?ex=128x128', '') ?? ''}
                  alt={item.itemName}
                  style={{
                    borderRadius: '12px',
                    border: '1px solid #ccc',
                    width: '90px',
                    height: '90px',
                    objectFit: 'cover',
                  }}
                />

                {/* 商品情報 */}
                <div style={{ flex: 1 }}>
                  <h2
                    style={{
                      fontSize: '17px',
                      fontWeight: 'bold',
                      marginBottom: '4px',
                      lineHeight: '1.3em',
                    }}
                  >
                    {item.itemName}
                  </h2>

                  {/* 価格エリア */}
                  <p style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '6px' }}>
                    {rankingType === 'discount' && item.discountRate > 0 ? (
                      <>
                        <span style={{ color: '#E60012' }}>
                          ¥{Number(item.itemPrice).toLocaleString()}
                        </span>
                        <span
                          style={{
                            textDecoration: 'line-through',
                            color: '#777',
                            fontSize: '14px',
                            marginLeft: '6px',
                          }}
                        >
                          ¥{Number(item.regularPrice || item.itemPrice * 1.2).toLocaleString()}
                        </span>
                        <span style={{ color: '#E60012', fontSize: '14px', marginLeft: '6px' }}>
                          （{item.discountRate}%OFF）
                        </span>
                      </>
                    ) : (
                      <span style={{ color: '#E60012' }}>
                        ¥{Number(item.itemPrice).toLocaleString()}
                      </span>
                    )}
                  </p>

                  {/* リンク */}
                  <a
                    href={item.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'center',
                      padding: '8px',
                      backgroundColor: '#E60012',
                      color: '#fff',
                      borderRadius: '10px',
                      textDecoration: 'none',
                      fontSize: '16px',
                    }}
                  >
                    楽天で見る
                  </a>
                </div>
              </div>
            </div>
          ))}
      </main>
    </div>
  );
}
