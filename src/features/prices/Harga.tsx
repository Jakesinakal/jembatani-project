/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { mockCommodities } from '@/data/mockData';
import { formatRupiah } from '@/lib/utils';
import { CommodityPriceInfo, CommodityCategory } from '@/types/commodity';

type TickerGroup = 'SAYURAN' | 'BUAH' | 'KOMODITAS';
const TICKER_GROUPS: TickerGroup[] = ['SAYURAN', 'BUAH', 'KOMODITAS'];
const TICKER_GROUP_LABELS: Record<TickerGroup, string> = {
  SAYURAN: '🥦 Sayuran',
  BUAH: '🍋 Buah',
  KOMODITAS: '🌾 Komoditas',
};
const KOMODITAS_CATEGORIES: CommodityCategory[] = ['PADI', 'REMPAH', 'PERKEBUNAN'];
const TICKER_INTERVAL = 5000;

function CategoryTicker({ commodities }: { key?: string; commodities: CommodityPriceInfo[] }) {
  return (
    <div className="divide-y divide-outline-variant/40">
      {/* Table header */}
      <div className="flex items-center px-3 py-1.5">
        <span className="flex-1 font-jakarta text-body-sm font-bold text-on-surface-variant uppercase tracking-wider">
          Komoditas
        </span>
        <span className="w-28 text-right font-jakarta text-body-sm font-bold text-on-surface-variant uppercase tracking-wider">
          Harga
        </span>
        <span className="w-16 text-right font-jakarta text-body-sm font-bold text-on-surface-variant uppercase tracking-wider">
          Delta
        </span>
      </div>
      {/* Table rows */}
      {commodities.map((item) => (
        <div key={item.id} className="flex items-center px-3 py-2">
          <span className="flex-1 font-jakarta text-body-md font-semibold text-on-surface">
            {item.name}
          </span>
          <span className="w-28 text-right font-fraunces text-body-md font-bold text-on-surface tabular-nums">
            {formatRupiah(item.priceToday)}
          </span>
          <span
            className={`w-16 text-right font-jakarta text-label-md font-bold ${
              item.isUp ? 'text-on-tertiary-container' : 'text-secondary'
            }`}
          >
            {item.isUp ? '▲' : '▼'} {item.deltaPercent}%
          </span>
        </div>
      ))}
    </div>
  );
}

