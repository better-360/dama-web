import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PhoneInput from 'react-phone-number-input';
import { ChevronLeft, MessageSquare } from 'lucide-react';
import 'react-phone-number-input/style.css';

interface WhatsAppAuthProps {
  onComplete: () => void;
  onBack: () => void;
}

const WhatsAppAuth: React.FC<WhatsAppAuthProps> = ({ onComplete}) => {
  const { t } = useTranslation();
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isResendActive, setIsResendActive] = useState(false);

  useEffect(() => {
    if (!showOTP || timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 0) {
          setIsResendActive(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showOTP, timeLeft]);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber) {
      setShowOTP(true);
      setTimeLeft(60);
      setIsResendActive(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleResendOTP = () => {
    setTimeLeft(60);
    setIsResendActive(false);
    // Implement resend OTP logic here
  };

  const handleBack = () => {
    if (showOTP) {
      setShowOTP(false);
      setOtp(['', '', '', '']);
    }
  };

  const handleVerify = () => {
    // Add verification logic here
    onComplete();
  };

  return (
    <div className="min-h-screen bg-[#E2E0D6] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        <button
          onClick={handleBack}
          className="text-[#292A2D] mb-6 flex items-center gap-1 hover:opacity-80 transition-opacity"
        >
          <ChevronLeft className="w-5 h-5" />
          {t('common.back')}
        </button>

        <div className="flex items-center justify-center mb-6">
          <MessageSquare className="w-12 h-12 text-[#292A2D]" />
        </div>

        <h1 className="text-3xl font-bold text-center text-[#292A2D] mb-2">
          {showOTP ? t('whatsapp.enterOTP') : t('whatsapp.title')}
        </h1>
        <p className="text-center text-gray-600 mb-8">
          {showOTP ? t('whatsapp.otpSubtitle') : t('whatsapp.subtitle')}
        </p>

        {!showOTP ? (
          <form onSubmit={handlePhoneSubmit}>
            <div className="mb-6">
              <PhoneInput
                international
                countryCallingCodeEditable={false}
                defaultCountry="TR"
                value={phoneNumber}
                onChange={(value) => setPhoneNumber(value || '')}
                className="w-full p-4 rounded-xl border border-gray-300 focus:border-[#292A2D] focus:ring-1 focus:ring-[#292A2D] transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={!phoneNumber}
              className="w-full bg-[#292A2D] text-white py-4 rounded-xl font-medium hover:bg-opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('whatsapp.continue')}
            </button>
          </form>
        ) : (
          <div>
            <div className="flex justify-center gap-3 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-14 h-14 text-center text-2xl font-bold border border-gray-300 rounded-lg focus:border-[#292A2D] focus:ring-1 focus:ring-[#292A2D] transition-all"
                />
              ))}
            </div>
            <p className="text-center text-sm text-gray-500 mb-6">
              {timeLeft > 0 ? (
                t('whatsapp.timeRemaining', { seconds: timeLeft })
              ) : (
                <button
                  onClick={handleResendOTP}
                  className="text-[#292A2D] hover:underline"
                >
                  {t('whatsapp.resendOTP')}
                </button>
              )}
            </p>
            <button
              onClick={handleVerify}
              disabled={otp.some((digit) => !digit)}
              className="w-full bg-[#292A2D] text-white py-4 rounded-xl font-medium hover:bg-opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('whatsapp.verify')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsAppAuth;