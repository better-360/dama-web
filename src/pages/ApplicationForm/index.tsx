import { useState, useEffect } from "react";
import {
  completeApplication,
  getApplicationData,
  updateApplicationSection,
} from "../../http/requests/applicator";
import MaritalStatus from "./components/MaritalStatus";
import EmploymentInfo from "./components/EmploymentInfo";
import WorkConditions from "./components/WorkConditions";
import PostEmployment from "./components/PostEmployment";
import EvidenceWitness from "./components/EvidenceWitness";
import Summary from "./components/Summary";
import SubmissionComplete from "./components/SubmissionComplete";
import RequirementsPage from "./components/RequirementsPage";
import { ApplicationType } from "../../types/form";
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
interface ApplicationData {
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

export default function ApplicationForm() {
  const [currentStep, setCurrentStep] = useState<FormStep>("requirements");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); 

  // Initialize form data with empty values
  const [formData, setFormData] = useState<ApplicationData>({
    marital: {
      maritalStatus: null,
      spouseName: "",
      hasChildren: null,
      children: [],
    },
    employment: {
      employerName: "",
      position: "",
      salary: "",
      startDate: "",
      hasContract: false,
      contractFile: "",
      isContractor: false,
      totalCompensation: "",
      isMultiplePayments: false,
    },
    workConditions: {
      dailyHours: "",
      weeklyDays: "",
      supervisorName: "",
      lastWorkDate: "",
      bases: "",
    },
    postEmployment: {
      hasWorked: null,
      previousJobs: [],
      isCurrentlyWorking: null,
    },
    evidenceWitness: {
      hasWitnesses: null,
      witnesses: [],
      evidenceLinks: [],
    },
  });

  useEffect(() => {
    console.log("formdata değişti", formData);
  }, [formData]);

  // Fetch existing data on initial load
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getApplicationData();
        if (response && response.applicationData) {
          // Transform the API response to our data structure
          const apiData = response.applicationData;
          const newFormData = { ...formData };

          apiData.forEach((section: any) => {
            if (section.section && section.data) {
              switch (section.section) {
                case "marital":
                  newFormData.marital = section.data;
                  break;
                case "employment":
                  newFormData.employment = section.data;
                  break;
                case "workConditions":
                  newFormData.workConditions = section.data;
                  break;
                case "postEmployment":
                  newFormData.postEmployment = section.data;
                  break;
                case "evidenceWitness":
                  newFormData.evidenceWitness = section.data;
                  break;
              }
            }
          });

          setFormData(newFormData);
        }
      } catch (err) {
        console.error("Error fetching application data:", err);
        setError("Failed to load application data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Generic function to update a specific section of the form data
  const updateFormSection = <T extends keyof ApplicationData>(
    section: T,
    data: Partial<ApplicationData[T]>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...data,
      },
    }));
  };

  // Function to save a section to the API
  const saveSection = async (
    section: keyof ApplicationData,
    stepNumber: number
  ) => {
    try {
      const sectionData = {
        step: stepNumber,
        section: section,
        data: formData[section],
      };

      console.log(`Saving section ${section}:`, sectionData);
      await updateApplicationSection(sectionData);
    } catch (err) {
      console.error(`Error saving ${section} data:`, err);
      // Optionally handle error state
    }
  };

  const handleCompleteForm = async () => {
    await completeApplication(ApplicationType.APPLICATION);
    setCurrentStep("complete");
  };

  const handleBack = () => {
    switch (currentStep) {
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#E2E0D6] flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#E2E0D6] flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#292A2D] text-white px-4 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
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
        formData={formData.marital}
        updateFormData={(data) => updateFormSection("marital", data)}
        onComplete={() => {
          saveSection("marital", 1);
          setCurrentStep("employment");
        }}
        onBack={handleBack}
      />
    );
  }

  // In ApplicationForm.tsx, modify the employment section:

  if (currentStep === "employment") {
    return (
      <EmploymentInfo
        formData={formData.employment}
        updateFormData={(data) => updateFormSection("employment", data)}
        onComplete={(updatedData) => {
          // If we have complete updated data with contract file
          if (updatedData) {
            console.log("Received complete updated data:", updatedData);

            // Update form data in state
            updateFormSection("employment", updatedData);

            // Instead of using setTimeout and saveSection, directly send the updated data
            const sectionData = {
              step: 2,
              section: "employment",
              data: updatedData, // Use the updatedData directly instead of formData.employment
            };

            console.log("Sending data to server:", sectionData);

            // Send the API request with the updated data
            updateApplicationSection(sectionData)
              .then(() => {
                console.log(
                  "Successfully saved employment data with contract file"
                );
                setCurrentStep("workConditions");
              })
              .catch((err) => {
                console.error("Error saving employment data:", err);
                // Handle error appropriately
              });
          } else {
            // Fallback to using current state if no updated data provided
            saveSection("employment", 2);
            setCurrentStep("workConditions");
          }
        }}
        onBack={handleBack}
      />
    );
  }

  if (currentStep === "workConditions") {
    return (
      <WorkConditions
        formData={formData.workConditions}
        updateFormData={(data) => updateFormSection("workConditions", data)}
        onComplete={(updatedData) => {
          // If we have complete updated data
          if (updatedData) {
            console.log("Received complete work conditions data:", updatedData);

            // Update form data in state
            updateFormSection("workConditions", updatedData);

            // Send the updated data directly to API
            const sectionData = {
              step: 3,
              section: "workConditions",
              data: updatedData, // Use the updatedData directly
            };

            console.log("Sending work conditions data to server:", sectionData);

            // Send the API request with the updated data
            updateApplicationSection(sectionData)
              .then(() => {
                console.log(
                  "Successfully saved work conditions data with LOA file"
                );
                setCurrentStep("postEmployment");
              })
              .catch((err) => {
                console.error("Error saving work conditions data:", err);
                // Handle error appropriately
              });
          } else {
            // Fallback to using current state if no updated data provided
            saveSection("workConditions", 3);
            setCurrentStep("postEmployment");
          }
        }}
        onBack={handleBack}
      />
    );
  }

  if (currentStep === "postEmployment") {
    return (
      <PostEmployment
        formData={formData.postEmployment}
        updateFormData={(data) => updateFormSection("postEmployment", data)}
        onComplete={() => {
          saveSection("postEmployment", 4);
          setCurrentStep("evidenceWitness");
        }}
        onBack={handleBack}
      />
    );
  }

  if (currentStep === "evidenceWitness") {
    return (
      <EvidenceWitness
        formData={formData.evidenceWitness}
        updateFormData={(data) => updateFormSection("evidenceWitness", data)}
        onComplete={() => {
          saveSection("evidenceWitness", 5);
          setCurrentStep("summary");
        }}
        onBack={handleBack}
      />
    );
  }

  if (currentStep === "summary") {
    return (
      <Summary
        applicationData={formData}
        onComplete={handleCompleteForm}
        onEdit={(step) => setCurrentStep(step as any)}
        onBack={handleBack}
      />
    );
  }

  return <SubmissionComplete />;
}
