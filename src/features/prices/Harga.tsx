/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, TrendingUp, Search, SlidersHorizontal, Info } from 'lucide-react';
import { mockCommodities } from '@/data/mockData';
import { formatRupiah } from '@/lib/utils';
import { CommodityPriceInfo, CommodityCategory } from '@/types/commodity';

export default function Harga() {
  const navigate = useNavigate();
  const [selectedRegion, setSelectedRegion] = useState('Jawa Barat');
  const [activeCategory, setActiveCategory] = useState<'SEMUA' | CommodityCategory>('SEMUA');
  const [spotlightIndex, setSpotlightIndex] = useState(0);

  // Auto-rotating Spotlight timer every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setSpotlightIndex((prev) => (prev + 1) % 3); // rotate between first 3 items
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSpotlightSelect = (idx: number) => {
    setSpotlightIndex(idx);
  };

  const handlePrevSpotlight = () => {
    setSpotlightIndex((prev) => (prev - 1 + 3) % 3);
  };

  const handleNextSpotlight = () => {
    setSpotlightIndex((prev) => (prev + 1) % 3);
  };

  // Filtered list of commodities
  const filteredCommodities = mockCommodities.filter((item) => {
    if (activeCategory === 'SEMUA') return true;
    // Handle category match
    return item.category === activeCategory;
  });

  // Render static decorative SVG sparklines easily
  const renderSparkline = (points: number[], isUp: boolean) => {
    const max = Math.max(...points);
    const min = Math.min(...points);
    const range = max - min || 1;
    const width = 120;
    const height = 40;
    
    // Scale coordinates
    const coords = points.map((val, idx) => {
      const x = (idx / (points.length - 1)) * width;
      const y = height - ((val - min) / range) * height;
      return `${x},${y}`;
    });

    const pathD = `M ${coords.join(' L ')}`;

    return (
      <svg width={width} height={height} className="overflow-visible">
        <path
          d={pathD}
          fill="none"
          stroke={isUp ? '#f5be46' : '#b22a16'} // design colors
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  return (
    <div className="flex-1 pb-24 bg-surface text-on-surface">
      {/* Header Panel */}
      <div className="px-5 pt-6 pb-2">
        <h1 className="font-fraunces text-headline-lg font-bold text-primary mb-1">Harga Komoditas</h1>
        <p className="font-jakarta text-body-sm text-on-surface-variant font-medium">Berdasarkan pusat info pasar induk terdekat.</p>
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
          📍 {selectedRegion} <span className="text-body-sm text-on-primary-container font-jakarta">▼</span>
        </button>

        {/* Date Row with arrows */}
        <div className="flex items-center gap-2 bg-surface-container-high px-3.5 py-1.5 rounded-full border border-outline-variant/60">
          <button className="text-on-surface-variant hover:text-primary active:scale-90 transition-all">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-label-md font-bold font-jakarta text-on-surface whitespace-nowrap">25 Mei 2026</span>
          <button className="text-on-surface-variant hover:text-primary active:scale-90 transition-all">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Auto-rotating spotlight card carousels (First 3 item spotlighted) */}
      <div id="spotlight-carousel-container" className="px-5 mt-6 relative">
        <div className="absolute top-1/2 -left-2 -translate-y-1/2 z-10">
          <button
            onClick={handlePrevSpotlight}
            className="w-8 h-8 rounded-full bg-surface-container-lowest border border-outline-variant/70 shadow flex items-center justify-center text-primary active:scale-90"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
        <div className="absolute top-1/2 -right-2 -translate-y-1/2 z-10">
          <button
            onClick={handleNextSpotlight}
            className="w-8 h-8 rounded-full bg-surface-container-lowest border border-outline-variant/70 shadow flex items-center justify-center text-primary active:scale-90"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {mockCommodities.slice(0, 3).map((item, index) => {
          if (index !== spotlightIndex) return null;
          return (
            <div
              key={item.id}
              onClick={() => navigate(`/harga/${item.id}`)}
              className="bg-surface-container-lowest rounded-lg border border-outline p-5 flex gap-4 cursor-pointer hover:border-secondary transition-all shadow-[0_4px_24px_rgba(0,0,0,0.03)]"
            >
              {/* Left 40% photo */}
              <div className="w-[40%] aspect-square bg-surface-container rounded-lg overflow-hidden relative">
                <img
                  src={item.photo}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute top-2 left-2 bg-secondary-container text-on-secondary-container text-body-sm font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-jakarta">
                  SOROTAN
                </span>
              </div>

              {/* Right 60% text content */}
              <div className="w-[60%] flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-body-sm uppercase font-bold text-on-surface-variant font-jakarta">{item.category}</span>
                  </div>
                  <h3 className="font-fraunces text-headline-md font-bold text-primary leading-tight line-clamp-1">
                    {item.name}
                  </h3>
                </div>

                <div className="my-1.5">
                  <span className="text-body-sm font-bold text-on-surface-variant block uppercase font-jakarta">Rerata Regional</span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-fraunces text-headline-md font-bold text-secondary tabular-nums leading-none">
                      {formatRupiah(item.priceToday)}
                    </span>
                    <span className="text-body-sm font-semibold text-on-surface-variant">{item.unit}</span>
                  </div>
                  
                  <div className="flex items-center gap-1.5 mt-1">
                    <span
                      className={`inline-flex items-center gap-0.5 text-label-md font-bold ${
                        item.isUp ? 'text-on-tertiary-container' : 'text-secondary'
                      }`}
                    >
                      {item.isUp ? '▲' : '▼'} {item.deltaPercent}%
                    </span>
                    <span className="text-body-sm text-on-surface-variant font-medium">Banding kemarin</span>
                  </div>
                </div>

                {/* Sparkline decoration area */}
                <div className="flex items-end justify-between border-t border-outline-variant/30 pt-2.5">
                  <span className="text-body-sm text-on-surface-variant font-bold uppercase tracking-wider font-jakarta">Tren 7 Hari</span>
                  {renderSparkline(item.sparkline, item.isUp)}
                </div>
              </div>
            </div>
          );
        })}

        {/* Dots indices indicator */}
        <div className="flex gap-2.5 mt-4 justify-center">
          {[0, 1, 2].map((idx) => (
            <button
              key={idx}
              onClick={() => handleSpotlightSelect(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === spotlightIndex ? 'w-6 bg-primary' : 'w-2 bg-outline-variant'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Commodity Category Chip Slider */}
      <div className="px-5 mt-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-label-md font-bold text-on-surface font-jakarta uppercase tracking-wider">Komoditas Regional</span>
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

          {(['SAYURAN', 'BUAH', 'PADI', 'REMPAH', 'PERKEBUNAN'] as CommodityCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-label-md font-bold font-jakarta rounded-full transition-all whitespace-nowrap shrink-0 uppercase tracking-wide ${
                activeCategory === cat
                  ? 'bg-primary-fixed text-on-primary-fixed-variant shadow-sm border border-primary/20'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {cat === 'PADI' ? '🌾 Padi-padian' : cat === 'SAYURAN' ? '🥦 Sayuran' : cat === 'BUAH' ? '🍋 Buah' : cat === 'REMPAH' ? '🌶️ Rempah' : '☕ Kopi/Kebun'}
            </button>
          ))}
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
                <span className="text-body-sm text-on-surface-variant font-jakarta block font-medium">/{item.unit.replace('/', '')}</span>
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
