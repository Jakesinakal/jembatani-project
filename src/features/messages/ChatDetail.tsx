/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Phone,
  MoreVertical,
  Paperclip,
  Send,
  Camera,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { mockChats } from '@/data/mockData';
import { formatRupiah } from '@/lib/utils';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';

export default function ChatDetail() {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const timelineEndRef = useRef<HTMLDivElement>(null);

  // Locate the conversation index or default to Pak Budi (chat_1)
  const [chat, setChat] = useState(() => {
    const found = mockChats.find((c) => c.id === chatId);
    return found ? { ...found } : { ...mockChats[0] };
  });

  const [inputText, setInputText] = useState('');
  const [negotiationStatus, setNegotiationStatus] = useState<'PENDING' | 'ACCEPTED' | 'REJECTED'>(
    chat.negotiationInfo?.status || 'PENDING',
  );

  const quickReplies = [
    'Siap kirim besok',
    'Harga nego tipis',
    'Kirim foto barang baru',
    'Stok masih cukup',
  ];

  // Scroll to bottom of chat list
  useEffect(() => {
    timelineEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat.messages]);

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;
    const newMsg = {
      id: crypto.randomUUID(),
      sender: 'ME' as const,
      text: text,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setChat((prev) => ({
      ...prev,
      lastMessage: text,
      lastMessageTimestamp: 'Baru',
      messages: [...prev.messages, newMsg],
    }));
    setInputText('');

    // Simulate an automatic polite response after 1s
    setTimeout(() => {
      const partnerReplies: Record<string, string> = {
        'Siap kirim besok':
          'Terimakasih Bu Siti. Saya segera siapkan keranjang angkutannya siang ini.',
        'Harga nego tipis': 'Baik, silakan diajukan penawarannya di kotak tawar ya.',
        'Kirim foto barang baru':
          'Sebentar ya Bu, saya ambilkan foto cabai segar langsung dari kebun.',
        'Stok masih cukup': 'Siap, kita langsung proses timbangannya besok pagi.',
      };

      const responseText =
        partnerReplies[text] || 'Ok baik Bu Siti, segera saya infokan kembali kelanjutannya.';
      const responderMsg = {
        id: crypto.randomUUID(),
        sender: 'PARTNER' as const,
        text: responseText,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      };

      setChat((prev) => ({
        ...prev,
        lastMessage: responseText,
        messages: [...prev.messages, responderMsg],
      }));
    }, 1200);
  };

  const handleAcceptNegotiation = () => {
    setNegotiationStatus('ACCEPTED');
    alert('Nego Harga Disetujui! Pesanan resmi dibuat.');

    // Append transaction event message to timeline
    const systemMsg = {
      id: crypto.randomUUID(),
      sender: 'PARTNER' as const,
      text: `🤝 NEGOSIASI DISEPAKATI! Harga disetujui pada Rp 32.000/kg untuk 100 kg. Surat jalan pengiriman logistik sedang diproduksi.`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setChat((prev) => ({
      ...prev,
      hasActiveNegotiation: false,
      messages: [...prev.messages, systemMsg],
    }));
  };

  const handleTawarBalik = () => {
    const offer = prompt('Masukkan harga penawaran balik Anda (Rp per Kg):', '32500');
    if (!offer) return;
    const offerNum = parseInt(offer);
    if (isNaN(offerNum)) return;

    alert(`Penawaran balik dikirim sebesar ${formatRupiah(offerNum)}/kg!`);

    const myOfferMsg = {
      id: crypto.randomUUID(),
      sender: 'ME' as const,
      text: `Saya mengajukan penawaran balik seharga ${formatRupiah(offerNum)}/kg.`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setChat((prev) => ({
      ...prev,
      messages: [...prev.messages, myOfferMsg],
    }));
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-surface text-on-surface relative">
      {/* Stick Header row */}
      <div className="sticky top-0 bg-surface-container-highest/95 backdrop-blur-md z-30 px-5 py-4 flex items-center justify-between border-b border-outline-variant/60">
        <div className="flex items-center gap-3.5 flex-1 min-w-0">
          <button
            onClick={() => navigate('/pesan')}
            className="p-1.5 hover:bg-surface-container rounded-full text-primary active:scale-95 transition-all shrink-0"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <Avatar
            src={chat.partnerAvatar}
            name={chat.partnerName}
            size="md"
            isVerified={chat.partnerVerified}
          />

          <div className="min-w-0">
            <div className="flex items-center gap-0.5">
              <span className="font-jakarta font-bold text-body-sm text-on-surface leading-tight truncate">
                {chat.partnerName}
              </span>
              {chat.partnerVerified && (
                <span className="bg-primary text-on-primary rounded-full p-0.5 text-[5px] shrink-0">
                  <Check className="w-1.5 h-1.5" strokeWidth={1.5} />
                </span>
              )}
            </div>
            <span className="text-body-sm text-primary font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-surface-tint rounded-full inline-block animate-pulse" />{' '}
              Aktif Sekarang
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert(`Telepon WhatsApp ke ${chat.partnerName}...`)}
            className="p-2 hover:bg-surface-container rounded-full text-on-surface-variant active:scale-90"
          >
            <Phone strokeWidth={1.5} className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-surface-container rounded-full text-on-surface-variant">
            <MoreVertical strokeWidth={1.5} className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Pinned Negotiation Card Row */}
      {chat.hasActiveNegotiation && chat.negotiationInfo && negotiationStatus === 'PENDING' && (
        <div className="bg-tertiary-fixed/40 border-b border-outline-variant p-4 px-5 flex flex-col sm:flex-row justify-between gap-4 z-20">
          <div className="flex items-start gap-3">
            <img
              src={chat.negotiationInfo.productPhoto}
              alt={chat.negotiationInfo.productName}
              className="w-12 h-12 rounded object-cover border border-outline-variant"
              referrerPolicy="no-referrer"
            />
            <div>
              <span className="text-body-sm bg-tertiary-fixed text-on-tertiary-fixed-variant font-extrabold font-jakarta px-2 py-0.5 rounded uppercase tracking-wider block w-max mb-1">
                Aktivitas Tawar-Menawar
              </span>
              <h4 className="font-fraunces font-bold text-body-sm text-primary leading-tight">
                {chat.negotiationInfo.productName}
              </h4>
              <p className="font-jakarta text-body-sm text-on-surface-variant mt-0.5">
                Jumlah: <b className="font-bold">{chat.negotiationInfo.quantity}</b> · Ajuan
                Terakhir:{' '}
                <b className="font-bold text-secondary font-fraunces tabular-nums">
                  {formatRupiah(chat.negotiationInfo.lastPriceOffer)}
                </b>
                /kg
              </p>
            </div>
          </div>

          <div className="flex gap-2 items-center justify-end shrink-0">
            <button
              onClick={handleTawarBalik}
              className="px-3.5 py-1.5 border border-outline text-primary font-bold text-label-md bg-surface-container-lowest hover:bg-surface-container rounded-lg active:scale-95 transition-all"
            >
              Tawar Balik
            </button>
            <Button
              onClick={handleAcceptNegotiation}
              variant="primary"
              size="sm"
              className="py-1.5 px-4 font-bold rounded-lg flex items-center gap-1 text-label-md shadow-sm"
            >
              <Check className="w-3.5 h-3.5" /> Setujui
            </Button>
          </div>
        </div>
      )}

      {/* Chat Timeline (Timeline layout wraps the entire scrolling area) */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 pb-32">
        {chat.messages.map((msg) => {
          const isMe = msg.sender === 'ME';
          const isSystem = msg.text.startsWith('🤝') || msg.text.startsWith('🤝 NEGOSIASI');

          if (isSystem) {
            return (
              <div key={msg.id} className="flex justify-center my-6">
                <div className="bg-primary-fixed border border-on-primary-fixed-variant/30 p-4 rounded-lg max-w-[85%] text-center shadow-sm">
                  <div className="flex justify-center mb-1">
                    <ShieldCheck className="w-6 h-6 text-on-primary-fixed" />
                  </div>
                  <p className="font-jakarta text-body-sm text-on-primary-fixed font-bold leading-relaxed">
                    {msg.text}
                  </p>
                  <span className="text-body-sm font-jakarta text-on-primary-fixed/60 block mt-1.5">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          }

          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[78%] p-3.5 rounded-lg text-body-sm leading-relaxed ${
                  isMe
                    ? 'bg-primary text-on-primary rounded-br-none font-jakarta font-medium shadow-sm'
                    : 'bg-surface-container-lowest text-on-surface border border-outline-variant/60 rounded-bl-none font-jakarta font-medium shadow-2xs'
                }`}
              >
                <p>{msg.text}</p>
                <span
                  className={`text-body-sm font-jakarta block text-right mt-1.5 ${
                    isMe ? 'text-on-primary-container/70' : 'text-on-surface-variant'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={timelineEndRef} />
      </div>

      {/* Pinned Input Accessory row with quick replies and bottom bars */}
      <div className="absolute bottom-0 inset-x-0 bg-surface border-t border-outline-variant/60 p-4 pt-3 pb-6 z-20">
        {/* Quick Replies chips row */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3">
          {quickReplies.map((reply) => (
            <button
              key={reply}
              onClick={() => handleSendMessage(reply)}
              className="px-3.5 py-1.5 bg-surface-container border border-outline-variant text-body-sm font-bold font-jakarta rounded-full text-on-surface-variant hover:border-primary active:scale-95 transition-all shrink-0 whitespace-nowrap"
            >
              {reply}
            </button>
          ))}
        </div>

        {/* Input Text Form bar */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => alert('Lampiran file: Lampirkan foto panen/lahan (katalog baru)')}
            className="p-2.5 bg-surface-container hover:bg-surface-container-high rounded-full text-on-surface-variant active:scale-95 transition-transform"
          >
            <Paperclip strokeWidth={1.5} className="w-5 h-5" />
          </button>

          <div className="flex-1 bg-surface-container-low border border-outline-variant rounded-full px-4 py-2 flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
              placeholder="Tulis pesan negosiasi..."
              className="flex-1 bg-transparent border-none outline-none text-body-sm font-jakarta text-on-surface placeholder-on-surface-variant/70"
            />
            <button
              onClick={() => alert('Mengaktifkan kamera untuk foto panen...')}
              className="text-on-surface-variant hover:text-primary active:scale-95"
            >
              <Camera strokeWidth={1.5} className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={() => handleSendMessage(inputText)}
            disabled={!inputText.trim()}
            className={`p-3 rounded-full flex items-center justify-center transition-all ${
              inputText.trim()
                ? 'bg-primary text-on-primary shadow shadow-primary'
                : 'bg-surface-container text-on-surface-variant/40'
            }`}
          >
            <Send className="w-4 h-4 translate-x-px -translate-y-px" />
          </button>
        </div>
      </div>
    </div>
  );
}
