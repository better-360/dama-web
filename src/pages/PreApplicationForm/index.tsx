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
import { useAppSelector } from "../../store/hooks";

export default function PreApplicationForm() {
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
  const [contactInfo, setContactInfo] = useState<{
    firstName: string;
    lastName: string;
    email?: string;
  } | null>(null);
  const [incidentDescription, setIncidentDescription] = useState("");
  const [passportFiles, setPassportFiles] = useState<File[]>([]);
  const [employmentFiles, setEmploymentFiles] = useState<File[]>([]);
  const [recognitionInfo, setRecognitionInfo] = useState<{
    hasDocuments: boolean;
    files: File[];
  }>({ hasDocuments: false, files: [] });
  const [paymentFiles, setPaymentFiles] = useState<File[]>([]);
  const applicatorData=useAppSelector((state)=>state.applicator.applicatorData);
  
  const handleSubmitApplication = () => {
    // Here you would typically send the data to your backend
    setCurrentPage("success");
  };

  const handleUpdateData = (
    newData: Partial<{
      contactInfo: { firstName: string; lastName: string; email?: string };
      incidentDescription: string;
      passportFiles: File[];
      employmentFiles: File[];
      recognitionInfo: { hasDocuments: boolean; files: File[] };
      paymentFiles: File[];
    }>
  ) => {
    if (newData.contactInfo) {
      setContactInfo(newData.contactInfo);
    }
    if (newData.incidentDescription) {
      setIncidentDescription(newData.incidentDescription);
    }
    if (newData.passportFiles) {
      setPassportFiles(newData.passportFiles);
    }
    if (newData.employmentFiles) {
      setEmploymentFiles(newData.employmentFiles);
    }
    if (newData.recognitionInfo) {
      setRecognitionInfo(newData.recognitionInfo);
    }
    if (newData.paymentFiles) {
      setPaymentFiles(newData.paymentFiles);
    }
  };

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
            onBack={() => setCurrentPage("requirements")}
            onContinue={(info) => {
              setContactInfo(info);
              setCurrentPage("incident");
            }}
          />
        );
      case "incident":
        return (
          <IncidentForm
            onBack={() => setCurrentPage("contact")}
            onContinue={(description) => {
              setIncidentDescription(description);
              setCurrentPage("passport");
            }}
          />
        );
      case "passport":
        return (
          <PassportUpload
            onBack={() => setCurrentPage("incident")}
            onContinue={(files) => {
              setPassportFiles(files);
              setCurrentPage("employment");
            }}
          />
        );
      case "employment":
        return (
          <EmploymentUpload
            onBack={() => setCurrentPage("passport")}
            onContinue={(files) => {
              setEmploymentFiles(files);
              setCurrentPage("recognition");
            }}
          />
        );
      case "recognition":
        return (
          <RecognitionUpload
            onBack={() => setCurrentPage("employment")}
            onContinue={(hasDocuments, files) => {
              setRecognitionInfo({ hasDocuments, files });
              setCurrentPage("payment");
            }}
          />
        );
      case "payment":
        return (
          <PaymentUpload
            onBack={() => setCurrentPage("recognition")}
            onContinue={(files) => {
              setPaymentFiles(files);
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
              contactInfo: contactInfo!,
              incidentDescription,
              passportFiles,
              employmentFiles,
              recognitionInfo,
              paymentFiles,
            }}
            onUpdateData={handleUpdateData}
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
