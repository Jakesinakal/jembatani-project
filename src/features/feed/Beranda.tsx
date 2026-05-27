/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Heart, MessageCircle, Share2, SlidersHorizontal } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { VerifiedBadge } from '@/components/ui/VerifiedBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatRupiah, formatRelativeTime } from '@/lib/utils';
import { mockCommodities } from '@/data/mockData';
import { Post } from '@/types/post';
import { UserRole } from '@/types/user';

export interface BerandaProps {
  posts: Post[];
  onLikePost: (postId: string) => void;
  currentRoleMode: UserRole;
}

export default function Beranda({ posts, onLikePost, currentRoleMode }: BerandaProps) {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<
    'Semua' | 'Penawaran' | 'Permintaan' | 'Dekat Saya'
  >('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [notifCount, setNotifCount] = useState(3);

  // Commodity ticker tape data
  const TICKER_IDS = ['cabai_merah', 'kentang', 'tomat', 'bawang_merah', 'beras', 'kopi_arabika'];
  const tickerItems = TICKER_IDS.map((id) => mockCommodities.find((c) => c.id === id)!).map(
    (c) => ({
      name: c.name,
      price: c.priceToday,
      percent: `${c.deltaPercent.toFixed(1)}%`,
      isUp: c.isUp,
      isFlat: c.deltaPercent === 0,
    }),
  );

  // Filtering posts based on chips + search query
  const filteredPosts = posts.filter((post) => {
    // 1. Chip filter
    if (activeFilter === 'Penawaran' && post.type !== 'PENAWARAN') return false;
    if (activeFilter === 'Permintaan' && post.type !== 'PERMINTAAN') return false;
    if (
      activeFilter === 'Dekat Saya' &&
      !post.location.includes('Garut') &&
      !post.location.includes('Bandung')
    )
      return false;

    // 2. Search search text
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        post.title.toLowerCase().includes(q) ||
        post.caption.toLowerCase().includes(q) ||
        post.author.name.toLowerCase().includes(q) ||
        post.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex-1 pb-24 bg-surface text-on-surface">
      {/* Sticky Top Header */}
      <div className="sticky top-0 bg-surface-container-highest/90 backdrop-blur-md z-30 border-b border-outline-variant/50">
        <div className="flex items-center justify-between px-5 py-4">
          <span className="font-fraunces text-headline-md font-bold text-primary tracking-tight">
            JembaTani
          </span>

          <div className="flex items-center gap-3">
            {/* Search toggler */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 hover:bg-surface-container-high rounded-full transition-colors relative"
            >
              <Search strokeWidth={1.5} className="w-6 h-6 text-on-surface-variant" />
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => {
                setNotifCount(0);
                alert('Notifikasi: Anda memiliki pesan negosiasi baru dari Pak Budi!');
              }}
              className="p-2 hover:bg-surface-container-high rounded-full transition-colors relative"
            >
              <Bell strokeWidth={1.5} className="w-6 h-6 text-on-surface-variant" />
              {notifCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-secondary rounded-full border border-surface-container-highest" />
              )}
            </button>
          </div>
        </div>

        {/* Floating search entry */}
        {showSearch && (
          <div className="px-5 pb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari cabai, kentang, beras, area Garut..."
              className="w-full px-4 py-2 bg-surface-container-low text-on-surface border border-outline-variant rounded outline-none text-body-sm font-jakarta focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
        )}

        {/* Commodity Price Ticker Strip (36px high) */}
        <div className="bg-primary border-t border-outline/30 select-none overflow-hidden h-[38px] flex items-center relative">
          <div className="inline-flex animate-[marquee_25s_linear_infinite] whitespace-nowrap gap-6 items-center px-4">
            {tickerItems.concat(tickerItems).map((item, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-2 text-label-md font-jakarta text-on-primary"
              >
                <span className="font-bold">{item.name}</span>
                <span className="font-fraunces font-medium text-body-sm text-on-primary tabular-nums tracking-tight">
                  {formatRupiah(item.price)}
                </span>
                <span
                  className={`inline-flex items-center gap-0.5 text-body-sm font-bold ${
                    item.isFlat
                      ? 'text-surface-container-highest'
                      : item.isUp
                        ? 'text-tertiary-fixed-dim'
                        : 'text-secondary-container'
                  }`}
                >
                  {item.isFlat ? '→' : item.isUp ? '↑' : '↓'} {item.percent}
                </span>
                <span className="text-on-primary/35 mx-1">|</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mode Personalization Banner */}
      <div className="px-5 mt-4">
        <div className="bg-primary-container/20 border border-primary-container/30 px-4 py-2.5 rounded-lg text-label-md font-jakarta flex items-center justify-between text-on-primary-fixed-variant">
          <span>
            Feeds ditargetkan khusus untuk{' '}
            <b className="font-bold underline">
              {currentRoleMode === 'PETANI' ? 'Kebutuhan Pembeli' : 'Penawaran Petani'}
            </b>
          </span>
          <span className="px-1.5 py-0.5 bg-primary/10 rounded font-bold text-body-sm text-on-primary uppercase">
            Mode {currentRoleMode}
          </span>
        </div>
      </div>

      {/* Filter Horizontal Chip Row */}
      {(() => {
        const filterChips: {
          value: typeof activeFilter;
          label: string;
          activeClass: string;
        }[] = [
          { value: 'Semua', label: 'Semua', activeClass: 'bg-primary text-on-primary' },
          {
            value: 'Penawaran',
            label: '🧺 Penawaran Petani',
            activeClass: 'bg-tertiary-fixed text-on-tertiary-fixed',
          },
          {
            value: 'Permintaan',
            label: '💼 Permintaan Pembeli',
            activeClass: 'bg-primary-fixed text-on-primary-fixed-variant',
          },
          {
            value: 'Dekat Saya',
            label: '📍 Dekat Saya',
            activeClass:
              'bg-surface-container-highest border border-outline-variant text-on-surface',
          },
        ];
        return (
          <div className="px-5 mt-4 flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {filterChips.map((chip) => (
              <button
                key={chip.value}
                onClick={() => setActiveFilter(chip.value)}
                className={`px-4.5 py-2 text-label-md font-bold font-jakarta rounded-full transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  activeFilter === chip.value
                    ? chip.activeClass
                    : 'bg-surface-container-low text-on-surface-variant'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        );
      })()}

      {/* Feed Listing Cards Container */}
      <div id="opportunity-feed-stack" className="px-5 mt-6 space-y-6">
        {filteredPosts.length === 0 ? (
          <EmptyState
            icon={SlidersHorizontal}
            message="Tidak ada hasil yang sesuai filter pencarian."
          />
        ) : (
          filteredPosts.map((post) => {
            const isPenawaran = post.type === 'PENAWARAN';
            return (
              <div
                key={post.id}
                id={`feed-post-${post.id}`}
                className="bg-surface-container-lowest rounded-lg border border-outline-variant/60 overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.02)] flex flex-col transition-all active:scale-[0.99]"
              >
                {/* Author Info row */}
                <div className="p-4 py-3 flex items-center justify-between border-b border-outline-variant/30">
                  <div className="flex items-center gap-2.5">
                    <Avatar
                      src={post.author.avatar}
                      name={post.author.name}
                      size="sm"
                      isVerified={post.author.isVerified}
                    />
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-jakarta font-bold text-label-md text-on-surface">
                          {post.author.name}
                        </span>
                        {post.author.isVerified && <VerifiedBadge size="sm" />}
                      </div>
                      <span className="text-body-sm text-on-surface-variant font-medium flex items-center gap-0.5">
                        📍 {post.author.location}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-body-sm font-jakarta text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">
                      {formatRelativeTime(post.hoursAgo)}
                    </span>
                  </div>
                </div>

                {/* Hero Photo Block (4:3 aspect ratio, 12px rounded design) */}
                <div className="relative aspect-[4/3] w-full bg-surface-container overflow-hidden">
                  <img
                    src={post.photoUrl}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                    referrerPolicy="no-referrer"
                  />

                  {/* Floating Badges */}
                  <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-2">
                    <Badge variant={isPenawaran ? 'penawaran' : 'permintaan'}>{post.type}</Badge>

                    {post.certifications.map((cert) => (
                      <Badge
                        key={cert}
                        variant="organic"
                        className="bg-surface-container-lowest/85 backdrop-blur-md"
                      >
                        {cert}
                      </Badge>
                    ))}
                  </div>

                  {/* Stock banner overlays */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-10 flex justify-between items-end">
                    <div className="text-inverse-on-surface">
                      <span className="text-body-sm text-inverse-on-surface/70 block uppercase font-bold tracking-wider mb-0.5">
                        {isPenawaran ? 'Persediaan' : 'Kapasitas Butuh'}
                      </span>
                      <span className="font-jakarta font-bold text-body-sm">
                        {isPenawaran ? post.stockAvailable : post.quantityNeeded}
                      </span>
                    </div>

                    <div className="text-right text-inverse-on-surface">
                      <span className="text-body-sm text-inverse-on-surface/70 block uppercase font-bold tracking-wider mb-0.5">
                        Siap Kirim / Panen
                      </span>
                      <span className="font-jakarta font-bold text-body-sm">
                        {post.harvestOrNeededDate}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Body Details Card Section (24px padding = p-6) */}
                <div className="p-6">
                  {/* Headline Title */}
                  <h3
                    onClick={() => {
                      // Navigate/interact with detail
                      alert(`Sajian Detail: ${post.title}`);
                    }}
                    className="font-fraunces text-body-lg font-bold text-primary leading-snug tracking-tight mb-2 hover:text-secondary cursor-pointer"
                  >
                    {post.title}
                  </h3>

                  {/* Caption */}
                  <p className="font-jakarta text-body-sm text-on-surface-variant mb-4 leading-relaxed line-clamp-2">
                    {post.caption}
                  </p>

                  <div className="border-t border-outline-variant/40 pt-4 flex items-center justify-between">
                    <div>
                      <span className="text-body-sm text-on-surface-variant font-bold uppercase tracking-wider block font-jakarta">
                        Harga Tertera
                      </span>
                      <span className="text-headline-md font-fraunces font-bold text-secondary tracking-tight tabular-nums">
                        {formatRupiah(post.price)}
                        <span className="font-jakarta text-body-sm font-semibold text-on-surface-variant">
                          /{post.unit}
                        </span>
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-body-sm text-on-surface-variant font-bold uppercase tracking-wider block font-jakarta">
                        Min. Order
                      </span>
                      <span className="font-jakarta text-label-md font-bold text-primary">
                        {isPenawaran
                          ? `Retail: ${post.minOrderRetail}`
                          : `Grosir: ${post.minOrderB2B}`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action bar */}
                <div className="p-4 py-3 bg-surface-container-low border-t border-outline-variant/40 flex items-center justify-between">
                  {/* Micro-interaction icons */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => onLikePost(post.id)}
                      className={`flex items-center gap-1.5 text-label-md font-semibold font-jakarta active:scale-90 transition-transform ${
                        post.isLiked ? 'text-secondary font-bold' : 'text-on-surface-variant'
                      }`}
                    >
                      <Heart
                        strokeWidth={1.5}
                        className={`w-5 h-5 ${post.isLiked ? 'fill-secondary text-secondary' : 'text-on-surface-variant'}`}
                      />
                      <span>{post.likesCount}</span>
                    </button>

                    <button
                      onClick={() => navigate('/pesan/chat_1')}
                      className="flex items-center gap-1.5 text-label-md font-semibold text-on-surface-variant font-jakarta hover:text-primary"
                    >
                      <MessageCircle strokeWidth={1.5} className="w-5 h-5" />
                      <span>{post.commentsCount}</span>
                    </button>

                    <button
                      onClick={() => alert('Link dibagikan ke WhatsApp!')}
                      className="text-on-surface-variant p-1 hover:text-primary active:scale-95 transition-transform"
                    >
                      <Share2 strokeWidth={1.5} className="w-4.5 h-4.5" />
                    </button>
                  </div>

                  {/* Transaction Action Button */}
                  <Button
                    id={`post-cta-${post.id}`}
                    variant={isPenawaran ? 'secondary' : 'primary'}
                    size="sm"
                    onClick={() => {
                      // Navigate to Pak Budi (chat_1) directly on CTA tap, or configure partner name
                      navigate('/pesan/chat_1');
                    }}
                    className="shadow-sm py-1.5 px-4 font-bold"
                  >
                    {isPenawaran ? 'Tawar' : 'Penuhi'}
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
