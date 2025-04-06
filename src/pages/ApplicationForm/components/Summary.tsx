import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ClipboardList, Pencil } from "lucide-react";
import { getApplicationData } from "../../../http/requests/applicator";

interface SummaryProps {
  onComplete: () => void;
  onEdit: (
    step:
      | "language"
      | "auth"
      | "marital"
      | "employment"
      | "workConditions"
      | "postEmployment"
      | "evidenceWitness"
  ) => void;
  onBack: () => void;
}

const Summary: React.FC<SummaryProps> = ({ onComplete, onEdit, onBack }) => {
  const { t } = useTranslation();
  const [applicationData, setApplicationData] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  const fetchApplicationData = async () => {
    setIsLoading(true);
    try {
      const response = await getApplicationData();
      if (response) {
        setApplicationData(response.applicationData);
      }
    } catch (err) {
      console.error("Error fetching application data:", err);
      setError("Veri alınırken bir hata oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicationData();
  }, []);

  const sections = [
    {
      step: 1,
      section: "marital",
      title: t("summary.sections.marital.title"),
      data: [
        { label: t("maritalStatus.status"), value: "Evli" },
        { label: t("maritalStatus.spouseName"), value: "John Doe" },
        { label: t("maritalStatus.hasChildren"), value: "Evet" },
      ],
    },
    {
      step: 2,
      section: "employment",
      title: t("summary.sections.employments.title"),
      data: [
        { label: t("employment.employerName"), value: "ABC Company" },
        { label: t("employment.position"), value: "Software Developer" },
        { label: t("employment.salary"), value: "$5000" },
      ],
    },
    {
      step: 3,
      section: "workConditions",
      title: t("summary.sections.workConditions.title"),
      data: [
        { label: t("workConditions.dailyHours"), value: "8" },
        { label: t("workConditions.weeklyDays"), value: "5" },
        { label: t("workConditions.supervisor"), value: "Jane Smith" },
      ],
    },
    {
      step: 4,
      section: "postEmployment",
      title: t("summary.sections.postEmployment.title"),
      data: [
        { label: t("postEmployment.hasWorked"), value: "Evet" },
        {
          label: t("postEmployment.currentEmployment.isWorking"),
          value: "Evet",
        },
        {
          label: t("postEmployment.currentEmployment.currentSalary"),
          value: "$6000",
        },
      ],
    },
    {
      step: 5,
      section: "evidenceWitness",
      title: t("summary.sections.evidenceWitness.title"),
      data: [
        { label: t("evidenceWitness.witnesses.hasWitnesses"), value: "Evet" },
        { label: t("evidenceWitness.witnesses.firstName"), value: "Alice" },
        { label: t("evidenceWitness.witnesses.lastName"), value: "Johnson" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#E2E0D6] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl w-full">
        <button
          onClick={onBack}
          className="text-[#292A2D] mb-6 flex items-center gap-1 hover:opacity-80 transition-opacity"
        >
          <ChevronLeft className="w-5 h-5" />
          {t("common.back")}
        </button>

        <div className="flex items-center justify-center mb-6">
          <ClipboardList className="w-12 h-12 text-[#292A2D]" />
        </div>

        <h1 className="text-3xl font-bold text-center text-[#292A2D] mb-2">
          {t("summary.title")}
        </h1>
        <p className="text-center text-gray-600 mb-8">
          {t("summary.subtitle")}
        </p>

        <div className="space-y-6">
          {sections.map((section) => (
            <div
              key={section.section}
              className="bg-gray-50 rounded-xl p-6 relative"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-[#292A2D]">
                  {section.title}
                </h2>
                <button
                  onClick={() => onEdit(section.section as any)}
                  className="text-[#292A2D] hover:opacity-80 transition-opacity flex items-center gap-2"
                >
                  <Pencil className="w-4 h-4" />
                  {t("summary.edit")}
                </button>
              </div>
              <div className="space-y-3">
                {section.data.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <span className="text-gray-600">{item.label}</span>
                    <span className="font-medium text-[#292A2D]">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={onComplete}
            className="w-full bg-[#292A2D] text-white py-4 rounded-xl font-medium hover:bg-opacity-90 transition-all duration-200"
          >
            {t("summary.submit")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Summary;
