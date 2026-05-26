/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Share2, ArrowRight, ShieldCheck } from 'lucide-react';
import { mockCommodities } from '@/data/mockData';
import { formatRupiah } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export default function HargaDetail() {
  const { commodityId } = useParams<{ commodityId: string }>();
  const navigate = useNavigate();

  // Find the selected commodity
  const item = mockCommodities.find((c) => c.id === commodityId) || mockCommodities[0];

  // Draw 30-day line graph
  const renderLineChart = (history: typeof item.history30Days) => {
    const prices = history.map((h) => h.price);
    const max = Math.max(...prices);
    const min = Math.min(...prices);
    const range = max - min || 1;

    const width = 340;
    const height = 150;
    const padding = 20;

    // Scale coordinates
    const points = history.map((entry, idx) => {
      const x = padding + (idx / (history.length - 1)) * (width - padding * 2);
      const y = height - padding - ((entry.price - min) / range) * (height - padding * 2);
      return { x, y, entry };
    });

    const pathD = `M ${points.map((p) => `${p.x},${p.y}`).join(' L ')}`;

    return (
      <div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <span className="text-label-md font-bold font-jakarta text-on-surface uppercase tracking-wider">
            Tren Bulanan (30 Hari Terakhir)
          </span>
          <span className="text-body-sm font-bold text-secondary bg-secondary-fixed px-2 py-0.5 rounded">
            Rerata: {formatRupiah(Math.round(prices.reduce((a, b) => a + b, 0) / prices.length))}
          </span>
        </div>

        <div className="relative">
          <svg
            width="100%"
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            className="overflow-visible font-jakarta"
          >
            {/* Horizontal Grid lines */}
            <line
              x1={padding}
              y1={padding}
              x2={width - padding}
              y2={padding}
              stroke="var(--color-surface-container-high)"
              strokeDasharray="3"
            />
            <line
              x1={padding}
              y1={height / 2}
              x2={width - padding}
              y2={height / 2}
              stroke="var(--color-surface-container-high)"
              strokeDasharray="3"
            />
            <line
              x1={padding}
              y1={height - padding}
              x2={width - padding}
              y2={height - padding}
              stroke="var(--color-surface-container-high)"
              strokeDasharray="3"
            />

            {/* Sparkline gradient fill */}
            <path
              d={`${pathD} L ${points[points.length - 1].x},${height - padding} L ${points[0].x},${height - padding} Z`}
              fill="url(#chart-gradient)"
              opacity="0.1"
            />

            {/* Real Line */}
            <path
              d={pathD}
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth={2.5}
              strokeLinecap="round"
            />

            {/* Price node circles */}
            {points.map((p, idx) => (
              <g key={idx} className="group cursor-pointer">
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={4}
                  fill={idx === points.length - 1 ? '#b22a16' : '#082717'}
                  stroke="var(--color-on-primary)"
                  strokeWidth={1.5}
                />

                {/* Node value flag on click or hover */}
                <text
                  x={p.x}
                  y={p.y - 8}
                  textAnchor="middle"
                  className="text-[9px] font-bold fill-primary font-jakarta text-center hidden group-hover:block"
                >
                  {p.entry.price / 1000}k
                </text>
              </g>
            ))}

            {/* X Axis Labels */}
            {points.map((p, idx) => {
              if (idx % 2 !== 0 && idx !== points.length - 1) return null; // reduce clutter
              return (
                <text
                  key={idx}
                  x={p.x}
                  y={height - 2}
                  textAnchor="middle"
                  className="text-[9px] font-semibold fill-on-surface-variant font-jakarta"
                >
                  {p.entry.date}
                </text>
              );
            })}

            {/* Y Axis upper/lower bounds */}
            <text
              x={padding - 15}
              y={padding + 4}
              className="text-[8px] font-bold fill-on-surface-variant font-jakarta"
            >
              {Math.round(max / 1000)}k
            </text>
            <text
              x={padding - 15}
              y={height - padding + 2}
              className="text-[8px] font-bold fill-on-surface-variant font-jakarta"
            >
              {Math.round(min / 1000)}k
            </text>

            <defs>
              <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary)" />
                <stop offset="100%" stopColor="var(--color-surface)" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    );
  };

  const marketComparisons = [
    { market: 'Pasar Induk Caringin, Bandung', price: item.priceToday - 300, term: 'Borongan' },
    { market: 'Pasar Induk Kramat Jati, Jakarta', price: item.priceToday + 1200, term: 'Borongan' },
    { market: 'Pasar Kemiri, Depok', price: item.priceToday + 2400, term: 'Eceran' },
    { market: 'Pasar Induk Johar, Karawang', price: item.priceToday + 400, term: 'Borongan' },
  ];

  return (
    <div className="flex-1 pb-24 bg-surface text-on-surface">
      {/* Top Header Row */}
      <div className="sticky top-0 bg-surface/90 backdrop-blur-md z-30 px-5 py-4 flex items-center justify-between border-b border-outline-variant/50">
        <button
          onClick={() => navigate('/harga')}
          className="p-1.5 hover:bg-surface-container rounded-full text-primary active:scale-95 transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="font-fraunces text-body-lg font-bold text-primary">Detail Tren Harga</span>
        <button
          onClick={() => alert('Link tren dibagikan ke WhatsApp!')}
          className="p-2 hover:bg-surface-container rounded-full text-on-surface-variant transition-colors"
        >
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      {/* Hero card information panel */}
      <div className="px-5 mt-6">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden flex flex-col p-5 shadow-sm">
          <div className="flex gap-4">
            <img
              src={item.photo}
              alt={item.name}
              className="w-24 h-24 rounded-lg object-cover bg-surface-container border border-outline-variant/30"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 flex flex-col justify-between py-1">
              <div>
                <span className="px-2.5 py-0.5 bg-primary-fixed text-on-primary-fixed-variant text-body-sm font-bold rounded-full uppercase font-jakarta">
                  Kategori {item.category}
                </span>
                <h2 className="font-fraunces text-headline-md font-bold text-primary leading-tight mt-1.5">
                  {item.name}
                </h2>
              </div>

              <div className="flex items-baseline gap-1 mt-1">
                <span className="font-fraunces text-headline-md font-bold text-secondary tabular-nums">
                  {formatRupiah(item.priceToday)}
                </span>
                <span className="text-body-sm text-on-surface-variant font-jakarta font-medium">
                  {item.unit}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-outline-variant/40 mt-4 pt-4 grid grid-cols-3 gap-2 text-center text-body-sm">
            <div className="border-r border-outline-variant/30">
              <span className="text-body-sm uppercase font-bold text-on-surface-variant font-jakarta">
                Delta Harian
              </span>
              <span
                className={`block font-bold mt-0.5 ${item.isUp ? 'text-on-tertiary-container' : 'text-secondary'}`}
              >
                {item.isUp ? '▲ +' : '▼ -'}
                {item.deltaPercent}%
              </span>
            </div>
            <div className="border-r border-outline-variant/30">
              <span className="text-body-sm uppercase font-bold text-on-surface-variant font-jakarta">
                Rerata Regional
              </span>
              <span className="block font-bold mt-0.5 text-primary">Jawa Barat</span>
            </div>
            <div>
              <span className="text-body-sm uppercase font-bold text-on-surface-variant font-jakarta">
                Validitas
              </span>
              <span className="block font-bold text-primary flex items-center justify-center gap-0.5 mt-0.5 text-body-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-primary fill-primary-fixed" /> Aktual
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Line Graph */}
      <div className="px-5 mt-6">{renderLineChart(item.history30Days)}</div>

      {/* Market Benchmarks section */}
      <div className="px-5 mt-6">
        <h3 className="font-fraunces text-body-lg font-bold text-primary mb-3">
          Banding Harga Pasar Induk
        </h3>
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden shadow-sm">
          {marketComparisons.map((comp, idx) => (
            <div
              key={idx}
              className={`p-4 flex items-center justify-between border-b border-outline-variant/40 last:border-b-0 ${
                idx % 2 === 0 ? 'bg-surface-container-low/40' : 'bg-surface-container-lowest'
              }`}
            >
              <div>
                <span className="font-jakarta font-bold text-body-sm text-on-surface block">
                  {comp.market}
                </span>
                <span className="px-1.5 py-0.5 bg-surface-container text-on-surface-variant text-body-sm font-bold rounded uppercase mt-1 inline-block">
                  {comp.term}
                </span>
              </div>

              <div className="text-right">
                <span className="font-fraunces font-bold text-body-md text-primary mr-1 tabular-nums">
                  {formatRupiah(comp.price)}
                </span>
                <span className="text-body-sm text-on-surface-variant font-medium">/kg</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Redirect CTA Button to Opportunity Feed */}
      <div className="px-5 mt-8">
        <div className="bg-primary/5 border border-primary/20 p-5 rounded-lg flex flex-col gap-4 text-center">
          <p className="font-jakarta text-body-sm text-on-surface leading-relaxed">
            Butuh komoditas <b className="font-bold">{item.name}</b> dengan harga bersaing langsung
            dari petani Garut?
          </p>
          <Button
            onClick={() => navigate('/beranda')}
            variant="primary"
            fullWidth
            className="flex items-center justify-center gap-1.5 font-bold"
          >
            Temukan Penjual Di Feed <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
