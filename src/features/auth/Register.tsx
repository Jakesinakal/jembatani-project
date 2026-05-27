/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Check, Compass, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { UserRole } from '@/types/user';
import { CROPS_LIST } from '@/lib/constants';
import { toggleItem } from '@/lib/utils';

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [mainRole, setMainRole] = useState<UserRole | null>(null);
  const [province, setProvince] = useState('Jawa Barat');
  const [city, setCity] = useState('Garut');
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  const handleNextStep = () => {
    setErrorMsg('');
    if (step === 1) {
      if (!fullName || !phone || !password || !confirmPassword) {
        setErrorMsg('Harap lengkapi semua bidang yang wajib diisi.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Kata sandi dan konfirmasi kata sandi tidak cocok.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (otp.some((v) => v === '')) {
        setErrorMsg('Harap masukkan 6 digit kode OTP verifikasi HP.');
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!mainRole) {
        setErrorMsg('Pilih salah satu peran utama Anda terlebih dahulu.');
        return;
      }
      setStep(4);
    } else if (step === 4) {
      if (selectedCrops.length < 3) {
        setErrorMsg('Pilih minimal 3 komoditas minat untuk mempersonalisasi beranda.');
        return;
      }
      // Finish registration
      navigate('/beranda');
    }
  };

  const handlePrevStep = () => {
    setErrorMsg('');
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/login');
    }
  };

  const handleOtpChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[index] = val.slice(-1);
    setOtp(newOtp);
    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleToggleCrop = (crop: string) => {
    setSelectedCrops(toggleItem(selectedCrops, crop));
  };

  return (
    <div className="flex-1 min-h-screen bg-surface flex flex-col justify-between px-5 py-8">
      <div>
        {/* Navigation / Progress Indicator */}
        <div className="flex items-center justify-between mt-2 mb-8">
          <button
            onClick={handlePrevStep}
            className="p-1 px-3 py-1.5 bg-surface-container rounded-full text-primary font-bold text-label-md flex items-center gap-1 active:scale-95 transition-all"
          >
            <ChevronLeft className="w-5 h-5" /> Kembali
          </button>

          <div className="flex items-center gap-2">
            <span className="text-body-sm font-bold font-jakarta text-on-surface-variant">
              Langkah {step} dari 4
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden mb-8">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {errorMsg && (
          <div className="text-error bg-error-container/20 border border-error-container p-3 rounded-lg text-body-sm font-semibold mb-6">
            {errorMsg}
          </div>
        )}

        {/* Step 1: Account Creation */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-fraunces text-headline-md font-bold text-primary mb-2">
                Buat Akun Baru
              </h2>
              <p className="font-jakarta text-body-md text-on-surface-variant">
                Bergabunglah dengan ribuan petani dan pembeli di JembaTani.
              </p>
            </div>

            <div className="space-y-4 bg-surface-container-lowest p-6 rounded-lg border border-outline-variant/60 shadow-sm">
              <div className="space-y-1.5">
                <label className="text-label-md font-bold text-on-surface tracking-wider uppercase font-jakarta">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Contoh: Pak Budi Setiawan"
                  className="w-full px-4 py-3 bg-surface-container-low text-on-surface border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary text-body-md outline-none transition-all font-jakarta"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-label-md font-bold text-on-surface tracking-wider uppercase font-jakarta">
                  Nomor HP (WhatsApp)
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Contoh: 08212345678"
                  className="w-full px-4 py-3 bg-surface-container-low text-on-surface border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary text-body-md outline-none transition-all font-jakarta"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-label-md font-bold text-on-surface tracking-wider uppercase font-jakarta">
                  Email (Opsional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="budi@mail.com"
                  className="w-full px-4 py-3 bg-surface-container-low text-on-surface border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary text-body-md outline-none transition-all font-jakarta"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-label-md font-bold text-on-surface tracking-wider uppercase font-jakarta">
                    Kata Sandi
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full px-4 py-3 bg-surface-container-low text-on-surface border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary text-body-md outline-none transition-all font-jakarta"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-label-md font-bold text-on-surface tracking-wider uppercase font-jakarta">
                    Ulangi Kata Sandi
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Masukkan ulang kata sandi"
                    className="w-full px-4 py-3 bg-surface-container-low text-on-surface border border-outline-variant rounded focus:border-primary focus:ring-1 focus:ring-primary text-body-md outline-none transition-all font-jakarta"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-fraunces text-headline-md font-bold text-primary mb-2">
                Verifikasi Nomor HP
              </h2>
              <p className="font-jakarta text-body-md text-on-surface-variant">
                Kami telah mengirimkan SMS berisi 6-digit kode OTP ke nomor{' '}
                <b className="text-on-surface">{phone}</b>.
              </p>
            </div>

            <div className="bg-surface-container-lowest p-6 rounded-lg border border-outline-variant/60 shadow-sm text-center">
              <div
                id="otp-input-baskets"
                className="flex justify-between max-w-sm mx-auto mb-6 gap-2"
              >
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-${idx}`}
                    type="text"
                    pattern="\d*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    className="w-12 h-14 bg-surface-container-low border border-outline-variant rounded-lg text-center text-xl font-bold text-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  />
                ))}
              </div>

              <div className="font-jakarta text-body-sm text-on-surface-variant">
                Dapatkan kode baru via WhatsApp dalam{' '}
                <span className="text-secondary font-bold">59 detik</span>.
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Role Selection */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-fraunces text-headline-md font-bold text-primary mb-2">
                Pilih Peran Utama Anda
              </h2>
              <p className="font-jakarta text-body-md text-on-surface-variant">
                Sesuaikan fitur utama beranda Anda untuk fokus menjual atau membeli. Kamu tetap bisa
                ganti kapan saja nanti.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {/* Petani (Farmer) Option */}
              <button
                type="button"
                id="role-petani-select"
                onClick={() => setMainRole('PETANI')}
                className={`p-6 text-left rounded-lg border transition-all flex items-start gap-4 ${
                  mainRole === 'PETANI'
                    ? 'border-primary bg-primary-fixed/20 ring-2 ring-primary'
                    : 'border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low'
                }`}
              >
                <div
                  className={`p-3 rounded-full ${mainRole === 'PETANI' ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'}`}
                >
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-fraunces text-body-lg font-bold text-primary">
                      Saya Petani / Produsen
                    </span>
                    {mainRole === 'PETANI' && (
                      <div className="bg-primary text-on-primary rounded-full p-0.5">
                        <Check className="w-3" />
                      </div>
                    )}
                  </div>
                  <p className="font-jakarta text-body-sm text-on-surface-variant leading-relaxed">
                    Mau menjual hasil bumi segar, membuat penawaran pasokan harvest, serta merespon
                    permintaan borongan dari restoran/pabrik.
                  </p>
                </div>
              </button>

              {/* Pembeli (Buyer) Option */}
              <button
                type="button"
                id="role-pembeli-select"
                onClick={() => setMainRole('PEMBELI')}
                className={`p-6 text-left rounded-lg border transition-all flex items-start gap-4 ${
                  mainRole === 'PEMBELI'
                    ? 'border-secondary bg-secondary-fixed/20 ring-2 ring-secondary'
                    : 'border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low'
                }`}
              >
                <div
                  className={`p-3 rounded-full ${mainRole === 'PEMBELI' ? 'bg-secondary text-on-secondary' : 'bg-surface-container text-on-surface-variant'}`}
                >
                  <Compass className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-fraunces text-body-lg font-bold text-primary">
                      Saya Pembeli Grosir / Retail
                    </span>
                    {mainRole === 'PEMBELI' && (
                      <div className="bg-secondary text-on-secondary rounded-full p-0.5">
                        <Check className="w-3" />
                      </div>
                    )}
                  </div>
                  <p className="font-jakarta text-body-sm text-on-surface-variant leading-relaxed">
                    Mencari pasokan sayur segar langsung, membuat rincian permintaan pasokan B2B,
                    atau membeli kebutuhan dapur harian B2C.
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Location & Crop selection */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-fraunces text-headline-md font-bold text-primary mb-2">
                Lokasi & Komoditas Minat
              </h2>
              <p className="font-jakarta text-body-md text-on-surface-variant">
                Sampaikan domisili Anda untuk mengaktifkan ticker harga lokal terdekat.
              </p>
            </div>

            <div className="space-y-6 bg-surface-container-lowest p-6 rounded-lg border border-outline-variant/60 shadow-sm">
              {/* Province / City Form */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-label-md font-bold text-on-surface tracking-wider uppercase font-jakarta">
                    Provinsi
                  </label>
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded focus:border-primary text-body-md outline-none"
                  >
                    <option value="Jawa Barat">Jawa Barat</option>
                    <option value="Jawa Tengah">Jawa Tengah</option>
                    <option value="Jawa Timur">Jawa Timur</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-label-md font-bold text-on-surface tracking-wider uppercase font-jakarta">
                    Kabupaten / Kota
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded focus:border-primary text-body-md outline-none"
                  >
                    <option value="Garut">Garut</option>
                    <option value="Brebes">Brebes</option>
                    <option value="Cianjur">Cianjur</option>
                    <option value="Bandung">Bandung</option>
                  </select>
                </div>
              </div>

              {/* Crop selectors */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-label-md font-bold text-on-surface tracking-wider uppercase font-jakarta">
                    Pilih Komoditas Minat (
                    <span
                      className={
                        selectedCrops.length >= 3
                          ? 'text-primary font-bold'
                          : 'text-secondary font-bold'
                      }
                    >
                      {selectedCrops.length}
                    </span>{' '}
                    terpilih)
                  </label>
                  <span className="text-body-sm text-on-surface-variant">Pilih minimal 3</span>
                </div>
                <div id="crop-multiselect-chips" className="flex flex-wrap gap-2 pt-1">
                  {CROPS_LIST.map((crop) => {
                    const isSelected = selectedCrops.includes(crop);
                    return (
                      <button
                        key={crop}
                        type="button"
                        onClick={() => handleToggleCrop(crop)}
                        className={`px-4 py-2 text-label-md font-bold rounded-full transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-primary text-on-primary shadow-sm hover:opacity-90'
                            : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                        }`}
                      >
                        {crop}
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8">
        <Button
          id="wizard-submit-btn"
          type="button"
          variant="primary"
          fullWidth
          onClick={handleNextStep}
          className="py-3.5 shadow-md"
        >
          {step === 4 ? 'Selesaikan Pendaftaran (Mulai)' : 'Lanjutkan'}
        </Button>
      </div>
    </div>
  );
}
