/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Settings,
  Briefcase,
  ChevronRight,
  UserCheck,
  CreditCard,
  FileText,
  LogOut,
  Sparkles,
  BookOpen,
  FolderHeart,
} from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { UserRole } from '@/types/user';

export interface AkunProps {
  currentRoleMode: UserRole;
  onToggleRoleMode: (newRole: UserRole) => void;
}

export default function Akun({ currentRoleMode, onToggleRoleMode }: AkunProps) {
  const navigate = useNavigate();

  const menuSections = [
    {
      title: 'Aktivitas Saya',
      items: [
        { label: 'Postingan saya', subtitle: 'List semua katalog hasil panen', icon: FileText },
        { label: 'Tersimpan', subtitle: 'Koleksi postingan petani favorit', icon: FolderHeart },
        { label: 'Riwayat tawaran', subtitle: 'Arsip negosiasi harga', icon: Sparkles },
      ],
    },
    {
      title: 'Transaksi & Keuangan',
      items: [
        { label: 'Pesanan Aktif', subtitle: 'Lacak pengiriman truk/logistik', icon: Briefcase },
        { label: 'Riwayat Pesanan', subtitle: 'Selesai & Faktur', icon: BookOpen },
        { label: 'Dompet & Pencairan', subtitle: 'Saldo: Rp 2.450.000', icon: CreditCard },
      ],
    },
    {
      title: 'Akun & Verifikasi',
      items: [
        {
          label: 'Verifikasi Identitas (KTP)',
          subtitle: 'Selesai diverifikasi',
          icon: UserCheck,
          isVerified: true,
        },
        {
          label: 'Verifikasi Lahan & Kebun',
          subtitle: 'Kelompok Tani Garut',
          icon: MapPin,
          isVerified: true,
        },
      ],
    },
    {
      title: 'Pengaturan & Dukungan',
      items: [
        { label: 'Preferensi Notifikasi', subtitle: 'Pesan whatsapp & aplikasi', icon: Settings },
        { label: 'Bahasa', subtitle: 'Bahasa Indonesia (Default)', icon: BookOpen },
        {
          label: 'Keluar Akun',
          subtitle: 'Log out dari perangkat ini',
          icon: LogOut,
          isDanger: true,
        },
      ],
    },
  ];

  const handleMenuClick = (label: string) => {
    if (label === 'Keluar Akun') {
      const confirmLogout = window.confirm('Apakah Anda yakin ingin keluar dari Akun JembaTani?');
      if (confirmLogout) {
        navigate('/login');
      }
    } else {
      alert(`Menu terpilih: ${label} (Mode Demo)`);
    }
  };

  return (
    <div className="flex-1 pb-24 bg-surface text-on-surface">
      {/* Top Section Cream Background */}
      <div className="bg-surface-container pb-8 pt-10 px-5 border-b border-outline-variant/60 flex flex-col items-center text-center">
        {/* Large Avatar Centered with forest border */}
        <div className="relative mb-4">
          <Avatar
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
            name="Siti Nurhaliza"
            size="xl"
            isVerified={true}
          />
        </div>

        {/* User identification */}
        <h2 className="font-fraunces text-headline-md font-bold text-primary flex items-center gap-1">
          Siti Nurhaliza
        </h2>

        <span className="text-body-sm uppercase font-bold text-on-surface-variant font-jakarta tracking-wider flex items-center gap-0.5 mt-1">
          📍 Garut, Jawa Barat
        </span>

        {/* Verified labels */}
        <div className="flex gap-2 mt-3.5">
          <Badge variant="permintaan">Petani Garut</Badge>
          <Badge variant="penawaran">Pembeli Aktif</Badge>
        </div>

        {/* Triple Column stats row */}
        <div
          id="author-stats-columns"
          className="grid grid-cols-3 gap-4 w-full max-w-sm mt-6 pt-5 border-t border-outline-variant/30 text-center"
        >
          <div>
            <span className="font-fraunces font-bold text-body-md text-primary block tabular-nums">
              1.2K
            </span>
            <span className="text-body-sm uppercase font-bold text-on-surface-variant tracking-wider font-jakarta block">
              Pengikut
            </span>
          </div>
          <div className="border-x border-outline-variant/30">
            <span className="font-fraunces font-bold text-body-md text-primary block tabular-nums">
              340
            </span>
            <span className="text-body-sm uppercase font-bold text-on-surface-variant tracking-wider font-jakarta block">
              Mengikuti
            </span>
          </div>
          <div>
            <span className="font-fraunces font-bold text-body-md text-primary block tabular-nums">
              28
            </span>
            <span className="text-body-sm uppercase font-bold text-on-surface-variant tracking-wider font-jakarta block">
              Postingan
            </span>
          </div>
        </div>
      </div>

      {/* Segmented control mode switcher picker (Petani vs Pembeli) */}
      <div className="px-5 mt-6">
        <div className="bg-surface-container-highest p-1.5 rounded-full border border-outline-variant flex gap-1">
          <button
            onClick={() => onToggleRoleMode('PETANI')}
            className={`flex-1 py-3 text-label-md font-bold font-jakarta rounded-full transition-all text-center flex items-center justify-center gap-1.5 ${
              currentRoleMode === 'PETANI'
                ? 'bg-primary text-on-primary shadow-sm hover:opacity-95'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            🧑‍🌾 Mode Petani (Jual)
          </button>

          <button
            onClick={() => onToggleRoleMode('PEMBELI')}
            className={`flex-1 py-3 text-label-md font-bold font-jakarta rounded-full transition-all text-center flex items-center justify-center gap-1.5 ${
              currentRoleMode === 'PEMBELI'
                ? 'bg-secondary text-on-secondary shadow-sm hover:opacity-95'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            🛒 Mode Pembeli (Beli)
          </button>
        </div>
        <p className="text-body-sm text-center text-on-surface-variant font-jakarta font-medium mt-2 leading-relaxed">
          Ubah mode di atas untuk mengatur asupan berita draf harga dan relevansi penawaran.
        </p>
      </div>

      {/* Profiles Quick CTAs */}
      <div className="px-5 mt-4 grid grid-cols-2 gap-3.5">
        <button
          onClick={() => alert('Fitur Edit Profil: Upload KTP / Verifikasi HP')}
          className="py-2.5 bg-surface-container-lowest border border-outline-variant text-body-sm font-extrabold font-jakarta uppercase tracking-wider rounded-lg text-primary hover:bg-surface-container-low active:translate-y-px transition-all"
        >
          Edit Profil
        </button>
        <button
          onClick={() => alert('Link Toko JembaTani Anda disalin ke Clipboard!')}
          className="py-2.5 bg-surface-container-lowest border border-outline-variant text-body-sm font-extrabold font-jakarta uppercase tracking-wider rounded-lg text-primary hover:bg-surface-container-low active:translate-y-px transition-all"
        >
          Bagikan Toko
        </button>
      </div>

      {/* Grouped menu options lists (Stacked white cards) */}
      <div className="px-5 mt-6 space-y-6">
        {menuSections.map((section) => (
          <div key={section.title} className="space-y-2">
            <span className="text-body-sm font-bold font-jakarta uppercase text-on-surface-variant tracking-wider block ml-1">
              {section.title}
            </span>

            <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden shadow-sm">
              {section.items.map((item, _idx) => {
                const IconComp = item.icon;
                return (
                  <div
                    key={item.label}
                    onClick={() => handleMenuClick(item.label)}
                    className="p-4 flex items-center justify-between border-b border-outline-variant/30 last:border-b-0 hover:bg-surface-container-low/40 active:bg-surface-container-high/40 transition-colors cursor-pointer select-none h-[64px]"
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`p-2.5 rounded-lg ${item.isDanger ? 'bg-error-container/20 text-error' : 'bg-surface-container text-primary'}`}
                      >
                        <IconComp strokeWidth={1.5} className="w-5 h-5" />
                      </div>
                      <div>
                        <span
                          className={`font-jakarta font-bold text-body-sm block ${item.isDanger ? 'text-secondary' : 'text-on-surface'}`}
                        >
                          {item.label}
                        </span>
                        <span className="text-body-sm text-on-surface-variant font-medium block">
                          {item.subtitle}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-on-surface-variant">
                      {item.isVerified && (
                        <span className="px-2 py-0.5 bg-primary-fixed text-on-primary-fixed text-body-sm font-bold rounded-full font-jakarta">
                          AKTIF
                        </span>
                      )}
                      <ChevronRight className="w-5 h-5 opacity-65" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
