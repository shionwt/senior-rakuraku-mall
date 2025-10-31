'use client';
import { useState } from 'react';

export default function Home() {
  const mainCategories = ['家電', '食品', '健康食品', '飲料', '化粧品'];

  const subCategories: Record<string, string[]> = {
    '家電': ['健康家電', 'ラジオ', 'マッサージ器'],
    '食品': ['冷凍弁当', '惣菜セット', '完全食'],
    '健康食品': ['サプリ', '栄養ドリンク', 'グルコサミン'],
    '飲料': ['お茶', '水', 'ジュース'],
    '化粧品': ['育毛剤', 'シミケア', 'シワ対策'],
  };

  const [selectedMain, setSelectedMain] = useState('家電');
  const [selectedSub, setSelectedSub] = useState('健康家電');

  return (
    <div
      style={{
        fontFamily: 'Hiragino Kaku Gothic ProN, Meiryo, sans-serif',
        backgroundColor: '#f9f9f9',
        color: '#222',
        minHeight: '100vh',
      }}
    >
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
              transition: 'transform 0.2s ease',
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
            key={sub}
            onClick={() => setSelectedSub(sub)}
            style={{
              flexShrink: 0,
              backgroundColor: selectedSub === sub ? '#E60012' : '#bbb',
              color: '#fff',
              fontSize: '16px',
              padding: '8px 14px',
              borderRadius: '20px',
              border: 'none',
              whiteSpace: 'nowrap',
              fontWeight: 600,
            }}
          >
            {sub}
          </button>
        ))}
      </nav>

      {/* 仮の中身 */}
      <main style={{ padding: '20px', textAlign: 'center' }}>
        <p style={{ fontSize: '18px' }}>📦 {selectedMain} ＞ {selectedSub}</p>
        <p style={{ marginTop: '10px', color: '#555' }}>
          ※ここに {selectedSub} の商品リストが表示されます（モック）
        </p>
      </main>
    </div>
  );
}
