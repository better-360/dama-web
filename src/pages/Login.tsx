import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MessageCircle, ChevronRight, Edit2 } from "lucide-react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { requestOTPToken, verifyOTPToken } from "../http/requests/applicator";
import toast from "react-hot-toast";
import { getPreferredLanguage, saveUserTokens } from "../utils/storage";
import LanguageSeletPage from "./Language";
import { useDispatch } from "react-redux";
import { loginApplicator } from "../store/slices/applicatorSlice";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [lang, setLang] = useState<string | null>();
  const { t } = useTranslation();
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOTP] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(600); // 10 minutes in seconds
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const lang = getPreferredLanguage();
    if (lang) {
      setLang(lang);
    }
  }, []);

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber) {
      await requestOTPToken(phoneNumber);
      setShowOTP(true);
      // Start timer
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const handleOTPChange = (value: string, index: number) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOTP = [...otp];
      newOTP[index] = value;
      setOTP(newOTP);
      // Auto-focus next input
      if (value && index < 3) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleOTPKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!otp.every((digit) => digit !== "")) return;
  
    if (!phoneNumber) {
      toast.error("Phone number is missing");
      return;
    }
  
    try {
      const res = await verifyOTPToken(phoneNumber, otp.join(""));
      console.log("OTP Response:", res); // Debug için
      
      dispatch(loginApplicator(res));
      saveUserTokens(res.tokens);
  
      const { status, application } = res.applicator;
  
      if (status === "APPLICATOR") {
        if (!application) {
          navigate("/forms/pre-application", { replace: true });
        } else {
          navigate(application.preApplicationCompleted ? "/status" : "/forms/pre-application", { replace: true });
        }
      } else if (status === "CLIENT") {
        if (!application) {
          navigate("/forms/application-form", { replace: true });
        } else {
          navigate(application.applicationCompleted ? "/status" : "/forms/application-form", { replace: true });
        }
      } else if (status === "APPOINTMENT_SCHEDULED") {
        navigate("/status", { replace: true });
      } else {
        toast.error("Invalid User or Status Type");
      }
    } catch (error: any) {
      console.error("OTP Verification Error:", error);
      toast.error("OTP Verification Error: " + (error.message || "Invalid OTP"));
    }
  };
  

  if (!lang) {
    return <LanguageSeletPage setLang={setLang} />;
  }

  return (
    <div className="min-h-screen bg-[#E2E0D6] flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6 sm:p-8 my-8">
        <div className="text-center mb-8">
          <div className="inline-flex justify-center p-3 bg-[#292A2D] bg-opacity-5 rounded-full">
            <MessageCircle className="w-8 h-8 text-[#292A2D]" />
          </div>
          <h1 className="text-2xl font-bold text-[#292A2D] mt-4">
            {showOTP ? t("whatsapp.otpTitle") : t("whatsapp.title")}
          </h1>
          <p className="text-gray-600 mt-1">
            {showOTP ? t("whatsapp.otpDescription") : t("whatsapp.description")}
          </p>
        </div>

        {!showOTP ? (
          <form onSubmit={handlePhoneSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("whatsapp.phoneLabel")}
              </label>
              <PhoneInput
                international
                countryCallingCodeEditable={false}
                defaultCountry="TR"
                value={phoneNumber}
                onChange={(value) => setPhoneNumber(value || "")}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#292A2D] focus:ring-1 focus:ring-[#292A2D] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={!phoneNumber}
              className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-medium text-lg
                ${
                  phoneNumber
                    ? "bg-[#292A2D] text-white hover:bg-opacity-90 transform hover:scale-[1.02] active:scale-[0.98]"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                } transition-all duration-300`}
            >
              {t("whatsapp.continue")}
              <ChevronRight className="w-5 h-5" />
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-blue-50 p-4 rounded-xl">
              <div>
                <p className="text-sm text-blue-700">{t("whatsapp.sentTo")}</p>
                <p className="font-medium text-blue-900">{phoneNumber}</p>
              </div>
              <button
                onClick={() => setShowOTP(false)}
                className="text-blue-700 hover:text-blue-900 transition-colors"
              >
                <Edit2 className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleOTPSubmit} className="space-y-6">
              <div>
                <div className="flex justify-between gap-3 mb-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOTPChange(e.target.value, index)}
                      onKeyDown={(e) => handleOTPKeyDown(e, index)}
                      className="w-16 h-16 text-2xl text-center border-2 border-gray-200 rounded-xl focus:border-[#292A2D] focus:ring-1 focus:ring-[#292A2D] transition-colors"
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-500 text-center">
                  {t("whatsapp.otpValidity")}: {formatTime(timer)}
                </p>
              </div>

              <button
                type="submit"
                disabled={!otp.every((digit) => digit !== "")}
                className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-medium text-lg
                  ${
                    otp.every((digit) => digit !== "")
                      ? "bg-[#292A2D] text-white hover:bg-opacity-90 transform hover:scale-[1.02] active:scale-[0.98]"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  } transition-all duration-300`}
              >
                {t("whatsapp.verify")}
                <ChevronRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
