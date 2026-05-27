/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, UploadCloud, MapPin, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Post, PostType } from '@/types/post';
import { CERTIFICATE_OPTIONS } from '@/lib/constants';
import { toggleItem } from '@/lib/utils';

export interface CreateListingProps {
  onAddPost: (post: Post) => void;
}

export default function CreateListing({ onAddPost }: CreateListingProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const listingType = (searchParams.get('type') || 'penawaran').toUpperCase() as PostType;

  // State Management
  const [commodity, setCommodity] = useState('Cabai Merah');
  const [customTitle, setCustomTitle] = useState('');
  const [grade, setGrade] = useState<'A' | 'B' | 'C'>('A');
  const [condition, setCondition] = useState<'Segar' | 'Kering' | 'Olahan'>('Segar');
  const [unit, setUnit] = useState('kg');
  const [stock, setStock] = useState('500');
  const [price, setPrice] = useState('32000');
  const [isRetail, setIsRetail] = useState(true);
  const [isB2B, setIsB2B] = useState(true);
  const [minRetail, setMinRetail] = useState('1 kg');
  const [minB2B, setMinB2B] = useState('50 kg');
  const [location, setLocation] = useState('Kabupaten Garut, Jawa Barat');
  const [date, setDate] = useState('30 Mei 2026');
  const [desc, setDesc] = useState('');
  const [selectedCerts, setSelectedCerts] = useState<string[]>(['ORGANIK']);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1588252306573-6cd7a4f0b3de?auto=format&fit=crop&q=80&w=400',
  ]);

  const handleToggleCert = (cert: string) => {
    setSelectedCerts(toggleItem(selectedCerts, cert));
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commodity || !stock || !price || !desc) {
      alert('Harap lengkapi isian wajib: Komoditas, Stok, Harga, dan Deskripsi!');
      return;
    }

    // Generate simulated new post object
    const finalTitle =
      customTitle ||
      `${commodity} ${listingType === 'PENAWARAN' ? 'Siap Panen' : 'Butuh Cepat'} Grade ${grade}`;
    const newPost = {
      id: crypto.randomUUID(),
      author: {
        id: 'user_me',
        name: 'Siti Nurhaliza',
        avatar:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        location: 'Garut, Jawa Barat',
        isVerified: true,
      },
      type: listingType,
      title: finalTitle,
      price: parseInt(price),
      unit: unit,
      minOrderRetail: isRetail ? minRetail : '-',
      minOrderB2B: isB2B ? minB2B : '-',
      stockAvailable: listingType === 'PENAWARAN' ? `${stock} ${unit}` : undefined,
      quantityNeeded: listingType === 'PERMINTAAN' ? `${stock} ${unit}` : undefined,
      photoUrl:
        uploadedPhotos[0] ||
        'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=400',
      location: location,
      harvestOrNeededDate: date,
      certifications: selectedCerts,
      caption: desc,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      isLiked: false,
      hoursAgo: 0.1,
    };

    onAddPost(newPost);
    alert('Listing berhasil diterbitkan ke feed!');
    navigate('/beranda');
  };

  const triggerUploadMock = () => {
    // Inject a realistic potato crop image for secondary upload slot
    if (uploadedPhotos.length < 3) {
      setUploadedPhotos([
        ...uploadedPhotos,
        'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&q=80&w=400',
      ]);
      alert('Foto simulasi berhasil ditambahkan.');
    } else {
      alert('Maksimal mengunggah 3 foto untuk demo.');
    }
  };

  return (
    <div className="flex-1 pb-28 bg-surface text-on-surface">
      {/* Stick Header row */}
      <div className="sticky top-0 bg-surface/90 backdrop-blur-md z-30 px-5 py-4 flex items-center justify-between border-b border-outline-variant/50">
        <button
          onClick={() => navigate('/beranda')}
          className="p-1.5 hover:bg-surface-container rounded-full text-primary active:scale-95 transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="font-fraunces text-body-lg font-bold text-primary">
          Buat {listingType === 'PENAWARAN' ? 'Penawaran' : 'Permintaan'}
        </span>
        <span className="w-6 shrink-0" /> {/* horizontal spacer */}
      </div>

      <form onSubmit={handlePublish} className="px-5 mt-6 space-y-6">
        {/* Section 1: Photo grid uploader */}
        <div className="space-y-2">
          <label className="text-label-md font-bold text-on-surface uppercase tracking-wider block font-jakarta">
            Foto Hasil Panen / Produk (Batas 3)
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {uploadedPhotos.map((url, idx) => (
              <div
                key={idx}
                className="relative aspect-square rounded-lg overflow-hidden border border-outline-variant"
              >
                <img
                  src={url}
                  alt="uploaded crop"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <button
                  type="button"
                  onClick={() => setUploadedPhotos(uploadedPhotos.filter((_, i) => i !== idx))}
                  className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full text-white text-body-sm flex items-center justify-center font-bold"
                >
                  ×
                </button>
              </div>
            ))}

            {uploadedPhotos.length < 3 && (
              <button
                type="button"
                onClick={triggerUploadMock}
                className="aspect-square rounded-lg border-2 border-dashed border-outline-variant hover:border-primary bg-surface-container-low flex flex-col items-center justify-center text-center p-2 transition-all active:scale-95"
              >
                <UploadCloud className="w-6 h-6 text-on-surface-variant/70 mb-1" />
                <span className="text-[9px] font-bold text-on-surface-variant font-jakarta uppercase">
                  TAMBAHKAN FOTO
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Section 2: Commodity selector dropdown & custom title */}
        <div className="space-y-4 bg-surface-container-lowest p-5 rounded-lg border border-outline-variant/60 shadow-sm">
          <div className="space-y-1.5">
            <label className="text-label-md font-bold text-on-surface uppercase tracking-wider font-jakarta block">
              Nama Komoditas
            </label>
            <select
              value={commodity}
              onChange={(e) => setCommodity(e.target.value)}
              className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded focus:border-primary text-body-md outline-none"
            >
              <option value="Cabai Merah">🌶️ Cabai Merah Keriting</option>
              <option value="Kentang">🥔 Kentang Granola</option>
              <option value="Tomat">🍅 Tomat Ceri Hidroponik</option>
              <option value="Bawang Merah">🧅 Bawang Merah Brebes</option>
              <option value="Beras IR64">🌾 Beras IR64 Premium</option>
              <option value="Kopi Arabika">☕ Kopi Arabika Papandayan</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-label-md font-bold text-on-surface uppercase tracking-wider font-jakarta block">
              Judul Postingan (Opsional)
            </label>
            <input
              type="text"
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="Contoh: Cabai Cikuray Besar Segar Mulus"
              className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded focus:border-primary text-body-md outline-none font-jakarta"
            />
          </div>
        </div>

        {/* Section 3: Grade & Condition Chips */}
        <div className="bg-surface-container-lowest p-5 rounded-lg border border-outline-variant/60 shadow-sm space-y-4">
          <div className="space-y-2">
            <span className="text-label-md font-bold text-on-surface uppercase tracking-wider font-jakarta block">
              Grade Kualitas
            </span>
            <div className="flex gap-2.5">
              {(['A', 'B', 'C'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGrade(g)}
                  className={`flex-1 py-2 text-label-md font-bold rounded-lg transition-all border ${
                    grade === g
                      ? 'bg-primary text-on-primary border-primary'
                      : 'bg-surface-container-low text-on-surface-variant border-outline-variant'
                  }`}
                >
                  Grade {g}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-label-md font-bold text-on-surface uppercase tracking-wider font-jakarta block">
              Kondisi Barang
            </span>
            <div className="flex gap-2.5">
              {(['Segar', 'Kering', 'Olahan'] as const).map((cond) => (
                <button
                  key={cond}
                  type="button"
                  onClick={() => setCondition(cond)}
                  className={`flex-1 py-1.5 text-label-md font-bold rounded-lg transition-all border ${
                    condition === cond
                      ? 'bg-primary text-on-primary border-primary'
                      : 'bg-surface-container-low text-on-surface-variant border-outline-variant'
                  }`}
                >
                  {cond}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: Pricing & Inventory */}
        <div className="bg-surface-container-lowest p-5 rounded-lg border border-outline-variant/60 shadow-sm space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-label-md font-bold text-on-surface uppercase tracking-wider font-jakarta block">
                Satuan Takar
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded focus:border-primary text-body-md outline-none"
              >
                <option value="kg">kilogram (kg)</option>
                <option value="ton">ton</option>
                <option value="karung">karung</option>
                <option value="kotak">kotak</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-label-md font-bold text-on-surface uppercase tracking-wider font-jakarta block">
                {listingType === 'PENAWARAN' ? 'Stok Tersedia' : 'Jumlah Kebutuhan'}
              </label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded focus:border-primary text-body-md outline-none font-jakarta"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-label-md font-bold text-on-surface uppercase tracking-wider font-jakarta block">
              {listingType === 'PENAWARAN' ? 'Patokan Harga (Rupiah)' : 'Anggaran Maks (Rupiah)'}
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 font-fraunces font-bold text-secondary text-body-lg tabular-nums">
                Rp
              </span>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full pl-12 pr-12 py-3 bg-surface-container-low border border-outline-variant text-secondary font-bold text-headline-md rounded focus:border-primary outline-none"
              />
              <span className="absolute right-4 font-bold text-body-sm text-on-surface-variant">
                /{unit}
              </span>
            </div>
          </div>
        </div>

        {/* Section 5: B2C/B2B Checkboxes & Toggles */}
        <div className="bg-surface-container-lowest p-5 rounded-lg border border-outline-variant/60 shadow-sm space-y-4">
          <span className="text-label-md font-bold text-on-surface uppercase tracking-wider font-jakarta block">
            Ketersediaan Pengadaan
          </span>

          <div className="space-y-3.5">
            {/* Retail Checkbox */}
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isRetail}
                onChange={(e) => setIsRetail(e.target.checked)}
                className="w-5 h-5 accent-primary mt-0.5 rounded"
              />
              <div>
                <span className="font-jakarta font-bold text-label-md text-on-surface block">
                  Layani Eceran (B2C)
                </span>
                <span className="text-body-sm text-on-surface-variant">
                  Bisa dibeli konsumen per kilo untuk dapur harian
                </span>
              </div>
            </label>

            {isRetail && (
              <div className="pl-8 space-y-1.5">
                <span className="text-body-sm uppercase font-bold text-on-surface-variant font-jakarta block">
                  Min. Order Eceran
                </span>
                <input
                  type="text"
                  value={minRetail}
                  onChange={(e) => setMinRetail(e.target.value)}
                  placeholder="Contoh: 1 kg"
                  className="w-full max-w-[140px] px-3.5 py-1.5 bg-surface-container-low border border-outline-variant text-body-sm rounded outline-none"
                />
              </div>
            )}

            {/* B2B wholesale Checkbox */}
            <label className="flex items-start gap-3 cursor-pointer select-none border-t border-outline-variant/30 pt-3.5">
              <input
                type="checkbox"
                checked={isB2B}
                onChange={(e) => setIsB2B(e.target.checked)}
                className="w-5 h-5 accent-primary mt-0.5 rounded"
              />
              <div>
                <span className="font-jakarta font-bold text-label-md text-on-surface block">
                  Layani Grosir Borongan (B2B)
                </span>
                <span className="text-body-sm text-on-surface-variant">
                  Mendukung muatan kuantitas besar untuk restoran/pabrik
                </span>
              </div>
            </label>

            {isB2B && (
              <div className="pl-8 space-y-1.5">
                <span className="text-body-sm uppercase font-bold text-on-surface-variant font-jakarta block">
                  Min. Order Grosir
                </span>
                <input
                  type="text"
                  value={minB2B}
                  onChange={(e) => setMinB2B(e.target.value)}
                  placeholder="Contoh: 50 kg"
                  className="w-full max-w-[140px] px-3.5 py-1.5 bg-surface-container-low border border-outline-variant text-body-sm rounded outline-none"
                />
              </div>
            )}
          </div>
        </div>

        {/* Section 6: Location & Date */}
        <div className="bg-surface-container-lowest p-5 rounded-lg border border-outline-variant/60 shadow-sm space-y-4">
          <div className="space-y-1.5">
            <span className="text-label-md font-bold text-on-surface uppercase tracking-wider font-jakarta block">
              Lokasi Panen / Bongkar
            </span>
            <div className="relative flex items-center">
              <MapPin className="absolute left-3.5 text-secondary w-5 h-5" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant text-body-sm rounded outline-none focus:border-primary font-jakarta"
              />
            </div>
            <button
              type="button"
              onClick={() => setLocation('Kabupaten Bandung, Jawa Barat')}
              className="text-body-sm text-secondary font-bold hover:underline block pt-1"
            >
              🎯 Deteksi Lokasi Sekarang (Simulasi)
            </button>
          </div>

          <div className="space-y-1.5">
            <label className="text-label-md font-bold text-on-surface uppercase tracking-wider font-jakarta block">
              Tanggal Panen / Siap Kirim
            </label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="Contoh: 30 Mei 2026 atau Panen Kemarin"
              className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded focus:border-primary text-body-md outline-none font-jakarta"
            />
          </div>
        </div>

        {/* Section 7: Description & Certification Chips */}
        <div className="bg-surface-container-lowest p-5 rounded-lg border border-outline-variant/60 shadow-sm space-y-4">
          <div className="space-y-1.5">
            <label className="text-label-md font-bold text-on-surface uppercase tracking-wider font-jakarta block">
              Deskripsi Hasil Kebun / Permintaan
            </label>
            <textarea
              rows={4}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Jelaskan kualitas, warna cabai, sistem pemupukan, rasa manis tomat, atau spesifikasi logistik kiriman..."
              className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded focus:border-primary text-body-sm outline-none font-jakarta resize-none leading-relaxed"
            />
          </div>

          <div className="space-y-2.5">
            <span className="text-label-md font-bold text-on-surface uppercase tracking-wider font-jakarta block">
              Sertifikasi Legal (Grup Tani)
            </span>
            <div className="flex flex-wrap gap-2.5">
              {CERTIFICATE_OPTIONS.map((cert) => {
                const isSelected = selectedCerts.includes(cert);
                return (
                  <button
                    key={cert}
                    type="button"
                    onClick={() => handleToggleCert(cert)}
                    className={`px-4 py-1.5 rounded-full text-label-md font-bold font-jakarta border transition-all flex items-center gap-1 ${
                      isSelected
                        ? 'bg-primary text-on-primary border-primary shadow-sm'
                        : 'bg-surface-container-low text-on-surface-variant border-outline-variant'
                    }`}
                  >
                    {cert}
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sticky bottom publish button */}
        <div className="pt-4">
          <Button
            id="publish-submit-btn"
            type="submit"
            variant="primary"
            fullWidth
            className="py-4 shadow-lg text-body-md"
          >
            Posting Sekarang
          </Button>
        </div>
      </form>
    </div>
  );
}
