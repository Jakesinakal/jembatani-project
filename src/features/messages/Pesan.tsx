/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, MessageSquare, Check } from 'lucide-react';
import { mockChats } from '@/data/mockData';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';

export default function Pesan() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab ] = useState<'Semua' | 'Negosiasi' | 'Pesanan'>('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter conversations
  const filteredConversations = mockChats.filter((chat) => {
    // 1. Tab category filter
    if (activeTab === 'Negosiasi' && !chat.hasActiveNegotiation) return false;
    // (mocking 'Pesanan' as done transactions where hasActiveNegotiation is false but there was chat history)
    if (activeTab === 'Pesanan' && chat.id !== 'chat_2') return false;

    // 2. Query search
    if (searchQuery) {
      return chat.partnerName.toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  return (
    <div className="flex-1 pb-24 bg-surface text-on-surface">
      {/* Header Panel */}
      <div className="px-5 pt-6 pb-2">
        <h1 className="font-fraunces text-headline-lg font-bold text-primary mb-1">Pesan</h1>
        <p className="font-jakarta text-body-sm text-on-surface-variant font-medium">Bahas harga, transaksi, serta logistik kiriman di sini.</p>
      </div>

      {/* Structured Search input bar */}
      <div className="px-5 mt-4">
        <div className="relative flex items-center">
          <span className="absolute left-3 text-on-surface-variant">
            <Search strokeWidth={1.5} className="w-5 h-5" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama petani atau pembeli..."
            className="w-full pl-10 pr-4 py-2.5 bg-surface-container-lowest border border-outline-variant rounded outline-none text-body-sm font-jakarta focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Tab Strip selector: Semua | Negosiasi | Pesanan | Umum */}
      <div className="px-5 mt-4 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {(['Semua', 'Negosiasi', 'Pesanan'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-label-md font-bold font-jakarta rounded-full transition-all whitespace-nowrap shrink-0 ${
              activeTab === tab
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container-low text-on-surface-variant'
            }`}
          >
            {tab === 'Semua' ? '💬 Semua Chat' : tab === 'Negosiasi' ? '🤝 Negosiasi Aktif' : '📦 Transaksi / Pesanan'}
          </button>
        ))}
      </div>

      {/* Vertical List of Chat items (6 chats) */}
      <div id="messages-list-stack" className="px-5 mt-6 space-y-3">
        {filteredConversations.length === 0 ? (
          <div className="text-center py-12 p-6 bg-surface-container-low rounded-lg border border-outline-variant/40">
            <MessageSquare className="w-10 h-10 mx-auto text-on-surface-variant/40 mb-3" />
            <p className="font-jakarta text-body-md text-on-surface-variant font-medium">Belum ada chat kategori ini.</p>
          </div>
        ) : (
          filteredConversations.map((chat) => (
            <div
              key={chat.id}
              onClick={() => navigate(`/pesan/${chat.id}`)}
              className="bg-surface-container-lowest rounded-lg border border-outline-variant p-4 flex items-center justify-between cursor-pointer hover:bg-surface-container-low/40 active:scale-[0.99] transition-all"
            >
              <div className="flex items-center gap-3.5 flex-1 min-w-0">
                <Avatar
                  src={chat.partnerAvatar}
                  name={chat.partnerName}
                  size="lg"
                  isVerified={chat.partnerVerified}
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="font-jakarta font-bold text-body-sm text-on-surface">{chat.partnerName}</span>
                    {chat.partnerVerified && <span className="bg-primary text-on-primary rounded-full p-0.5 text-[6px] shrink-0"><Check className="w-2 h-2" /></span>}
                  </div>
                  <p className="font-jakarta text-body-sm text-on-surface-variant truncate pr-2">
                    {chat.lastMessage}
                  </p>
                </div>
              </div>

              <div className="text-right flex flex-col items-end gap-1.5 shrink-0 ml-2">
                <span className="text-body-sm text-on-surface-variant font-jakarta">{chat.lastMessageTimestamp}</span>
                
                {/* Visual indicators */}
                {chat.hasActiveNegotiation ? (
                  <span className="bg-tertiary-fixed text-on-tertiary-fixed-variant text-body-sm font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider font-jakarta">
                    NEGOSIASI
                  </span>
                ) : chat.unreadCount > 0 ? (
                  <span className="w-5 h-5 bg-secondary text-on-secondary rounded-full flex items-center justify-center font-jakarta text-body-sm font-bold">
                    {chat.unreadCount}
                  </span>
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
