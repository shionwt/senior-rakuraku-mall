'use client';
export const dynamic = "force-dynamic";

import { useState } from 'react';
import useSWR from 'swr';
import { fetchRakutenItems } from '../lib/rakuten';

type Item = {
  Item: {
    itemName: string;
    itemPrice: number;
    itemUrl: string;
    mediumImageUrls: { imageUrl: string }[];
    shopName: string;
    rank: number;
  };
};

const genres = [
  { name: '家電', id: '555164' },
  { name: '食品', id: '100227' },
  { name: '健康食品', id: '551167' },
  { name: '飲料', id: '100316' },
  { name: '化粧品', id: '100939' },
];

const subGenres = {
  '家電': [
    { name: '総合ランキング', id: '555164' },
    { name: '健康家電', id: '100804' },
    { name: 'マッサージ器', id: '100806' },
  ],
  '食品': [
    { name: '総合ランキング', id: '100227' },
    { name: '米・雑穀', id: '100316' },
    { name: '惣菜', id: '100227' },
  ],
  '健康食品': [
    { name: '総合ランキング', id: '551167' },
    { name: 'サプリメント', id: '551169' },
  ],
  '飲料': [
    { name: '総合ランキング', id: '100316' },
    { name: 'お茶', id: '100317' },
    { name: 'コーヒー', id: '100318' },
  ],
  '化粧品': [
    { name: '総合ランキング', id: '100939' },
    { name: 'スキンケア', id: '100940' },
    { name: 'メイクアップ', id: '100941' },
  ],
};

export default function HomePage() {
  const [selectedGenre, setSelectedGenre] = useState('家電');
  const [selectedSubGenre, setSelectedSubGenre] = useState('総合ランキング');

  const currentGenreId =
    subGenres[selectedGenre].find((g) => g.name === selectedSubGenre)?.id || '555164';

  const { data, error, isLoading } = useSWR(
    ['ranking', currentGenreId],
    () => fetchRakutenItems(currentGenreId),
    { revalidateOnFocus: false, keepPreviousData: true }
  );

  if (error) return <p className="text-center mt-10">データ取得に失敗しました。</p>;
  if (isLoading) return <p className="text-center mt-10">読み込み中...</p>;

  const items: Item[] = data?.Items || [];

  return (
    <main className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">シニアらくらくモール</h1>

      {/* カテゴリ選択 */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {genres.map((g) => (
          <button
            key={g.name}
            onClick={() => {
              setSelectedGenre(g.name);
              setSelectedSubGenre('総合ランキング');
            }}
            className={`px-4 py-2 rounded-full text-lg font-semibold ${
              selectedGenre === g.name
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {g.name}
          </button>
        ))}
      </div>

      {/* サブカテゴリ */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {subGenres[selectedGenre].map((sg) => (
          <button
            key={sg.name}
            onClick={() => setSelectedSubGenre(sg.name)}
            className={`px-4 py-2 rounded-full text-md font-semibold ${
              selectedSubGenre === sg.name
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 border border-gray-300'
            }`}
          >
            {sg.name}
          </button>
        ))}
      </div>

      {/* ランキング表示 */}
      <h2 className="text-xl font-semibold mb-4 text-center">
        📦 {selectedGenre} ＞ {selectedSubGenre}
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {items.map((item, index) => {
          const info = item.Item;
          return (
            <a
              key={index}
              href={info.itemUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white rounded-2xl shadow hover:shadow-lg transition p-3 text-center"
            >
              {/* 順位バッジ */}
              <div className="relative mb-2">
                <div className="absolute top-0 left-0 bg-red-600 text-white font-bold px-2 py-1 rounded-br-lg">
                  {index + 1}位
                </div>
                <img
                  src={info.mediumImageUrls?.[0]?.imageUrl.replace('?ex=128x128', '')}
                  alt={info.itemName}
                  className="mx-auto rounded-lg w-full h-40 object-contain"
                />
              </div>
              <p className="text-sm font-semibold line-clamp-2 min-h-[3em]">{info.itemName}</p>
              <p className="text-red-600 font-bold text-lg mt-1">
                ¥{info.itemPrice.toLocaleString()}
              </p>
            </a>
          );
        })}
      </div>
    </main>
  );
}