export default function Harga() {
  const navigate = useNavigate();
  const [selectedRegion, setSelectedRegion] = useState('Jawa Barat');
  const [activeCategory, setActiveCategory] = useState<'SEMUA' | CommodityCategory>('SEMUA');
  const [tickerCategoryIndex, setTickerCategoryIndex] = useState(0);

  const currentTickerGroup = TICKER_GROUPS[tickerCategoryIndex];
  const tickerCommodities = mockCommodities.filter((c) =>
    currentTickerGroup === 'KOMODITAS'
      ? KOMODITAS_CATEGORIES.includes(c.category)
      : c.category === currentTickerGroup,
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerCategoryIndex((prev) => (prev + 1) % TICKER_GROUPS.length);
    }, TICKER_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // Filtered list of commodities
  const filteredCommodities = mockCommodities.filter((item) => {
    if (activeCategory === 'SEMUA') return true;
    // Handle category match
    return item.category === activeCategory;
  });

  return (
    <div className="flex-1 pb-24 bg-surface text-on-surface">
      {/* Header Panel */}
      <div className="px-5 pt-6 pb-2">
        <h1 className="font-fraunces text-headline-lg font-bold text-primary mb-1">
          Harga Komoditas
        </h1>
        <p className="font-jakarta text-body-sm text-on-surface-variant font-medium">
          Berdasarkan pusat info pasar induk terdekat.
        </p>
      </div>

      {/* Region & Date Selector Bar */}
      <div className="px-5 mt-4 flex items-center justify-between gap-3">
        {/* Region selector pill */}
        <button
          onClick={() => {
            const nextRegion = selectedRegion === 'Jawa Barat' ? 'Jawa Tengah' : 'Jawa Barat';
            setSelectedRegion(nextRegion);
          }}
          className="px-4 py-2 bg-primary text-on-primary rounded-full text-label-md font-bold font-jakarta flex items-center gap-1 hover:bg-opacity-90 transition-all shadow-sm shrink-0"
        >
          📍 {selectedRegion}{' '}
          <span className="text-body-sm text-on-primary-container font-jakarta">▼</span>
        </button>

        {/* Date Row with arrows */}
        <div className="flex items-center gap-2 bg-surface-container-high px-3.5 py-1.5 rounded-full border border-outline-variant/60">
          <button className="text-on-surface-variant hover:text-primary active:scale-90 transition-all">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-label-md font-bold font-jakarta text-on-surface whitespace-nowrap">
            25 Mei 2026
          </span>
          <button className="text-on-surface-variant hover:text-primary active:scale-90 transition-all">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category Ticker */}
      <div className="mt-6 px-5">
        <div className="bg-surface-container-low rounded-lg border border-outline-variant/60 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-3 pt-2.5 pb-1">
            <span className="font-jakarta text-label-md font-bold text-on-surface uppercase tracking-wider">
              {TICKER_GROUP_LABELS[currentTickerGroup]}
            </span>
            <div className="flex gap-1.5">
              {TICKER_GROUPS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setTickerCategoryIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === tickerCategoryIndex ? 'w-5 bg-primary' : 'w-1.5 bg-outline-variant'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Fixed-height table area */}
          <div className="px-3 pb-2.5 h-52 overflow-hidden">
            <CategoryTicker key={currentTickerGroup} commodities={tickerCommodities} />
          </div>
        </div>
      </div>

      {/* Commodity Category Chip Slider */}
      <div className="px-5 mt-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-label-md font-bold text-on-surface font-jakarta uppercase tracking-wider">
            Komoditas Regional
          </span>
          <span className="text-body-sm font-semibold text-on-surface-variant px-2 py-0.5 bg-surface-container rounded flex items-center gap-1">
            <Info className="w-3 h-3 text-secondary" /> Satuan per Kg
          </span>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setActiveCategory('SEMUA')}
            className={`px-4 py-2 text-label-md font-bold font-jakarta rounded-full transition-all whitespace-nowrap shrink-0 ${
              activeCategory === 'SEMUA'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            Semua
          </button>

          {(['SAYURAN', 'BUAH', 'PADI', 'REMPAH', 'PERKEBUNAN'] as CommodityCategory[]).map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-label-md font-bold font-jakarta rounded-full transition-all whitespace-nowrap shrink-0 uppercase tracking-wide ${
                  activeCategory === cat
                    ? 'bg-primary-fixed text-on-primary-fixed-variant shadow-sm border border-primary/20'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                }`}
              >
                {cat === 'PADI'
                  ? '🌾 Padi-padian'
                  : cat === 'SAYURAN'
                    ? '🥦 Sayuran'
                    : cat === 'BUAH'
                      ? '🍋 Buah'
                      : cat === 'REMPAH'
                        ? '🌶️ Rempah'
                        : '☕ Kopi/Kebun'}
              </button>
            ),
          )}
        </div>
      </div>

      {/* 2-Column Commodity Price List Grid */}
      <div id="commodity-grid-stack" className="px-5 mt-4 grid grid-cols-2 gap-3.5">
        {filteredCommodities.map((item) => (
          <div
            key={item.id}
            id={`commodity-cell-${item.id}`}
            onClick={() => navigate(`/harga/${item.id}`)}
            className="bg-surface-container-lowest rounded-lg border border-outline-variant p-3 flex flex-col justify-between cursor-pointer hover:border-primary transition-all shadow-[0_2px_12px_rgba(0,0,0,0.015)] relative overflow-hidden group"
          >
            <div className="flex items-start gap-2 mb-2">
              <img
                src={item.photo}
                alt={item.name}
                className="w-12 h-12 rounded object-cover border border-outline-variant/40"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-fraunces font-bold text-body-sm text-primary leading-tight line-clamp-2 truncate group-hover:text-secondary transition-colors">
                  {item.name}
                </h4>
                <span className="text-body-sm font-jakarta font-bold text-on-surface-variant uppercase tracking-wider block mt-0.5">
                  {item.category}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-outline-variant/40 flex items-end justify-between">
              <div>
                <span className="text-body-sm font-bold text-secondary font-fraunces tabular-nums">
                  {formatRupiah(item.priceToday)}
                </span>
                <span className="text-body-sm text-on-surface-variant font-jakarta block font-medium">
                  /{item.unit.replace('/', '')}
                </span>
              </div>

              <span
                className={`text-body-sm font-bold px-1.5 py-0.5 rounded ${
                  item.isUp
                    ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant'
                    : 'bg-error-container text-on-error-container'
                }`}
              >
                {item.isUp ? '↑' : '↓'} {item.deltaPercent}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
