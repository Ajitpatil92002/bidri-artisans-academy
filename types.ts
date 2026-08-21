
export enum AppView {
  LANDING = 'LANDING',
  COURSE_OVERVIEW = 'COURSE_OVERVIEW',
  LESSON_VIEW = 'LESSON_VIEW',
  ENROLLMENT_FORM = 'ENROLLMENT_FORM'
}

export interface EducationRow {
  qualification: string;
  boardUniversity: string;
  yearOfPassing: string;
  percentageCgpa: string;
}

export interface EnrollmentFormData {
  // Header
  applicationNo: string;
  date: string;
  photoUrl: string;

  // 1. Personal Information
  fullName: string;
  dob: string;
  fatherGuardianName: string;
  gender: 'Male' | 'Female' | 'Other' | '';
  maritalStatus: string;
  nationality: string;
  aadhaarNumber: string;
  panNumber: string;
  mobileNumber: string;
  emailId: string;
  whatsappNumber: string;

  // 2. Address Details
  permanentAddress: string;
  permanentCity: string;
  permanentDistrict: string;
  permanentState: string;
  permanentPin: string;
  sameAsPermanent: boolean;
  correspondenceAddress: string;
  correspondenceCity: string;
  correspondenceDistrict: string;
  correspondenceState: string;
  correspondencePin: string;

  // 3. Emergency Contact Details (Section 2 in Image)
  emergencyContactName: string;
  emergencyRelationship: string;
  emergencyMobile: string;
  emergencyAltMobile: string;

  // 4. KYC / Govt ID Details
  kycAadhaarNumber: string;
  idProofType: string;
  idProofOtherText: string;
  idProofNumber: string;
  idProofAttached: boolean;

  // 5. Educational Details (Section 3 in Image)
  educationList: EducationRow[];

  // 6. Training Interest & Experience
  courseApplyingFor: 'Basic' | 'Intermediate' | 'Advanced' | '';
  preferredBatchTiming: string[];
  priorExperience: 'Yes' | 'No' | '';
  priorExperienceDetails: string;
  sourceOfInfo: string;

  // 7. Technology & Skills Interest
  interestedSkills: string[];
  basicComputerKnowledge: 'Yes' | 'No' | '';

  // 8. Declaration
  declarationPlace: string;
  declarationDate: string;
  signatureDataUrl: string;
  applicantSignatureName: string;

  // 9. Documents Checklist
  checklistPhoto: boolean;
  checklistAadhaar: boolean;
  checklistEducation: boolean;
  checklistAddressProof: boolean;
  checklistIdProof: boolean;
  checklistOther: boolean;
  checklistOtherText: string;

  // For Office Use Only
  officeApplicationReceivedOn: string;
  officeVerifiedBy: string;
  officeDocumentsVerified: boolean | null;
  officeEligible: boolean | null;
  officeEnrollmentApprovedBy: string;
  officeBatchAllotted: string;
  officeEnrollmentDate: string;
}


export interface ContentSection {
  type: 'text' | 'image' | 'list' | 'heading';
  content: string;
  items?: string[];
  caption?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: number;
  image: string;
  contentSections: ContentSection[];
  keyMaterials?: string[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  image: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  modules: Module[];
}
