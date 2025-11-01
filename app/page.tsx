'use client';
export const dynamic = 'force-dynamic';

import { useState, useMemo } from 'react';
import useSWR from 'swr';
import { fetchRakutenItems } from '../lib/rakuten';
import { motion, AnimatePresence } from 'framer-motion';
import { Noto_Sans_JP } from 'next/font/google';

const noto = Noto_Sans_JP({ subsets: ['latin'], weight: ['400', '700'] });

type Item = {
  Item: {
    itemName: string;
    itemPrice: number;
    itemUrl: string;
    largeImageUrls: { imageUrl: string }[];
    shopName: string;
  };
};

const GENRES = [
  { name: '家電', id: '555164' },
  { name: '食品', id: '100227' },
  { name: '健康食品', id: '551167' },
  { name: '飲料', id: '100316' },
  { name: '化粧品', id: '100939' },
] as const;

const SUB_GENRES = {
  家電: [
    { name: '総合ランキング', id: '555164' },
    { name: '健康家電', id: '100804' },
    { name: 'マッサージ器', id: '100806' },
  ],
  食品: [
    { name: '総合ランキング', id: '100227' },
    { name: '米・雑穀', id: '100316' },
    { name: '惣菜', id: '100227' },
  ],
  健康食品: [
    { name: '総合ランキング', id: '551167' },
    { name: 'サプリメント', id: '551169' },
  ],
  飲料: [
    { name: '総合ランキング', id: '100316' },
    { name: 'お茶', id: '100317' },
    { name: 'コーヒー', id: '100318' },
  ],
  化粧品: [
    { name: '総合ランキング', id: '100939' },
    { name: 'スキンケア', id: '100940' },
    { name: 'メイクアップ', id: '100941' },
  ],
} as const;

export default function HomePage() {
  const [selectedGenre, setSelectedGenre] =
    useState<(typeof GENRES)[number]['name']>('食品');
  const [selectedSubGenre, setSelectedSubGenre] = useState('総合ランキング');

  const currentGenreId = useMemo(() => {
    const list = SUB_GENRES[selectedGenre as keyof typeof SUB_GENRES] || [];
    return list.find((g) => g.name === selectedSubGenre)?.id ?? '555164';
  }, [selectedGenre, selectedSubGenre]);

  const { data, error, isLoading } = useSWR(
    ['ranking', currentGenreId],
    () => fetchRakutenItems(currentGenreId),
    {
      revalidateOnFocus: false,
      keepPreviousData: false,
    }
  );

  const items: Item[] = data?.Items || [];

  const getBadgeStyle = (index: number) => {
    switch (index) {
      case 0:
        return 'bg-gradient-to-br from-yellow-300 via-yellow-200 to-yellow-400 text-white border border-yellow-100';
      case 1:
        return 'bg-gradient-to-br from-gray-300 via-gray-200 to-gray-400 text-white border border-gray-100';
      case 2:
        return 'bg-gradient-to-br from-orange-400 via-orange-300 to-orange-500 text-white border border-orange-100';
      default:
        return 'bg-[#e74c3c] text-white';
    }
  };

  return (
    <main className={`${noto.className} bg-[#faf7f2] min-h-screen`}>
      {/* 固定ナビ */}
      <header className="sticky top-0 z-50 border-b border-[#eadfce]/70 backdrop-blur-md bg-[#faf7f2]/95 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 leading-relaxed">
            シニアらくらくモール
          </h1>

          {/* ジャンルスライドナビ */}
          <nav className="mt-3 flex overflow-x-auto no-scrollbar space-x-2 pb-1">
            {GENRES.map((g) => (
              <button
                key={g.name}
                onClick={() => {
                  setSelectedGenre(g.name);
                  setSelectedSubGenre('総合ランキング');
                }}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-base font-semibold transition-all ${
                  selectedGenre === g.name
                    ? 'bg-[#e74c3c] text-white shadow-sm scale-105'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {g.name}
              </button>
            ))}
          </nav>

          {/* サブジャンルスライド */}
          <nav className="mt-2 flex overflow-x-auto no-scrollbar space-x-2 pb-1">
            {SUB_GENRES[selectedGenre as keyof typeof SUB_GENRES].map((sg) => (
              <button
                key={sg.name}
                onClick={() => setSelectedSubGenre(sg.name)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  selectedSubGenre === sg.name
                    ? 'bg-[#e74c3c] text-white'
                    : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                }`}
              >
                {sg.name}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* コンテンツ */}
      <section className="max-w-5xl mx-auto px-4 py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentGenreId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-5"
          >
            {isLoading ? (
              <p className="text-center text-gray-500 py-10 text-lg">
                読み込み中です...
              </p>
            ) : (
              items.map((item, index) => {
                const info = item.Item;
                const imageUrl =
                  info.largeImageUrls?.[0]?.imageUrl.replace(
                    '?ex=300x300',
                    ''
                  ) || '';

                return (
                  <a
                    key={index}
                    href={info.itemUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-white rounded-2xl shadow-md hover:shadow-lg transition p-4 text-center relative"
                  >
                    {/* 順位バッジ */}
                    <div
                      className={`absolute top-0 left-0 px-3 py-1 text-base font-bold rounded-br-lg border ${getBadgeStyle(
                        index
                      )}`}
                    >
                      {index + 1}位
                    </div>

                    <div className="bg-gray-100 rounded-lg flex items-center justify-center mb-3 overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={info.itemName}
                        className="w-full h-52 object-contain transition-opacity duration-300"
                        loading="lazy"
                      />
                    </div>

                    <p className="text-lg font-semibold text-gray-800 leading-snug mb-2 line-clamp-2">
                      {info.itemName}
                    </p>
                    <p className="text-[#e74c3c] font-bold text-xl mt-1">
                      ¥{info.itemPrice.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      {info.shopName}
                    </p>
                  </a>
                );
              })
            )}
          </motion.div>
        </AnimatePresence>
      </section>
    </main>
  );
}
