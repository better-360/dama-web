import { useState } from "react";
import IntroPage from "./components/IntroPage";
import RequirementsPage from "./components/RequirementsPage";
import ContactInfoPage from "./components/ContactInfoPage";
import IncidentForm from "./components/IncidentForm";
import PassportUpload from "./components/PassportUpload";
import EmploymentUpload from "./components/EmploymentUpload";
import RecognitionUpload from "./components/RecognitionUpload";
import PaymentUpload from "./components/PaymentUpload";
import ApplicationSummary from "./components/ApplicationSummary";
import SuccessPage from "./components/SuccessPage";
import LanguageSelector from "../../components/LanguageSelector";
import { completeApplication } from "../../http/requests/applicator";
import { ApplicationType } from "../../types/form";
import { PreApplicationProvider, usePreApplication, ContactInfo } from "./context/PreApplicationContext";

// Page navigation logic separated into its own component
function PreApplicationFormContent() {
  const { state, actions } = usePreApplication();
  const [currentPage, setCurrentPage] = useState<
    | "intro"
    | "requirements"
    | "contact"
    | "incident"
    | "passport"
    | "employment"
    | "recognition"
    | "payment"
    | "summary"
    | "success"
  >("intro");
  
  const handleSubmitApplication = async () => {
    try {
      await completeApplication(ApplicationType.PRE_APPLICATION);
      setCurrentPage("success");
    } catch (error) {
      console.error("Error submitting application:", error);
      // Handle error appropriately
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
            onClick={actions.loadData}
            className="bg-[#292A2D] text-white px-4 py-2 rounded-lg hover:bg-opacity-90"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case "intro":
        return (
          <IntroPage onNewApplication={() => setCurrentPage("requirements")} />
        );
      case "requirements":
        return (
          <RequirementsPage
            onBack={() => setCurrentPage("intro")}
            onContinue={() => setCurrentPage("contact")}
          />
        );
      case "contact":
        return (
          <ContactInfoPage
            initialData={state.contactInfo}
            onBack={() => setCurrentPage("requirements")}
            onContinue={(info) => {
              actions.setContactInfo(info);
              setCurrentPage("incident");
            }}
          />
        );
      case "incident":
        return (
          <IncidentForm
            onBack={() => setCurrentPage("contact")}
            onContinue={() => setCurrentPage("passport")}
          />
        );
      case "passport":
        return (
          <PassportUpload
            onBack={() => setCurrentPage("incident")}
            onContinue={() => setCurrentPage("employment")}
          />
        );
      case "employment":
        return (
          <EmploymentUpload
            onBack={() => setCurrentPage("passport")}
            onContinue={() => setCurrentPage("recognition")}
          />
        );
      case "recognition":
        return (
          <RecognitionUpload
            onBack={() => setCurrentPage("employment")}
            onContinue={() => setCurrentPage("payment")}
          />
        );
      case "payment":
        return (
          <PaymentUpload
            onBack={() => setCurrentPage("recognition")}
            onContinue={() => setCurrentPage("summary")}
          />
        );
      case "summary":
        return (
          <ApplicationSummary
            onBack={() => setCurrentPage("payment")}
            onSubmit={handleSubmitApplication}
          />
        );
      case "success":
        return <SuccessPage />;
      default:
        return <LanguageSelector onContinue={() => setCurrentPage("intro")} />;
    }
  };

  return renderPage();
}

// Main component wrapped with Provider
export default function PreApplicationForm() {
  return (
    <PreApplicationProvider>
      <PreApplicationFormContent />
    </PreApplicationProvider>
  );
}
