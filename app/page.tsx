'use client';
export const dynamic = "force-dynamic";

import { useState } from 'react';
import useSWR from 'swr';
import { fetchRakutenItems } from '@/lib/rakuten';

export default function Home() {
  const mainCategories = ['家電', '食品', '健康食品', '飲料', '化粧品'];

  const subCategories: Record<string, { name: string; genreId: string }[]> = {
    '家電': [
      { name: '総合ランキング', genreId: '0' },
      { name: '健康家電', genreId: '211742' },
      { name: 'マッサージ器', genreId: '100316' },
    ],
    '食品': [
      { name: '総合ランキング', genreId: '0' },
      { name: 'サプリ', genreId: '551167' },
      { name: '飲料', genreId: '100316' },
    ],
    '健康食品': [
      { name: 'サプリメント', genreId: '551167' },
      { name: '栄養ドリンク', genreId: '100671' },
      { name: 'グルコサミン', genreId: '551170' },
    ],
    '飲料': [
      { name: 'ドリンク総合', genreId: '100316' },
      { name: 'お茶', genreId: '100317' },
      { name: '水', genreId: '100319' },
    ],
    '化粧品': [
      { name: '美容総合', genreId: '100939' },
      { name: '育毛剤', genreId: '100939' },
      { name: 'スキンケア', genreId: '100939' },
    ],
  };

  const [selectedMain, setSelectedMain] = useState('家電');
  const [selectedSub, setSelectedSub] = useState(subCategories['家電'][0]);

  const { data, error, isLoading } = useSWR(
    selectedSub ? ['rakuten', selectedSub.genreId] : null,
    () => fetchRakutenItems(selectedSub.genreId)
  );

  return (
    <div
      style={{
        fontFamily: 'Hiragino Kaku Gothic ProN, Meiryo, sans-serif',
        backgroundColor: '#f9f9f9',
        color: '#222',
        minHeight: '100vh',
      }}
    >
      {/* ヘッダー */}
      <header
        style={{
          backgroundColor: '#fff',
          padding: '16px 0',
          borderBottom: '2px solid #E60012',
          textAlign: 'center',
          fontSize: '26px',
          fontWeight: 'bold',
          boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
        }}
      >
        シニアらくらくモール
      </header>

      {/* 上段：大ジャンル */}
      <nav
        style={{
          display: 'flex',
          overflowX: 'auto',
          gap: '8px',
          padding: '12px 10px',
          background: '#fff',
          borderBottom: '1px solid #ddd',
        }}
      >
        {mainCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedMain(cat);
              setSelectedSub(subCategories[cat][0]);
            }}
            style={{
              flexShrink: 0,
              backgroundColor: selectedMain === cat ? '#E60012' : '#ccc',
              color: '#fff',
              fontSize: '17px',
              padding: '10px 16px',
              borderRadius: '22px',
              border: 'none',
              fontWeight: 'bold',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {cat}
          </button>
        ))}
      </nav>

      {/* 下段：小ジャンル */}
      <nav
        style={{
          display: 'flex',
          overflowX: 'auto',
          gap: '10px',
          padding: '10px',
          background: '#fafafa',
          borderBottom: '1px solid #ddd',
        }}
      >
        {subCategories[selectedMain].map((sub) => (
          <button
            key={sub.name}
            onClick={() => setSelectedSub(sub)}
            style={{
              flexShrink: 0,
              backgroundColor:
                selectedSub.name === sub.name ? '#E60012' : '#bbb',
              color: '#fff',
              fontSize: '16px',
              padding: '8px 14px',
              borderRadius: '20px',
              border: 'none',
              whiteSpace: 'nowrap',
              fontWeight: 600,
            }}
          >
            {sub.name}
          </button>
        ))}
      </nav>

      {/* 商品リスト */}
      <main style={{ padding: '20px', textAlign: 'center' }}>
        <p style={{ fontSize: '18px' }}>
          📦 {selectedMain} ＞ {selectedSub.name}
        </p>

        {isLoading && <p>読み込み中...</p>}
        {error && <p>データ取得に失敗しました。</p>}
        {data && data.Items && data.Items.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '16px',
              marginTop: '20px',
            }}
          >
            {data.Items.map((i: any) => (
              <a
                key={i.Item.itemCode}
                href={i.Item.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block',
                  background: '#fff',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                  padding: '10px',
                  textDecoration: 'none',
                  color: '#222',
                }}
              >
                <img
                  src={i.Item.mediumImageUrls[0].imageUrl}
                  alt={i.Item.itemName}
                  width={160}
                  height={160}
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '6px',
                    objectFit: 'cover',
                  }}
                />
                <h3
                  style={{
                    fontSize: '14px',
                    marginTop: '8px',
                    height: '3em',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {i.Item.itemName}
                </h3>
                <p style={{ color: '#E60012', fontWeight: 'bold' }}>
                  ¥{i.Item.itemPrice.toLocaleString()}
                </p>
              </a>
            ))}
          </div>
        ) : (
          !isLoading && <p>※データが見つかりません</p>
        )}
      </main>
    </div>
  );
}
