'use client';
import { useEffect, useState, memo } from 'react';
import useSWR from 'swr';

type Item = {
  itemName: string;
  itemPrice: number;
  regularPrice?: number;
  discountRate?: number;
  affiliateUrl: string;
  mediumImageUrls?: { imageUrl: string }[];
  [key: string]: any;
};

const fetcher = (url: string) => fetch(url).then(res => res.json());

const ProductCard = memo(({ item, index, rankingType }: { item: Item; index: number; rankingType: 'sales' | 'discount' }) => (
  <div
    style={{
      backgroundColor: '#fff',
      borderRadius: '16px',
      border: '1px solid #ddd',
      padding: '14px',
      marginBottom: '18px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <div
        style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#E60012',
          width: '32px',
          flexShrink: 0,
        }}
      >
        {index + 1}
      </div>

      {/* 商品画像 */}
      <img
        src={item.mediumImageUrls?.[0]?.imageUrl?.replace('?ex=128x128', '') ?? ''}
        alt={item.itemName}
        loading="lazy"
        style={{
          borderRadius: '12px',
          border: '1px solid #ccc',
          width: '90px',
          height: '90px',
          objectFit: 'cover',
          flexShrink: 0,
        }}
      />

      {/* 商品情報 */}
      <div style={{ flex: 1 }}>
        <h2
          style={{
            fontSize: '16px',
            fontWeight: 'bold',
            marginBottom: '4px',
            lineHeight: '1.3em',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {item.itemName}
        </h2>

        {/* 価格 */}
        <p style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '6px' }}>
          {rankingType === 'discount' && item.discountRate && item.discountRate > 0 ? (
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
));
ProductCard.displayName = 'ProductCard';

export default function Home() {
  const [genreId, setGenreId] = useState("100939");
  const [rankingType, setRankingType] = useState<'sales' | 'discount'>('sales');
  const [visibleCount, setVisibleCount] = useState(10);

  const appId = process.env.NEXT_PUBLIC_RAKUTEN_APP_ID;
  const affiliateId = process.env.NEXT_PUBLIC_RAKUTEN_AFFILIATE_ID;

  const categories = [
    { name: "健康食品", id: "100987" },
    { name: "家電", id: "211742" },
    { name: "飲料", id: "100316" },
    { name: "コスメ", id: "100939" },
    { name: "キッチン", id: "558944" },
  ];

  const url =
    rankingType === 'sales'
      ? `https://app.rakuten.co.jp/services/api/IchibaItem/Ranking/20220601?format=json&applicationId=${appId}&affiliateId=${affiliateId}&genreId=${genreId}`
      : `https://app.rakuten.co.jp/services/api/IchibaItem/Search/20220601?format=json&applicationId=${appId}&affiliateId=${affiliateId}&genreId=${genreId}&hits=30&sort=%2BitemPrice&minPrice=500`;

  const { data, error, isLoading } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 600000,
  });

  const items: Item[] =
    data?.Items?.map((obj: any) => {
      const item = obj.Item;
      if (rankingType === 'discount') {
        const regular = item.itemPriceBeforeDiscount || item.itemPrice * 1.2;
        const discountRate = regular && item.itemPrice
          ? Math.round(((regular - item.itemPrice) / regular) * 100)
          : 0;
        return { ...item, discountRate, regularPrice: regular };
      }
      return item;
    }) || [];

  const sortedItems =
    rankingType === 'discount'
      ? items.sort((a: Item, b: Item) => (b.discountRate || 0) - (a.discountRate || 0))
      : items;

  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#fff', color: '#222' }}>
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
        シニアらくらくモール
      </header>

      {/* タブ */}
      <nav style={{ display: 'flex', justifyContent: 'center', gap: '8px', padding: '10px', background: '#f3f3f3' }}>
        {['sales', 'discount'].map((t) => (
          <button
            key={t}
            onClick={() => setRankingType(t as any)}
            style={{
              backgroundColor: rankingType === t ? '#E60012' : '#ccc',
              color: '#fff',
              fontSize: '16px',
              padding: '8px 14px',
              borderRadius: '18px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {t === 'sales' ? '人気順' : '割引順'}
          </button>
        ))}
      </nav>

      {/* ジャンル */}
      <nav style={{ display: 'flex', overflowX: 'auto', gap: '10px', padding: '10px', background: '#f8f8f8' }}>
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
            }}
          >
            {c.name}
          </button>
        ))}
      </nav>

      {/* ステータス */}
      {isLoading && <p style={{ textAlign: 'center', marginTop: '40px' }}>📡 読み込み中...</p>}
      {error && <p style={{ textAlign: 'center', color: 'red' }}>通信エラー</p>}

      {/* 一覧 */}
      <main style={{ padding: '20px' }}>
        {sortedItems.slice(0, visibleCount).map((item: Item, i: number) => (
          <ProductCard key={i} item={item} index={i} rankingType={rankingType} />
        ))}

        {visibleCount < sortedItems.length && (
          <button
            onClick={() => setVisibleCount(v => v + 10)}
            style={{
              display: 'block',
              margin: '20px auto',
              padding: '10px 20px',
              backgroundColor: '#E60012',
              color: '#fff',
              borderRadius: '12px',
              fontSize: '16px',
              border: 'none',
            }}
          >
            もっと見る
          </button>
        )}
      </main>
    </div>
  );
}
