import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, UserCircle, ChevronRight } from "lucide-react";
import {
  updateApplicatorProfile,
  updatePreApplicationSection,
} from "../../../http/requests/applicator";

interface ContactInfo {
  firstName: string;
  lastName: string;
  email?: string;
  birthDate: string;
}

interface ContactInfoPageProps {
  initialData?: ContactInfo | null;
  onBack: () => void;
  onContinue: (contactInfo: ContactInfo) => void;
}

const ContactInfoPage: React.FC<ContactInfoPageProps> = ({
  initialData,
  onBack,
  onContinue,
}) => {
  const { t } = useTranslation();
  const [firstName, setFirstName] = useState(initialData?.firstName || "");
  const [lastName, setLastName] = useState(initialData?.lastName || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [birthDate, setBirthDate] = useState(initialData?.birthDate || "");

  // Update form fields when initialData changes
  useEffect(() => {
    if (initialData) {
      setFirstName(initialData.firstName || "");
      setLastName(initialData.lastName || "");
      setEmail(initialData.email || "");
      setBirthDate(initialData.birthDate || "");
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (firstName.trim() && lastName.trim() && birthDate) {
      handleSaveStep1();
      onContinue({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        ...(email.trim() && { email: email.trim() }),
        birthDate,
      });
    }
  };

  const handleSaveStep1 = async () => {
    const data = {
      step: 1,
      section: "contact",
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        ...(email.trim() && { email: email.trim() }),
        birthDate,
      },
    };
    await updatePreApplicationSection(data);
    await updateApplicatorProfile({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      birthDate: new Date(birthDate),
    });
  };

  // Calculate max date (18 years ago from today)
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 18);
  const maxDateString = maxDate.toISOString().split("T")[0];

  // Calculate min date (100 years ago from today)
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 100);
  const minDateString = minDate.toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-[#E2E0D6] flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6 sm:p-8 my-8">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-[#292A2D] transition-colors mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
          {t("contactInfo.back")}
        </button>

        <div className="text-center mb-8">
          <div className="inline-flex justify-center p-3 bg-[#292A2D] bg-opacity-5 rounded-full">
            <UserCircle className="w-8 h-8 text-[#292A2D]" />
          </div>
          <h1 className="text-2xl font-bold text-[#292A2D] mt-4">
            {t("contactInfo.title")}
          </h1>
          <p className="text-gray-600 mt-1">{t("contactInfo.description")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("contactInfo.firstName")} *
              </label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#292A2D] focus:ring-1 focus:ring-[#292A2D] transition-colors"
                placeholder={t("contactInfo.firstNamePlaceholder")}
                required
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("contactInfo.lastName")} *
              </label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#292A2D] focus:ring-1 focus:ring-[#292A2D] transition-colors"
                placeholder={t("contactInfo.lastNamePlaceholder")}
                required
              />
            </div>

            <div>
              <label
                htmlFor="birthDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("contactInfo.birthDate")} *
              </label>
              <input
                type="date"
                id="birthDate"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                min={minDateString}
                max={maxDateString}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#292A2D] focus:ring-1 focus:ring-[#292A2D] transition-colors"
                required
              />
              <p className="mt-1 text-sm text-gray-500">
                {t("contactInfo.birthDateNote")}
              </p>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {t("contactInfo.email")}
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#292A2D] focus:ring-1 focus:ring-[#292A2D] transition-colors"
                placeholder={t("contactInfo.emailPlaceholder")}
              />
              <p className="mt-1 text-sm text-gray-500">
                {t("contactInfo.emailOptional")}
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={!firstName.trim() || !lastName.trim() || !birthDate}
            className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-medium text-lg
              ${
                firstName.trim() && lastName.trim() && birthDate
                  ? "bg-[#292A2D] text-white hover:bg-opacity-90 transform hover:scale-[1.02] active:scale-[0.98]"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              } transition-all duration-300`}
          >
            {t("contactInfo.continue")}
            <ChevronRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactInfoPage;
