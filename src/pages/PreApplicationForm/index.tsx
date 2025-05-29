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
import { PreApplicationProvider, usePreApplication } from "./context/PreApplicationContext";

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
            initialDescription={state.incidentDescription}
            initialFiles={state.incidentFiles}
            onBack={() => setCurrentPage("contact")}
            onContinue={(description, fileUrls) => {
              actions.setIncidentDescription(description);
              actions.setIncidentFiles(fileUrls);
              setCurrentPage("passport");
            }}
          />
        );
      case "passport":
        return (
          <PassportUpload
            initialFiles={state.passportFiles}
            onBack={() => setCurrentPage("incident")}
            onContinue={(fileUrls) => {
              actions.setPassportFiles(fileUrls);
              setCurrentPage("employment");
            }}
          />
        );
      case "employment":
        return (
          <EmploymentUpload
            initialFiles={state.employmentFiles}
            onBack={() => setCurrentPage("passport")}
            onContinue={(fileUrls) => {
              actions.setEmploymentFiles(fileUrls);
              setCurrentPage("recognition");
            }}
          />
        );
      case "recognition":
        return (
          <RecognitionUpload
            initialData={state.recognitionInfo}
            onBack={() => setCurrentPage("employment")}
            onContinue={(hasDocuments, fileUrls) => {
              actions.setRecognitionInfo({ hasDocuments, files: fileUrls });
              setCurrentPage("payment");
            }}
          />
        );
      case "payment":
        return (
          <PaymentUpload
            initialFiles={state.paymentFiles}
            onBack={() => setCurrentPage("recognition")}
            onContinue={(fileUrls) => {
              actions.setPaymentFiles(fileUrls);
              setCurrentPage("summary");
            }}
          />
        );
      case "summary":
        return (
          <ApplicationSummary
            onBack={() => setCurrentPage("payment")}
            onSubmit={handleSubmitApplication}
            data={{
              contactInfo: state.contactInfo || { firstName: '', lastName: '', email: '' },
              incidentDescription: state.incidentDescription || '',
              incidentFiles: state.incidentFiles || [],
              passportFiles: state.passportFiles || [],
              employmentFiles: state.employmentFiles || [],
              recognitionInfo: state.recognitionInfo || { hasDocuments: false, files: [] },
              paymentFiles: state.paymentFiles || [],
            }}
            onUpdateData={(newData) => {
              if (newData.contactInfo) {
                actions.setContactInfo(newData.contactInfo);
              }
              if (newData.incidentDescription !== undefined) {
                actions.setIncidentDescription(newData.incidentDescription);
              }
              if (newData.incidentFiles) {
                actions.setIncidentFiles(newData.incidentFiles);
              }
              if (newData.passportFiles) {
                actions.setPassportFiles(newData.passportFiles);
              }
              if (newData.employmentFiles) {
                actions.setEmploymentFiles(newData.employmentFiles);
              }
              if (newData.recognitionInfo) {
                actions.setRecognitionInfo(newData.recognitionInfo);
              }
              if (newData.paymentFiles) {
                actions.setPaymentFiles(newData.paymentFiles);
              }
            }}
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
