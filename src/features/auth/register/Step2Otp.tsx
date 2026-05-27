/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Step2OtpProps {
  otp: string[];
  setOtp: (v: string[]) => void;
  phone: string;
}

export function Step2Otp({ otp, setOtp, phone }: Step2OtpProps) {
  const handleOtpChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[index] = val.slice(-1);
    setOtp(newOtp);
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
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
        <div id="otp-input-baskets" className="flex justify-between max-w-sm mx-auto mb-6 gap-2">
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
  );
}
