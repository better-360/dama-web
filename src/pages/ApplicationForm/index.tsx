import { useState } from "react";
import MaritalStatus from "./components/MaritalStatus";
import EmploymentInfo from "./components/EmploymentInfo";
import WorkConditions from "./components/WorkConditions";
import PostEmployment from "./components/PostEmployment";
import EvidenceWitness from "./components/EvidenceWitness";
import Summary from "./components/Summary";
import SubmissionComplete from "./components/SubmissionComplete";
import IntroPage from "./components/IntroPage";
import RequirementsPage from "./components/RequirementsPage";
import { useAppSelector } from "../../store/hooks";

export default function ApplicationForm() {
      const applicatorData=useAppSelector((state)=>state.applicator.applicatorData);
  
  const [currentStep, setCurrentStep] = useState<
    | "intro"
    | "requirements"
    | "marital"
    | "employment"
    | "workConditions"
    | "postEmployment"
    | "evidenceWitness"
    | "summary"
    | "complete"
  >("intro");

  const handleBack = () => {
    switch (currentStep) {
      case "requirements":
        setCurrentStep("intro");
        break;
      case "marital":
        setCurrentStep("requirements");
        break;
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

  if (currentStep === "intro") {
    return <IntroPage onComplete={() => setCurrentStep("requirements")} />;
  }

  if (currentStep === "requirements") {
    return (
      <RequirementsPage
        onContinue={() => setCurrentStep("marital")}
        onBack={handleBack}
      />
    );
  }

  if (currentStep === "marital") {
    return (
      <MaritalStatus
        onComplete={() => setCurrentStep("employment")}
        onBack={handleBack}
      />
    );
  }

  if (currentStep === "employment") {
    return (
      <EmploymentInfo
        onComplete={() => setCurrentStep("workConditions")}
        onBack={handleBack}
      />
    );
  }

  if (currentStep === "workConditions") {
    return (
      <WorkConditions
        onComplete={() => setCurrentStep("postEmployment")}
        onBack={handleBack}
      />
    );
  }

  if (currentStep === "postEmployment") {
    return (
      <PostEmployment
        onComplete={() => setCurrentStep("evidenceWitness")}
        onBack={handleBack}
      />
    );
  }

  if (currentStep === "evidenceWitness") {
    return (
      <EvidenceWitness
        onComplete={() => setCurrentStep("summary")}
        onBack={handleBack}
      />
    );
  }

  if (currentStep === "summary") {
    return (
      <Summary
        onComplete={() => setCurrentStep("complete")}
        onEdit={(step) => setCurrentStep(step as any)}
        onBack={handleBack}
      />
    );
  }

  return <SubmissionComplete />;
}
