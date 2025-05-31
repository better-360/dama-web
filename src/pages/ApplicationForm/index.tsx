import { useState } from "react";
import { completeApplication } from "../../http/requests/applicator";
import MaritalStatus from "./components/MaritalStatus";
import EmploymentInfo from "./components/EmploymentInfo";
import WorkConditions from "./components/WorkConditions";
import PostEmployment from "./components/PostEmployment";
import EvidenceWitness from "./components/EvidenceWitness";
import Summary from "./components/Summary";
import SubmissionComplete from "./components/SubmissionComplete";
import { ApplicationType } from "../../types/form";
import { ApplicationProvider, useApplication } from "./context/ApplicationContext";
import "react-datepicker/dist/react-datepicker.css";

// Define interfaces for each form section
interface Child {
  id: string;
  name: string;
  birthDate: string;
}

interface MaritalData {
  maritalStatus: "single" | "married" | null;
  spouseName: string;
  hasChildren: boolean | null;
  children: Child[];
}

interface EmploymentData {
  employerName: string;
  position: string;
  salary: string;
  startDate: string;
  hasContract: boolean | null;
  contractFile: string | undefined;
  isContractor: boolean;
  totalCompensation: string;
  isMultiplePayments: boolean;
}

interface WorkConditionsData {
  dailyHours: string;
  weeklyDays: string;
  supervisorName: string;
  lastWorkDate: string;
  bases: string;
  loaFile: string | undefined;
}

interface PostEmploymentData {
  hasWorked: boolean | null;
  previousJobs: any[];
  isCurrentlyWorking: boolean | null;
}

interface EvidenceWitnessData {
  hasWitnesses: boolean | null;
  witnesses: any[];
  evidenceLinks: any[];
}

// Combined application data
export interface ApplicationData {
  marital: MaritalData;
  employment: EmploymentData;
  workConditions: WorkConditionsData;
  postEmployment: PostEmploymentData;
  evidenceWitness: EvidenceWitnessData;
}

type FormStep =
  | "requirements"
  | "marital"
  | "employment"
  | "workConditions"
  | "postEmployment"
  | "evidenceWitness"
  | "summary"
  | "complete";

function ApplicationFormContent() {
  const { state } = useApplication();
  const [currentStep, setCurrentStep] = useState<FormStep>("marital");

  const handleCompleteForm = async () => {
    await completeApplication(ApplicationType.APPLICATION);
    setCurrentStep("complete");
  };

  const handleBack = () => {
    switch (currentStep) {
      case "employment":
        setCurrentStep("marital");
        break;
      case "workConditions":
        setCurrentStep("employment");
        break;
      case "postEmployment":
        setCurrentStep("workConditions");
        break;
      case "evidenceWitness":
        setCurrentStep("postEmployment");
        break;
      case "summary":
        setCurrentStep("evidenceWitness");
        break;
    }
  };

  // Show loading state
  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-[#E2E0D6] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#292A2D]"></div>
          <p className="mt-4 text-[#292A2D] font-medium">Veriler yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (state.error) {
    return (
      <div className="min-h-screen bg-[#E2E0D6] flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md text-center">
          <p className="text-red-500 mb-4">{state.error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#292A2D] text-white px-4 py-2 rounded-lg hover:bg-opacity-90"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case "marital":
        return (
          <MaritalStatus
            onComplete={() => setCurrentStep("employment")}
            onBack={handleBack}
          />
        );
      case "employment":
        return (
          <EmploymentInfo
            onComplete={() => setCurrentStep("workConditions")}
            onBack={handleBack}
          />
        );
      case "workConditions":
        return (
          <WorkConditions
            onComplete={() => setCurrentStep("postEmployment")}
            onBack={handleBack}
          />
        );
      case "postEmployment":
        return (
          <PostEmployment
            onComplete={() => setCurrentStep("evidenceWitness")}
            onBack={handleBack}
          />
        );
      case "evidenceWitness":
        return (
          <EvidenceWitness
            onComplete={() => setCurrentStep("summary")}
            onBack={handleBack}
          />
        );
      case "summary":
        return (
          <Summary
            onComplete={handleCompleteForm}
            onEdit={(step) => setCurrentStep(step as FormStep)}
            onBack={handleBack}
          />
        );
      case "complete":
        return <SubmissionComplete />;
      default:
        return null;
    }
  };

  return renderStep();
}

// Main component wrapped with Provider
export default function ApplicationForm() {
  return (
    <ApplicationProvider>
      <ApplicationFormContent />
    </ApplicationProvider>
  );
}
