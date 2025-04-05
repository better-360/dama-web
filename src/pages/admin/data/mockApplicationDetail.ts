import type { ApplicationDetail } from '../types/applicationDetail';

export const mockApplicationDetail: ApplicationDetail = {
  id: "34437de4-48d2-4113-a072-95fb35a9f697",
  pplicationNumber: "APP-10560266",
  preApplicationData: [
    {
      data: {
        email: "uguratakansurmeli@gmail.com",
        lastName: "Sürmeli",
        firstName: "Uğur Atakan"
      },
      step: 1,
      section: "contact"
    },
    {
      data: {
        incidentDescription: "Dolor pariatur ex culpa aute sint Lorem. Dolore aliquip nulla ut laboris cupidatat nostrud eiusmod exercitation sit commodo non reprehenderit ut. Mollit eu in aliquip officia adipisicing do elit proident irure do anim commodo consectetur esse."
      },
      step: 2,
      section: "incident"
    },
    {
      data: {
        passportFiles: [
          "http://file1link.com",
          "http://file2link.com",
          "http://example.com"
        ]
      },
      step: 3,
      section: "passport"
    },
    {
      data: {
        employmentFiles: [
          "http://file1link.com",
          "http://file2link.com",
          "http://example.com"
        ]
      },
      step: 4,
      section: "employment"
    },
    {
      data: {
        files: [
          "http://file1link.com/1.png",
          "http://file2link.com",
          "http://example.com"
        ],
        hasDocuments: true
      },
      step: 5,
      section: "recognition"
    },
    {
      data: {
        paymentFiles: [
          "http://file1link.com/1.png",
          "http://file2link.com",
          "http://example.com"
        ]
      },
      step: 6,
      section: "payment"
    }
  ],
  applicationData: [
    {
      data: {
        children: [
          {
            name: "Ali",
            birthDate: "22-12-2024"
          },
          {
            name: "Ayşe",
            birthDate: "1-1-2020"
          }
        ],
        spouseName: "Johannes Does",
        hasChildren: true,
        maritalStatus: "married"
      },
      step: 1,
      section: "marital"
    },
    {
      data: {
        salary: "123",
        position: "Adam",
        startDate: "123",
        hasContract: true,
        contractFile: "http://exampledosya.acom",
        employerName: "Beter AŞ",
        isContractor: false,
        totalCompensation: "12310",
        isMultiplePayments: false
      },
      step: 2,
      section: "employment"
    },
    {
      data: {
        bases: "Bu alan string veri içeriyor",
        dailyHours: "12",
        weeklyDays: "5",
        lastWorkDate: "20-12-2009",
        supervisorName: "Haktan Yakan"
      },
      step: 3,
      section: "workConditions"
    },
    {
      data: {
        hasWorked: true,
        lastSalary: "110000 USD",
        previousJobs: [
          {
            company: "ABC Technologies",
            endDate: "2020-08-15",
            startDate: "2019-03-01"
          },
          {
            company: "XYZ Innovations",
            endDate: "2022-12-31",
            startDate: "2020-09-01"
          }
        ],
        currentSalary: "120000 USD",
        currentCompany: "Modern Tech Inc.",
        isCurrentlyWorking: false
      },
      step: 4,
      section: "postEmployment"
    },
    {
      data: {
        witnesses: [
          {
            lastName: "Technologies",
            firstName: "ABC"
          },
          {
            lastName: "Oğuz",
            firstName: "Alper "
          }
        ],
        hasWitnesses: true,
        evidenceLinks: [
          "instagmra.com/asdasdas",
          "youtube.com/daksadksakd"
        ]
      },
      step: 5,
      section: "evidenceWitness"
    }
  ],
  createdAt: "2025-03-25T23:59:43.321Z",
  updatedAt: "2025-03-26T01:29:52.953Z"
};