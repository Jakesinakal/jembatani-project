/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UploadCloud } from 'lucide-react';

export interface PhotoUploadSectionProps {
  uploadedPhotos: string[];
  setUploadedPhotos: (photos: string[]) => void;
}

export function PhotoUploadSection({ uploadedPhotos, setUploadedPhotos }: PhotoUploadSectionProps) {
  const triggerUploadMock = () => {
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
  );
}
