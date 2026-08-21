import React, { useState, useRef, useEffect } from 'react';
import { AppView, EnrollmentFormData, EducationRow } from '../types';

interface EnrollmentFormProps {
  onBack: () => void;
  initialCourseLevel?: 'Basic' | 'Intermediate' | 'Advanced';
}

const DEFAULT_EDUCATION: EducationRow[] = [
  { qualification: '10th / Equivalent', boardUniversity: '', yearOfPassing: '', percentageCgpa: '' },
  { qualification: '12th / Equivalent', boardUniversity: '', yearOfPassing: '', percentageCgpa: '' },
  { qualification: 'Diploma / ITI (If any)', boardUniversity: '', yearOfPassing: '', percentageCgpa: '' },
  { qualification: 'Graduation (If any)', boardUniversity: '', yearOfPassing: '', percentageCgpa: '' },
  { qualification: 'Post Graduation (If any)', boardUniversity: '', yearOfPassing: '', percentageCgpa: '' },
];

const INITIAL_FORM_DATA: EnrollmentFormData = {
  applicationNo: 'GNJ-BA-' + Math.floor(1000 + Math.random() * 9000),
  date: new Date().toISOString().split('T')[0],
  photoUrl: '',

  fullName: '',
  dob: '',
  fatherGuardianName: '',
  gender: '',
  maritalStatus: 'Unmarried',
  nationality: 'Indian',
  aadhaarNumber: '',
  panNumber: '',
  mobileNumber: '',
  emailId: '',
  whatsappNumber: '',

  permanentAddress: '',
  permanentCity: '',
  permanentDistrict: '',
  permanentState: 'Karnataka',
  permanentPin: '',
  sameAsPermanent: true,
  correspondenceAddress: '',
  correspondenceCity: '',
  correspondenceDistrict: '',
  correspondenceState: 'Karnataka',
  correspondencePin: '',

  emergencyContactName: '',
  emergencyRelationship: '',
  emergencyMobile: '',
  emergencyAltMobile: '',

  kycAadhaarNumber: '',
  idProofType: 'Aadhaar',
  idProofOtherText: '',
  idProofNumber: '',
  idProofAttached: false,

  educationList: DEFAULT_EDUCATION,

  courseApplyingFor: 'Basic',
  preferredBatchTiming: ['Morning'],
  priorExperience: 'No',
  priorExperienceDetails: '',
  sourceOfInfo: 'Social Media / Website',

  interestedSkills: ['CAD / Design Software', '3D Printing'],
  basicComputerKnowledge: 'Yes',

  declarationPlace: 'Bidar',
  declarationDate: new Date().toISOString().split('T')[0],
  signatureDataUrl: '',
  applicantSignatureName: '',

  checklistPhoto: true,
  checklistAadhaar: true,
  checklistEducation: true,
  checklistAddressProof: true,
  checklistIdProof: true,
  checklistOther: false,
  checklistOtherText: '',

  officeApplicationReceivedOn: new Date().toISOString().split('T')[0],
  officeVerifiedBy: 'Admissions Desk',
  officeDocumentsVerified: true,
  officeEligible: true,
  officeEnrollmentApprovedBy: 'Director / Coordinator',
  officeBatchAllotted: 'Batch 2026-A1',
  officeEnrollmentDate: new Date().toISOString().split('T')[0],
};

const EnrollmentForm: React.FC<EnrollmentFormProps> = ({ onBack, initialCourseLevel }) => {
  const [formData, setFormData] = useState<EnrollmentFormData>(() => {
    const saved = localStorage.getItem('bidri_enrollment_draft');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (initialCourseLevel) parsed.courseApplyingFor = initialCourseLevel;
        return parsed;
      } catch (e) {
        console.error('Error loading draft', e);
      }
    }
    return {
      ...INITIAL_FORM_DATA,
      courseApplyingFor: initialCourseLevel || 'Basic',
    };
  });

  const [mode, setMode] = useState<'selection' | 'online_form' | 'offline_download' | 'official_preview'>('online_form');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const sigCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Auto-save draft
  useEffect(() => {
    localStorage.setItem('bidri_enrollment_draft', JSON.stringify(formData));
  }, [formData]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleInputChange = (field: keyof EnrollmentFormData, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'sameAsPermanent' && value) {
        updated.correspondenceAddress = prev.permanentAddress;
        updated.correspondenceCity = prev.permanentCity;
        updated.correspondenceDistrict = prev.permanentDistrict;
        updated.correspondenceState = prev.permanentState;
        updated.correspondencePin = prev.permanentPin;
      }
      return updated;
    });
  };

  const handleEducationChange = (index: number, field: keyof EducationRow, val: string) => {
    setFormData((prev) => {
      const list = [...prev.educationList];
      list[index] = { ...list[index], [field]: val };
      return { ...prev, educationList: list };
    });
  };

  const toggleBatchTiming = (timing: string) => {
    setFormData((prev) => {
      const exists = prev.preferredBatchTiming.includes(timing);
      const newTimings = exists
        ? prev.preferredBatchTiming.filter((t) => t !== timing)
        : [...prev.preferredBatchTiming, timing];
      return { ...prev, preferredBatchTiming: newTimings };
    });
  };

  const toggleSkill = (skill: string) => {
    setFormData((prev) => {
      const exists = prev.interestedSkills.includes(skill);
      const newSkills = exists
        ? prev.interestedSkills.filter((s) => s !== skill)
        : [...prev.interestedSkills, skill];
      return { ...prev, interestedSkills: newSkills };
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        handleInputChange('photoUrl', reader.result as string);
        showToast('Photograph attached successfully!');
      };
      reader.readAsDataURL(file);
    }
  };

  // Canvas drawing signature
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1e3a8a';
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const endDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = sigCanvasRef.current;
    if (canvas) {
      handleInputChange('signatureDataUrl', canvas.toDataURL('image/png'));
    }
  };

  const clearSignature = () => {
    const canvas = sigCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    handleInputChange('signatureDataUrl', '');
  };

  const handleAutofillDemo = () => {
    const demoData: EnrollmentFormData = {
      ...INITIAL_FORM_DATA,
      applicationNo: 'GNJ-BA-2026-0842',
      date: '2026-08-21',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      fullName: 'RAHUL PATIL',
      dob: '2001-05-14',
      fatherGuardianName: 'ANAND PATIL',
      gender: 'Male',
      maritalStatus: 'Unmarried',
      nationality: 'Indian',
      aadhaarNumber: '7845 9210 3345',
      panNumber: 'ABCDE1234F',
      mobileNumber: '9845012345',
      emailId: 'rahul.patil@example.com',
      whatsappNumber: '9845012345',
      permanentAddress: 'Plot No. 45, Near Gurudwara Nanak Jhira Sahib',
      permanentCity: 'Bidar',
      permanentDistrict: 'Bidar',
      permanentState: 'Karnataka',
      permanentPin: '585401',
      sameAsPermanent: true,
      correspondenceAddress: 'Plot No. 45, Near Gurudwara Nanak Jhira Sahib',
      correspondenceCity: 'Bidar',
      correspondenceDistrict: 'Bidar',
      correspondenceState: 'Karnataka',
      correspondencePin: '585401',
      emergencyContactName: 'Anand Patil',
      emergencyRelationship: 'Father',
      emergencyMobile: '9448098765',
      emergencyAltMobile: '08482-223344',
      kycAadhaarNumber: '7845 9210 3345',
      idProofType: 'Aadhaar',
      idProofOtherText: '',
      idProofNumber: '7845 9210 3345',
      idProofAttached: true,
      educationList: [
        { qualification: '10th / Equivalent', boardUniversity: 'KSEEB Bengaluru', yearOfPassing: '2017', percentageCgpa: '86.4%' },
        { qualification: '12th / Equivalent', boardUniversity: 'Dept of PUE Karnataka', yearOfPassing: '2019', percentageCgpa: '82.0%' },
        { qualification: 'Diploma / ITI (If any)', boardUniversity: 'Govt Polytechnic Bidar', yearOfPassing: '2022', percentageCgpa: '8.4 CGPA' },
        { qualification: 'Graduation (If any)', boardUniversity: 'VTU Belagavi', yearOfPassing: '2025', percentageCgpa: '7.9 CGPA' },
        { qualification: 'Post Graduation (If any)', boardUniversity: '-', yearOfPassing: '-', percentageCgpa: '-' },
      ],
      courseApplyingFor: 'Intermediate',
      preferredBatchTiming: ['Morning', 'Weekend'],
      priorExperience: 'Yes',
      priorExperienceDetails: 'Basic metal casting and chiseling practice with local artisans',
      sourceOfInfo: 'GNJERBIF Campus & Website',
      interestedSkills: ['CAD / Design Software', 'CNC / Laser Engraving', 'Digital Marketing for Artisans'],
      basicComputerKnowledge: 'Yes',
      declarationPlace: 'Bidar',
      declarationDate: '2026-08-21',
      signatureDataUrl: '',
      applicantSignatureName: 'Rahul Patil',
      checklistPhoto: true,
      checklistAadhaar: true,
      checklistEducation: true,
      checklistAddressProof: true,
      checklistIdProof: true,
      checklistOther: false,
      checklistOtherText: '',
      officeApplicationReceivedOn: '2026-08-21',
      officeVerifiedBy: 'Coordinator (GNJERBIF)',
      officeDocumentsVerified: true,
      officeEligible: true,
      officeEnrollmentApprovedBy: 'Director, NIDHI DST iTBI',
      officeBatchAllotted: 'Bidri Craftsman Batch B-03',
      officeEnrollmentDate: '2026-08-25',
    };
    setFormData(demoData);
    showToast('Sample form data autofilled!');
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the form?')) {
      localStorage.removeItem('bidri_enrollment_draft');
      setFormData(INITIAL_FORM_DATA);
      clearSignature();
      showToast('Form reset.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      alert('Please enter your Full Name.');
      return;
    }
    if (!formData.mobileNumber.trim()) {
      alert('Please enter your Mobile Number.');
      return;
    }
    setIsSubmitted(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadDocx = () => {
    const link = document.createElement('a');
    link.href = '/Guru_Nanak_Bidri_Art_Enrollment_Form.docx';
    link.download = 'Guru_Nanak_Bidri_Art_Enrollment_Form.docx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Downloading Official Word (.docx) Form...');
  };

  return (
    <div className="min-h-screen bg-[#080808] text-gray-100 pt-20 pb-20 px-3 sm:px-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-5 py-3 rounded-lg shadow-2xl flex items-center gap-3 border border-amber-400/40 animate-bounce">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-medium text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-5xl mx-auto mb-8 no-print">
        {/* Navigation / Back header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>

          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>Academic Year: <strong className="text-amber-400">2026–2027</strong></span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">Admissions Open</span>
          </div>
        </div>

        {/* Hero Pathway Chooser: Fill Online vs Download Offline */}
        <div className="bg-gradient-to-br from-[#181818] via-[#121212] to-[#0d0d0d] border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl mb-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-amber-400 font-bold text-xs uppercase tracking-[0.3em] block mb-2">
              Guru Nanak Bidri Art Skill Development Center
            </span>
            <h1 className="cinzel text-2xl sm:text-4xl font-extrabold text-white mb-3">
              Application & Enrollment Portal
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm">
              Choose your preferred method to apply for our certified Bidri Art training courses supported by NIDHI DST iTBI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {/* OPTION 1: FILL ONLINE FORM */}
            <div
              onClick={() => setMode('online_form')}
              className={`cursor-pointer p-6 rounded-xl border-2 transition-all duration-300 relative flex flex-col justify-between ${
                mode === 'online_form'
                  ? 'bg-amber-950/20 border-amber-500 shadow-[0_0_30px_rgba(197,160,89,0.25)]'
                  : 'bg-black/40 border-white/10 hover:border-amber-500/50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-xl font-bold">
                    📝
                  </div>
                  <span className="text-[10px] uppercase font-bold bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-full border border-amber-500/30">
                    Fastest (Recommended)
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white mb-2">Option 1: Fill Online Application</h2>
                <p className="text-xs text-gray-400 leading-relaxed mb-4">
                  Complete and submit the application form digitally with instant validation, photograph attachment, digital signature, and confirmation slip.
                </p>
                <ul className="text-xs text-gray-300 space-y-1.5 mb-6">
                  <li className="flex items-center gap-2">
                    <span className="text-amber-400">✓</span> Instant submission & Application Number
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-amber-400">✓</span> Upload photo & draw digital signature
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-amber-400">✓</span> Auto-saved draft & instant PDF generation
                  </li>
                </ul>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMode('online_form');
                }}
                className={`w-full py-3 rounded-lg font-bold text-xs uppercase tracking-wider transition-all ${
                  mode === 'online_form'
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {mode === 'online_form' ? 'Currently Active ↓' : 'Fill Form Online →'}
              </button>
            </div>

            {/* OPTION 2: DOWNLOAD OFFLINE FORM */}
            <div
              onClick={() => setMode('offline_download')}
              className={`cursor-pointer p-6 rounded-xl border-2 transition-all duration-300 relative flex flex-col justify-between ${
                mode === 'offline_download' || mode === 'official_preview'
                  ? 'bg-blue-950/20 border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.25)]'
                  : 'bg-black/40 border-white/10 hover:border-blue-500/50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 text-xl font-bold">
                    📥
                  </div>
                  <span className="text-[10px] uppercase font-bold bg-blue-500/20 text-blue-300 px-2.5 py-1 rounded-full border border-blue-500/30">
                    Physical / In-Person
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white mb-2">Option 2: Download Offline Form</h2>
                <p className="text-xs text-gray-400 leading-relaxed mb-4">
                  Download the official blank application form in Microsoft Word (.docx) or print directly to submit in-person at our Bidar campus.
                </p>
                <ul className="text-xs text-gray-300 space-y-1.5 mb-6">
                  <li className="flex items-center gap-2">
                    <span className="text-blue-400">✓</span> Official Word document (.docx) matching format
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-400">✓</span> Clean A4 printable PDF ready for pen-fill
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-400">✓</span> Submit by post, email, or in-person
                  </li>
                </ul>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMode('offline_download');
                  }}
                  className={`flex-1 py-3 rounded-lg font-bold text-xs uppercase tracking-wider transition-all ${
                    mode === 'offline_download'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  Download Options ↓
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadDocx();
                  }}
                  className="px-3 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 rounded-lg text-xs font-bold"
                  title="Direct Download .docx"
                >
                  📥 .DOCX
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Toolbar (Active across all tabs) */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#141414] border border-[#2a2a2a] p-3 sm:p-4 rounded-xl">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              onClick={() => setMode('online_form')}
              className={`px-3 py-1.5 rounded-lg transition-all font-semibold ${
                mode === 'online_form'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-black/50 text-gray-400 hover:text-white border border-white/5'
              }`}
            >
              📝 Fill Online
            </button>
            <button
              onClick={() => setMode('offline_download')}
              className={`px-3 py-1.5 rounded-lg transition-all font-semibold ${
                mode === 'offline_download'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-black/50 text-gray-400 hover:text-white border border-white/5'
              }`}
            >
              📥 Offline Download
            </button>
            <button
              onClick={() => setMode('official_preview')}
              className={`px-3 py-1.5 rounded-lg transition-all font-semibold ${
                mode === 'official_preview'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-black/50 text-gray-400 hover:text-white border border-white/5'
              }`}
            >
              📄 Paper Preview (1:1)
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {mode === 'online_form' && (
              <button
                type="button"
                onClick={handleAutofillDemo}
                className="px-3 py-1.5 text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg font-medium transition-colors"
                title="Fill with sample applicant data"
              >
                ✨ Autofill Demo
              </button>
            )}
            <button
              type="button"
              onClick={handleDownloadDocx}
              className="px-3 py-1.5 text-xs bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 rounded-lg font-medium flex items-center gap-1.5 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download .docx
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 rounded-lg font-medium flex items-center gap-1.5 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print / Save PDF
            </button>
            {mode === 'online_form' && (
              <button
                type="button"
                onClick={handleReset}
                className="px-2.5 py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg border border-red-500/20"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* MODE 1: OFFLINE DOWNLOAD PANEL */}
      {mode === 'offline_download' && (
        <div className="max-w-4xl mx-auto bg-[#121212] border border-[#2a2a2a] rounded-2xl p-6 sm:p-10 shadow-2xl mb-8">
          <div className="text-center max-w-xl mx-auto mb-8">
            <div className="w-14 h-14 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl font-bold">
              📥
            </div>
            <h2 className="cinzel text-2xl sm:text-3xl font-bold text-white mb-2">
              Download Offline Application Forms
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm">
              Download the official form in your preferred format. Fill by typing or hand, attach required documents, and submit to GN JERBI Foundation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* Card 1: Word .docx */}
            <div className="bg-black/50 border border-white/10 rounded-xl p-6 flex flex-col justify-between hover:border-blue-500/50 transition-all">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-600 text-white font-bold rounded-lg flex items-center justify-center text-sm">
                    W
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Microsoft Word (.DOCX)</h3>
                    <span className="text-[11px] text-blue-400 font-mono">Guru_Nanak_Bidri_Art_Enrollment_Form.docx</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                  Fully editable official document. You can type directly in Word, LibreOffice, or Google Docs, insert your photo digitally, and print or email.
                </p>
              </div>
              <button
                type="button"
                onClick={handleDownloadDocx}
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Word (.docx) File
              </button>
            </div>

            {/* Card 2: PDF / Print Form */}
            <div className="bg-black/50 border border-white/10 rounded-xl p-6 flex flex-col justify-between hover:border-emerald-500/50 transition-all">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-emerald-600 text-white font-bold rounded-lg flex items-center justify-center text-sm">
                    PDF
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Printable PDF / Paper Copy</h3>
                    <span className="text-[11px] text-emerald-400 font-mono">Clean A4 Printout (Ready for pen fill)</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                  Generates an exact 1:1 replica of the official physical registration document from image. Perfect for physical printing on standard A4 paper.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMode('official_preview')}
                  className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all"
                >
                  Preview Layout
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg flex items-center justify-center gap-2 transition-all"
                >
                  Print / Save PDF
                </button>
              </div>
            </div>
          </div>

          {/* Submission Guidelines for Offline Applicants */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5 text-xs text-gray-300">
            <h4 className="text-amber-300 font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
              <span>📍</span> Offline Submission Instructions:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-bold text-white block mb-1">1. By Hand / Campus Visit:</span>
                <p className="text-gray-400 leading-relaxed">
                  Submit the completed form with 2 passport photographs and self-attested document copies at:
                  <br />
                  <strong className="text-gray-200">GN JERBI Foundation NIDHI DST iTBI Center</strong>, Guru Nanak Dev Engineering College Campus, Mailoor Road, Bidar – 585403.
                </p>
              </div>
              <div>
                <span className="font-bold text-white block mb-1">2. By Email / Helpline:</span>
                <p className="text-gray-400 leading-relaxed">
                  You can also email scanned copies of the signed form and certificates to:
                  <br />
                  <strong className="text-amber-400">info@gnjerbif.org</strong> or call <strong className="text-white">08482-236478</strong> for assistance.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: INTERACTIVE FORM */}
      {mode === 'online_form' && !isSubmitted && (
        <div className="max-w-5xl mx-auto bg-[#101010] border border-[#262626] rounded-2xl p-4 sm:p-8 shadow-2xl">
          {/* Header Banner */}
          <div className="border-b border-amber-500/20 pb-6 mb-8 text-center relative">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
              {/* Left Badge */}
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full border-2 border-amber-600/80 bg-black flex items-center justify-center p-2 text-center shadow-lg">
                  <div className="text-[9px] font-bold cinzel text-amber-300 leading-tight">
                    GURU NANAK<br />BIDRI ART<br />CENTER
                  </div>
                </div>
                <div className="text-left">
                  <span className="text-[10px] text-amber-500 font-semibold uppercase tracking-widest block">Affiliated with</span>
                  <span className="text-xs font-bold text-gray-300">GN JERBI Foundation</span>
                </div>
              </div>

              {/* Center Logo */}
              <div className="flex flex-col items-center">
                <img
                  src="/images/dst-nidhi-logo.png"
                  alt="DST NIDHI"
                  className="h-12 object-contain filter drop-shadow"
                />
              </div>

              {/* Right Logo */}
              <div className="flex items-center">
                <img
                  src="/images/gn-jerbi-logo.png"
                  alt="GN JERBI FOUNDATION"
                  className="h-12 object-contain filter drop-shadow"
                />
              </div>
            </div>

            <h2 className="cinzel text-xl sm:text-3xl font-extrabold text-white tracking-wide mt-2">
              GURU NANAK BIDRI ART SKILL DEVELOPMENT CENTER
            </h2>
            <h3 className="text-sm sm:text-base font-semibold text-amber-400 tracking-wider uppercase mt-1">
              GN JERBI Foundation • NIDHI DST iTBI Center
            </h3>
            <div className="inline-block mt-3 px-6 py-1.5 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 text-white font-bold text-sm sm:text-base rounded-full uppercase tracking-widest shadow-md">
              Enrollment Application Form
            </div>

            {/* Application Meta Info Bar */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-black/50 p-3 rounded-xl border border-white/5 text-xs">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className="text-gray-400 font-medium">Application No:</span>
                <input
                  type="text"
                  value={formData.applicationNo}
                  onChange={(e) => handleInputChange('applicationNo', e.target.value)}
                  className="bg-[#1c1c1c] border border-[#333] px-2.5 py-1 rounded text-amber-400 font-mono font-bold focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="flex items-center gap-2 justify-center sm:justify-end">
                <span className="text-gray-400 font-medium">Date:</span>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="bg-[#1c1c1c] border border-[#333] px-2.5 py-1 rounded text-gray-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section 1: Personal Information */}
            <div className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-5 sm:p-6 shadow-md">
              <div className="flex items-center justify-between mb-5 border-b border-amber-600/30 pb-3">
                <h4 className="text-base sm:text-lg font-bold text-amber-400 uppercase tracking-wide flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-600 text-black flex items-center justify-center text-xs font-black">1</span>
                  Personal Information
                </h4>
                <span className="text-xs text-gray-500 italic">* Required fields</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Photo Upload Box */}
                <div className="md:col-span-1 flex flex-col items-center justify-center p-4 bg-black/40 border-2 border-dashed border-amber-500/30 rounded-xl">
                  {formData.photoUrl ? (
                    <div className="relative group w-32 h-40 rounded-lg overflow-hidden border border-amber-500 shadow-md">
                      <img src={formData.photoUrl} alt="Passport Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleInputChange('photoUrl', '')}
                        className="absolute inset-0 bg-black/70 text-red-400 font-bold opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-xs"
                      >
                        Remove Photo
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-32 h-40 border border-gray-600 rounded-lg flex flex-col items-center justify-center p-2 text-center cursor-pointer hover:border-amber-500 transition-colors bg-[#181818]"
                    >
                      <svg className="w-8 h-8 text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-[10px] text-gray-400 leading-tight">
                        Paste / Upload Recent Passport Size Photograph
                      </span>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-3 text-[11px] text-amber-400 hover:text-amber-300 font-medium underline"
                  >
                    {formData.photoUrl ? 'Change Photo' : 'Upload Photo'}
                  </button>
                </div>

                {/* Personal Info Fields */}
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Full Name (In Capitals) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. RAHUL PATIL"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value.toUpperCase())}
                      className="w-full bg-[#1c1c1c] border border-[#333] px-3 py-2 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Date of Birth *</label>
                    <input
                      type="date"
                      required
                      value={formData.dob}
                      onChange={(e) => handleInputChange('dob', e.target.value)}
                      className="w-full bg-[#1c1c1c] border border-[#333] px-3 py-2 rounded-lg text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Gender *</label>
                    <div className="flex gap-4 items-center h-10">
                      {(['Male', 'Female', 'Other'] as const).map((g) => (
                        <label key={g} className="flex items-center gap-1.5 text-xs text-gray-300 cursor-pointer">
                          <input
                            type="radio"
                            name="gender"
                            value={g}
                            checked={formData.gender === g}
                            onChange={() => handleInputChange('gender', g)}
                            className="accent-amber-500"
                          />
                          {g}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Father's / Guardian's Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Father or Guardian Name"
                      value={formData.fatherGuardianName}
                      onChange={(e) => handleInputChange('fatherGuardianName', e.target.value)}
                      className="w-full bg-[#1c1c1c] border border-[#333] px-3 py-2 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Marital Status</label>
                    <select
                      value={formData.maritalStatus}
                      onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                      className="w-full bg-[#1c1c1c] border border-[#333] px-3 py-2 rounded-lg text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="Unmarried">Unmarried</option>
                      <option value="Married">Married</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Nationality</label>
                    <input
                      type="text"
                      value={formData.nationality}
                      onChange={(e) => handleInputChange('nationality', e.target.value)}
                      className="w-full bg-[#1c1c1c] border border-[#333] px-3 py-2 rounded-lg text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Aadhaar Number *</label>
                    <input
                      type="text"
                      placeholder="12 digit Aadhaar"
                      value={formData.aadhaarNumber}
                      onChange={(e) => handleInputChange('aadhaarNumber', e.target.value)}
                      className="w-full bg-[#1c1c1c] border border-[#333] px-3 py-2 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">PAN Number (If any)</label>
                    <input
                      type="text"
                      placeholder="10 digit PAN"
                      value={formData.panNumber}
                      onChange={(e) => handleInputChange('panNumber', e.target.value.toUpperCase())}
                      className="w-full bg-[#1c1c1c] border border-[#333] px-3 py-2 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 font-mono uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="10 digit Mobile"
                      value={formData.mobileNumber}
                      onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                      className="w-full bg-[#1c1c1c] border border-[#333] px-3 py-2 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">WhatsApp Number (If different)</label>
                    <input
                      type="tel"
                      placeholder="WhatsApp No."
                      value={formData.whatsappNumber}
                      onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                      className="w-full bg-[#1c1c1c] border border-[#333] px-3 py-2 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Email ID</label>
                    <input
                      type="email"
                      placeholder="example@domain.com"
                      value={formData.emailId}
                      onChange={(e) => handleInputChange('emailId', e.target.value)}
                      className="w-full bg-[#1c1c1c] border border-[#333] px-3 py-2 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Address Details */}
            <div className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-5 sm:p-6 shadow-md">
              <h4 className="text-base sm:text-lg font-bold text-amber-400 uppercase tracking-wide flex items-center gap-2 mb-5 border-b border-amber-600/30 pb-3">
                <span className="w-6 h-6 rounded-full bg-amber-600 text-black flex items-center justify-center text-xs font-black">2</span>
                Address Details
              </h4>

              <div className="space-y-6">
                {/* Permanent Address */}
                <div className="bg-black/30 p-4 rounded-lg border border-white/5">
                  <h5 className="text-xs font-bold text-gray-200 uppercase tracking-wider mb-3">Permanent Address</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="sm:col-span-2 md:col-span-4">
                      <label className="block text-[11px] text-gray-400 mb-1">Street / House No. / Area</label>
                      <input
                        type="text"
                        placeholder="Permanent Address Line"
                        value={formData.permanentAddress}
                        onChange={(e) => handleInputChange('permanentAddress', e.target.value)}
                        className="w-full bg-[#1c1c1c] border border-[#333] px-3 py-2 rounded text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1">City / Town</label>
                      <input
                        type="text"
                        placeholder="City"
                        value={formData.permanentCity}
                        onChange={(e) => handleInputChange('permanentCity', e.target.value)}
                        className="w-full bg-[#1c1c1c] border border-[#333] px-3 py-2 rounded text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1">District</label>
                      <input
                        type="text"
                        placeholder="District"
                        value={formData.permanentDistrict}
                        onChange={(e) => handleInputChange('permanentDistrict', e.target.value)}
                        className="w-full bg-[#1c1c1c] border border-[#333] px-3 py-2 rounded text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1">State</label>
                      <input
                        type="text"
                        placeholder="State"
                        value={formData.permanentState}
                        onChange={(e) => handleInputChange('permanentState', e.target.value)}
                        className="w-full bg-[#1c1c1c] border border-[#333] px-3 py-2 rounded text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-400 mb-1">PIN Code</label>
                      <input
                        type="text"
                        placeholder="PIN Code"
                        value={formData.permanentPin}
                        onChange={(e) => handleInputChange('permanentPin', e.target.value)}
                        className="w-full bg-[#1c1c1c] border border-[#333] px-3 py-2 rounded text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Same as Permanent checkbox */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="sameAsPerm"
                    checked={formData.sameAsPermanent}
                    onChange={(e) => handleInputChange('sameAsPermanent', e.target.checked)}
                    className="accent-amber-500 w-4 h-4"
                  />
                  <label htmlFor="sameAsPerm" className="text-xs text-gray-300 cursor-pointer">
                    Correspondence Address is same as Permanent Address
                  </label>
                </div>

                {/* Correspondence Address (if different) */}
                {!formData.sameAsPermanent && (
                  <div className="bg-black/30 p-4 rounded-lg border border-white/5">
                    <h5 className="text-xs font-bold text-gray-200 uppercase tracking-wider mb-3">Correspondence Address</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="sm:col-span-2 md:col-span-4">
                        <label className="block text-[11px] text-gray-400 mb-1">Street / House No. / Area</label>
                        <input
                          type="text"
                          placeholder="Correspondence Address Line"
                          value={formData.correspondenceAddress}
                          onChange={(e) => handleInputChange('correspondenceAddress', e.target.value)}
                          className="w-full bg-[#1c1c1c] border border-[#333] px-3 py-2 rounded text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-gray-400 mb-1">City / Town</label>
                        <input
                          type="text"
                          placeholder="City"
                          value={formData.correspondenceCity}
                          onChange={(e) => handleInputChange('correspondenceCity', e.target.value)}
                          className="w-full bg-[#1c1c1c] border border-[#333] px-3 py-2 rounded text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-gray-400 mb-1">District</label>
                        <input
                          type="text"
                          placeholder="District"
                          value={formData.correspondenceDistrict}
                          onChange={(e) => handleInputChange('correspondenceDistrict', e.target.value)}
                          className="w-full bg-[#1c1c1c] border border-[#333] px-3 py-2 rounded text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-gray-400 mb-1">State</label>
                        <input
                          type="text"
                          placeholder="State"
                          value={formData.correspondenceState}
                          onChange={(e) => handleInputChange('correspondenceState', e.target.value)}
                          className="w-full bg-[#1c1c1c] border border-[#333] px-3 py-2 rounded text-xs text-white focus:outline-none focus:border-amber-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-gray-400 mb-1">PIN Code</label>
                        <input
                          type="text"
                          placeholder="PIN Code"
                          value={formData.correspondencePin}
                          onChange={(e) => handleInputChange('correspondencePin', e.target.value)}
                          className="w-full bg-[#1c1c1c] border border-[#333] px-3 py-2 rounded text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Split Row: Emergency Contact (2) & KYC Details (4) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Emergency Contact */}
              <div className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-5 shadow-md flex flex-col justify-between">
                <div>
                  <h4 className="text-base font-bold text-amber-400 uppercase tracking-wide flex items-center gap-2 mb-4 border-b border-amber-600/30 pb-2">
                    <span className="w-5 h-5 rounded-full bg-amber-600 text-black flex items-center justify-center text-xs font-black">2</span>
                    Emergency Contact Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">Contact Person Name</label>
                      <input
                        type="text"
                        placeholder="Person Name"
                        value={formData.emergencyContactName}
                        onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                        className="w-full bg-[#1c1c1c] border border-[#333] px-3 py-2 rounded text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">Relationship</label>
                      <input
                        type="text"
                        placeholder="e.g. Father / Mother / Spouse"
                        value={formData.emergencyRelationship}
                        onChange={(e) => handleInputChange('emergencyRelationship', e.target.value)}
                        className="w-full bg-[#1c1c1c] border border-[#333] px-3 py-2 rounded text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">Mobile Number</label>
                      <input
                        type="tel"
                        placeholder="Mobile No."
                        value={formData.emergencyMobile}
                        onChange={(e) => handleInputChange('emergencyMobile', e.target.value)}
                        className="w-full bg-[#1c1c1c] border border-[#333] px-3 py-2 rounded text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-300 mb-1">Alternate Mobile Number</label>
                      <input
                        type="tel"
                        placeholder="Alt Contact No."
                        value={formData.emergencyAltMobile}
                        onChange={(e) => handleInputChange('emergencyAltMobile', e.target.value)}
                        className="w-full bg-[#1c1c1c] border border-[#333] px-3 py-2 rounded text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* KYC / Govt ID Details (Section 4) */}
              <div className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-5 shadow-md">
                <h4 className="text-base font-bold text-amber-400 uppercase tracking-wide flex items-center gap-2 mb-4 border-b border-amber-600/30 pb-2">
                  <span className="w-5 h-5 rounded-full bg-amber-600 text-black flex items-center justify-center text-xs font-black">4</span>
                  KYC / Government ID Details
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Aadhaar Number</label>
                    <input
                      type="text"
                      placeholder="12 Digit Aadhaar"
                      value={formData.kycAadhaarNumber || formData.aadhaarNumber}
                      onChange={(e) => handleInputChange('kycAadhaarNumber', e.target.value)}
                      className="w-full bg-[#1c1c1c] border border-[#333] px-3 py-2 rounded text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">ID Proof Type</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {['Aadhaar', 'PAN', 'Voter ID', 'Passport', 'Driving License', 'Other'].map((type) => (
                        <label key={type} className="flex items-center gap-1.5 text-xs text-gray-300 cursor-pointer">
                          <input
                            type="radio"
                            name="idProofType"
                            value={type}
                            checked={formData.idProofType === type}
                            onChange={() => handleInputChange('idProofType', type)}
                            className="accent-amber-500"
                          />
                          {type}
                        </label>
                      ))}
                    </div>
                  </div>
                  {formData.idProofType === 'Other' && (
                    <input
                      type="text"
                      placeholder="Specify Other ID Type"
                      value={formData.idProofOtherText}
                      onChange={(e) => handleInputChange('idProofOtherText', e.target.value)}
                      className="w-full bg-[#1c1c1c] border border-[#333] px-3 py-1.5 rounded text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  )}
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">ID Proof Number</label>
                    <input
                      type="text"
                      placeholder="Document Identification Number"
                      value={formData.idProofNumber}
                      onChange={(e) => handleInputChange('idProofNumber', e.target.value)}
                      className="w-full bg-[#1c1c1c] border border-[#333] px-3 py-2 rounded text-xs text-white focus:outline-none focus:border-amber-500 uppercase font-mono"
                    />
                  </div>
                  <div className="pt-2 flex items-center justify-between bg-black/40 p-2.5 rounded border border-white/5">
                    <span className="text-xs text-gray-300">Self-Attested Copy Attached?</span>
                    <label className="flex items-center gap-1.5 text-xs text-amber-400 cursor-pointer font-semibold">
                      <input
                        type="checkbox"
                        checked={formData.idProofAttached}
                        onChange={(e) => handleInputChange('idProofAttached', e.target.checked)}
                        className="accent-amber-500 w-4 h-4"
                      />
                      Yes, Enclosed
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3 (5): Educational Details */}
            <div className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-5 sm:p-6 shadow-md">
              <h4 className="text-base sm:text-lg font-bold text-amber-400 uppercase tracking-wide flex items-center gap-2 mb-4 border-b border-amber-600/30 pb-3">
                <span className="w-6 h-6 rounded-full bg-amber-600 text-black flex items-center justify-center text-xs font-black">3</span>
                Educational Details
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-[#333]">
                  <thead>
                    <tr className="bg-[#202020] text-amber-300 font-semibold border-b border-[#333]">
                      <th className="p-3 border-r border-[#333] w-1/4">Qualification</th>
                      <th className="p-3 border-r border-[#333] w-2/5">Board / University</th>
                      <th className="p-3 border-r border-[#333] w-1/6">Year of Passing</th>
                      <th className="p-3 w-1/6">Percentage / CGPA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.educationList.map((row, idx) => (
                      <tr key={idx} className="border-b border-[#2a2a2a] hover:bg-white/[0.02]">
                        <td className="p-2.5 font-medium text-gray-300 border-r border-[#2a2a2a]">
                          {row.qualification}
                        </td>
                        <td className="p-2 border-r border-[#2a2a2a]">
                          <input
                            type="text"
                            placeholder="Board or University Name"
                            value={row.boardUniversity}
                            onChange={(e) => handleEducationChange(idx, 'boardUniversity', e.target.value)}
                            className="w-full bg-[#1c1c1c] border border-[#333] px-2.5 py-1.5 rounded text-xs text-white focus:outline-none focus:border-amber-500"
                          />
                        </td>
                        <td className="p-2 border-r border-[#2a2a2a]">
                          <input
                            type="text"
                            placeholder="YYYY"
                            value={row.yearOfPassing}
                            onChange={(e) => handleEducationChange(idx, 'yearOfPassing', e.target.value)}
                            className="w-full bg-[#1c1c1c] border border-[#333] px-2.5 py-1.5 rounded text-xs text-white focus:outline-none focus:border-amber-500 text-center font-mono"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            placeholder="% or CGPA"
                            value={row.percentageCgpa}
                            onChange={(e) => handleEducationChange(idx, 'percentageCgpa', e.target.value)}
                            className="w-full bg-[#1c1c1c] border border-[#333] px-2.5 py-1.5 rounded text-xs text-white focus:outline-none focus:border-amber-500 text-center"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Split Row: Training Interest (6) & Tech / Skills (7) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Section 6: Training Interest & Experience */}
              <div className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-5 shadow-md">
                <h4 className="text-base font-bold text-amber-400 uppercase tracking-wide flex items-center gap-2 mb-4 border-b border-amber-600/30 pb-2">
                  <span className="w-5 h-5 rounded-full bg-amber-600 text-black flex items-center justify-center text-xs font-black">6</span>
                  Training Interest & Experience
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-2">Course Applying For *</label>
                    <div className="flex gap-4">
                      {(['Basic', 'Intermediate', 'Advanced'] as const).map((level) => (
                        <label key={level} className="flex items-center gap-2 text-xs text-gray-200 cursor-pointer">
                          <input
                            type="radio"
                            name="courseApplyingFor"
                            value={level}
                            checked={formData.courseApplyingFor === level}
                            onChange={() => handleInputChange('courseApplyingFor', level)}
                            className="accent-amber-500"
                          />
                          {level}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-2">Preferred Batch Timing</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Morning', 'Afternoon', 'Evening', 'Weekend'].map((timing) => (
                        <label key={timing} className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.preferredBatchTiming.includes(timing)}
                            onChange={() => toggleBatchTiming(timing)}
                            className="accent-amber-500"
                          />
                          {timing}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-2">
                      Do you have any prior experience in Bidri Art?
                    </label>
                    <div className="flex gap-6 mb-2">
                      {(['Yes', 'No'] as const).map((opt) => (
                        <label key={opt} className="flex items-center gap-2 text-xs text-gray-200 cursor-pointer">
                          <input
                            type="radio"
                            name="priorExperience"
                            value={opt}
                            checked={formData.priorExperience === opt}
                            onChange={() => handleInputChange('priorExperience', opt)}
                            className="accent-amber-500"
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                    {formData.priorExperience === 'Yes' && (
                      <input
                        type="text"
                        placeholder="If Yes, Please Specify details..."
                        value={formData.priorExperienceDetails}
                        onChange={(e) => handleInputChange('priorExperienceDetails', e.target.value)}
                        className="w-full bg-[#1c1c1c] border border-[#333] px-3 py-1.5 rounded text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      How did you hear about our center?
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Website, Newspaper, College, Friend"
                      value={formData.sourceOfInfo}
                      onChange={(e) => handleInputChange('sourceOfInfo', e.target.value)}
                      className="w-full bg-[#1c1c1c] border border-[#333] px-3 py-2 rounded text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section 7: Technology & Skills Interest (Optional) */}
              <div className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-5 shadow-md flex flex-col justify-between">
                <div>
                  <h4 className="text-base font-bold text-amber-400 uppercase tracking-wide flex items-center gap-2 mb-4 border-b border-amber-600/30 pb-2">
                    <span className="w-5 h-5 rounded-full bg-amber-600 text-black flex items-center justify-center text-xs font-black">7</span>
                    Technology & Skills Interest (Optional)
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-2">Interested in Learning:</label>
                      <div className="space-y-2">
                        {[
                          'CAD / Design Software',
                          '3D Printing',
                          'CNC / Laser Engraving',
                          'Digital Marketing for Artisans',
                          'Entrepreneurship / Startup',
                        ].map((skill) => (
                          <label key={skill} className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.interestedSkills.includes(skill)}
                              onChange={() => toggleSkill(skill)}
                              className="accent-amber-500"
                            />
                            {skill}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/5">
                      <label className="block text-xs font-semibold text-gray-300 mb-2">
                        Basic Computer Knowledge:
                      </label>
                      <div className="flex gap-6">
                        {(['Yes', 'No'] as const).map((opt) => (
                          <label key={opt} className="flex items-center gap-2 text-xs text-gray-200 cursor-pointer">
                            <input
                              type="radio"
                              name="basicComputerKnowledge"
                              value={opt}
                              checked={formData.basicComputerKnowledge === opt}
                              onChange={() => handleInputChange('basicComputerKnowledge', opt)}
                              className="accent-amber-500"
                            />
                            {opt}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 8: Declaration & Signature */}
            <div className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-5 sm:p-6 shadow-md">
              <h4 className="text-base sm:text-lg font-bold text-amber-400 uppercase tracking-wide flex items-center gap-2 mb-4 border-b border-amber-600/30 pb-3">
                <span className="w-6 h-6 rounded-full bg-amber-600 text-black flex items-center justify-center text-xs font-black">8</span>
                Declaration
              </h4>

              <div className="bg-black/50 p-4 rounded-lg border border-white/5 text-xs text-gray-300 leading-relaxed mb-6 italic">
                "I hereby declare that the information provided above is true and correct to the best of my knowledge. I understand that any false information may lead to cancellation of my application. I agree to abide by the rules and regulations of the Guru Nanak Bidri Art Skill Development Center."
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Place</label>
                  <input
                    type="text"
                    value={formData.declarationPlace}
                    onChange={(e) => handleInputChange('declarationPlace', e.target.value)}
                    className="w-full bg-[#1c1c1c] border border-[#333] px-3 py-2 rounded text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Date</label>
                  <input
                    type="date"
                    value={formData.declarationDate}
                    onChange={(e) => handleInputChange('declarationDate', e.target.value)}
                    className="w-full bg-[#1c1c1c] border border-[#333] px-3 py-2 rounded text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Digital Signature Pad */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-gray-300">Signature of Applicant</label>
                    <button
                      type="button"
                      onClick={clearSignature}
                      className="text-[10px] text-amber-400 hover:underline"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="border border-[#444] rounded bg-white overflow-hidden shadow-inner">
                    <canvas
                      ref={sigCanvasRef}
                      width={280}
                      height={90}
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={endDrawing}
                      onMouseLeave={endDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={endDrawing}
                      className="w-full h-[90px] cursor-crosshair touch-none"
                    />
                  </div>
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="text-[10px] text-gray-500">Sign with mouse/touch or type name below</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Or Type Full Name as Digital Signature"
                    value={formData.applicantSignatureName}
                    onChange={(e) => handleInputChange('applicantSignatureName', e.target.value)}
                    className="w-full mt-1.5 bg-[#1c1c1c] border border-[#333] px-2.5 py-1 rounded text-xs text-white focus:outline-none focus:border-amber-500 font-serif italic"
                  />
                </div>
              </div>
            </div>

            {/* Section 9: Documents Checklist */}
            <div className="bg-[#151515] border border-[#2a2a2a] rounded-xl p-5 sm:p-6 shadow-md">
              <h4 className="text-base sm:text-lg font-bold text-amber-400 uppercase tracking-wide flex items-center gap-2 mb-4 border-b border-amber-600/30 pb-3">
                <span className="w-6 h-6 rounded-full bg-amber-600 text-black flex items-center justify-center text-xs font-black">9</span>
                Documents Checklist (Attach Self Attested Copies)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { key: 'checklistPhoto', label: 'Recent Passport Size Photo (2 Nos.)' },
                  { key: 'checklistAadhaar', label: 'Aadhaar Card' },
                  { key: 'checklistEducation', label: 'Educational Certificates' },
                  { key: 'checklistAddressProof', label: 'Address Proof' },
                  { key: 'checklistIdProof', label: 'ID Proof (PAN / Voter ID / DL / Passport)' },
                  { key: 'checklistOther', label: 'Other (If any)' },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer bg-black/40 p-2.5 rounded border border-white/5">
                    <input
                      type="checkbox"
                      checked={(formData as any)[key]}
                      onChange={(e) => handleInputChange(key as keyof EnrollmentFormData, e.target.checked)}
                      className="accent-amber-500 w-4 h-4"
                    />
                    {label}
                  </label>
                ))}
              </div>
              {formData.checklistOther && (
                <div className="mt-3">
                  <input
                    type="text"
                    placeholder="Specify other attached documents..."
                    value={formData.checklistOtherText}
                    onChange={(e) => handleInputChange('checklistOtherText', e.target.value)}
                    className="w-full bg-[#1c1c1c] border border-[#333] px-3 py-1.5 rounded text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              )}
            </div>

            {/* Submission CTA Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
              <div className="text-xs text-gray-400 text-center sm:text-left">
                By submitting this form, you register your intent for enrollment at Guru Nanak Bidri Art Center.
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setMode('official_preview')}
                  className="w-full sm:w-auto px-6 py-3 bg-[#222] hover:bg-[#333] text-gray-200 border border-white/10 rounded-xl font-semibold text-sm transition-all"
                >
                  Preview Paper Copy
                </button>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-bold uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(197,160,89,0.4)] transition-all transform hover:scale-105 text-sm"
                >
                  Submit Application →
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* CONFIRMATION MODAL / RECEIPT */}
      {isSubmitted && (
        <div className="max-w-3xl mx-auto bg-[#121212] border border-amber-500/40 rounded-2xl p-6 sm:p-10 shadow-2xl text-center">
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="cinzel text-2xl sm:text-3xl font-bold text-white mb-2">Application Submitted Successfully!</h2>
          <p className="text-gray-300 text-xs sm:text-sm max-w-md mx-auto mb-6">
            Your application for the Bidri Art Skill Development Program has been recorded.
          </p>

          <div className="bg-black/60 border border-white/10 rounded-xl p-5 text-left max-w-lg mx-auto mb-8 font-mono text-xs space-y-2">
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-gray-400">Application Number:</span>
              <span className="text-amber-400 font-bold text-sm">{formData.applicationNo}</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-gray-400">Applicant Name:</span>
              <span className="text-white font-bold">{formData.fullName || 'N/A'}</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-gray-400">Course Level:</span>
              <span className="text-amber-300">{formData.courseApplyingFor} Level</span>
            </div>
            <div className="flex justify-between border-b border-white/10 pb-2">
              <span className="text-gray-400">Date of Application:</span>
              <span className="text-gray-200">{formData.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Submission Status:</span>
              <span className="text-emerald-400 font-semibold">Under Review / Verified</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => {
                setMode('official_preview');
                setIsSubmitted(false);
              }}
              className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-black font-bold rounded-xl transition-all shadow-md text-xs sm:text-sm"
            >
              View & Print Official Form
            </button>
            <button
              onClick={handleDownloadDocx}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-md text-xs sm:text-sm"
            >
              Download Word (.docx)
            </button>
            <button
              onClick={onBack}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-all text-xs sm:text-sm"
            >
              Back to Home
            </button>
          </div>
        </div>
      )}

      {/* MODE 3: EXACT 1:1 OFFICIAL PAPER FORM (Matching image.png replica) */}
      {mode === 'official_preview' && (
        <div className="max-w-4xl mx-auto">
          <div className="no-print flex justify-between items-center mb-4 bg-[#141414] p-3 rounded-lg border border-[#333]">
            <span className="text-xs text-amber-300 font-medium">
              📄 Official Standard Layout (Matches physical registration document)
            </span>
            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded shadow"
              >
                Print / Save A4 PDF
              </button>
              <button
                onClick={() => setMode('online_form')}
                className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-gray-200 text-xs rounded"
              >
                Switch to Online Fill
              </button>
            </div>
          </div>

          {/* PRINTABLE OFFICIAL SHEET CONTAINER */}
          <div
            id="printable-official-form"
            className="bg-white text-black p-6 sm:p-10 shadow-2xl rounded-sm border border-gray-400 font-sans text-[11px] leading-tight"
            style={{ minHeight: '1050px', color: '#000000', backgroundColor: '#ffffff' }}
          >
            {/* Header with 3 Logos */}
            <div className="flex justify-between items-start mb-3 pb-2 border-b-2 border-amber-700">
              {/* Left Seal */}
              <div className="w-24 h-24 flex items-center justify-center p-1">
                <img
                  src="/images/guru-nanak-seal-clean.png"
                  alt="Guru Nanak Bidri Art Seal"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Center Title & DST + GN JERBI Logos */}
              <div className="text-center flex-1 px-4">
                <img
                  src="/images/dst-nidhi-logo.png"
                  alt="DST NIDHI"
                  className="h-10 mx-auto object-contain mb-1"
                />
                <h1 className="text-xl sm:text-2xl font-black text-blue-900 tracking-wide uppercase font-serif">
                  GURU NANAK BIDRI ART
                </h1>
                <h2 className="text-sm font-bold text-blue-800 tracking-wider uppercase">
                  SKILL DEVELOPMENT CENTER
                </h2>
                <div className="text-xs font-bold text-amber-800 tracking-wide mt-0.5">
                  GN JERBI Foundation
                </div>
                <div className="text-[11px] font-bold text-amber-900">
                  NIDHI DST iTBI Center
                </div>
                <img
                  src="/images/gn-jerbi-logo-tight.png"
                  alt="GN JERBI Foundation"
                  className="h-9 mx-auto object-contain mt-1"
                />
              </div>

              {/* Right Photo Box */}
              <div className="w-24 h-28 border border-black flex items-center justify-center text-center p-1 rounded-sm bg-gray-50">
                {formData.photoUrl ? (
                  <img src={formData.photoUrl} alt="Photo" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[9px] text-gray-600 font-medium">
                    Paste Recent<br />Passport Size<br />Photograph
                  </span>
                )}
              </div>
            </div>

            {/* Banner: ENROLLMENT APPLICATION FORM */}
            <div className="flex justify-between items-center mb-3">
              <div className="bg-blue-950 text-white font-bold px-6 py-1 text-xs sm:text-sm tracking-wider uppercase rounded-full shadow-sm">
                ENROLLMENT APPLICATION FORM
              </div>
              <div className="text-right text-xs">
                <div><span className="font-bold">Application No.:</span> {formData.applicationNo}</div>
                <div><span className="font-bold">Date:</span> {formData.date}</div>
              </div>
            </div>

            {/* SECTION 1: PERSONAL INFORMATION */}
            <div className="mb-3">
              <div className="bg-[#8c641c] text-white font-bold text-[11px] px-2 py-0.5 uppercase tracking-wide">
                1. PERSONAL INFORMATION
              </div>
              <table className="w-full border-collapse border border-black text-[10px]">
                <tbody>
                  <tr className="border-b border-black">
                    <td className="w-1/4 p-1 font-bold bg-gray-50 border-r border-black">Full Name (In Capitals)</td>
                    <td className="w-1/4 p-1 border-r border-black uppercase font-semibold">{formData.fullName || '-'}</td>
                    <td className="w-1/6 p-1 font-bold bg-gray-50 border-r border-black">Date of Birth</td>
                    <td className="w-1/3 p-1">{formData.dob || '-'}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-1 font-bold bg-gray-50 border-r border-black">Father's / Guardian's Name</td>
                    <td className="p-1 border-r border-black">{formData.fatherGuardianName || '-'}</td>
                    <td className="p-1 font-bold bg-gray-50 border-r border-black">Gender</td>
                    <td className="p-1">
                      <span className="mr-3">[{formData.gender === 'Male' ? '✓' : ' '}] Male</span>
                      <span className="mr-3">[{formData.gender === 'Female' ? '✓' : ' '}] Female</span>
                      <span>[{formData.gender === 'Other' ? '✓' : ' '}] Other</span>
                    </td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-1 font-bold bg-gray-50 border-r border-black">Marital Status</td>
                    <td className="p-1 border-r border-black">{formData.maritalStatus || '-'}</td>
                    <td className="p-1 font-bold bg-gray-50 border-r border-black">Nationality</td>
                    <td className="p-1">{formData.nationality || 'Indian'}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-1 font-bold bg-gray-50 border-r border-black">Aadhaar Number</td>
                    <td className="p-1 border-r border-black font-mono">{formData.aadhaarNumber || '-'}</td>
                    <td className="p-1 font-bold bg-gray-50 border-r border-black">PAN Number (If any)</td>
                    <td className="p-1 font-mono uppercase">{formData.panNumber || '-'}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-1 font-bold bg-gray-50 border-r border-black">Mobile Number</td>
                    <td className="p-1 border-r border-black font-mono">{formData.mobileNumber || '-'}</td>
                    <td className="p-1 font-bold bg-gray-50 border-r border-black">Email ID</td>
                    <td className="p-1">{formData.emailId || '-'}</td>
                  </tr>
                  <tr>
                    <td className="p-1 font-bold bg-gray-50 border-r border-black">WhatsApp Number (If different)</td>
                    <td colSpan={3} className="p-1 font-mono">{formData.whatsappNumber || formData.mobileNumber || '-'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* SECTION 2: ADDRESS DETAILS */}
            <div className="mb-3">
              <div className="bg-[#8c641c] text-white font-bold text-[11px] px-2 py-0.5 uppercase tracking-wide">
                2. ADDRESS DETAILS
              </div>
              <table className="w-full border-collapse border border-black text-[10px]">
                <tbody>
                  <tr className="border-b border-black">
                    <td className="w-1/4 p-1 font-bold bg-gray-50 border-r border-black">Permanent Address</td>
                    <td colSpan={3} className="p-1">{formData.permanentAddress || '-'}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-1 font-bold bg-gray-50 border-r border-black">City / Town</td>
                    <td className="w-1/4 p-1 border-r border-black">{formData.permanentCity || '-'}</td>
                    <td className="w-1/6 p-1 font-bold bg-gray-50 border-r border-black">District</td>
                    <td className="w-1/3 p-1">{formData.permanentDistrict || '-'}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-1 font-bold bg-gray-50 border-r border-black">State</td>
                    <td className="p-1 border-r border-black">{formData.permanentState || '-'}</td>
                    <td className="p-1 font-bold bg-gray-50 border-r border-black">PIN Code</td>
                    <td className="p-1 font-mono">{formData.permanentPin || '-'}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-1 font-bold bg-gray-50 border-r border-black">Correspondence Address (If different)</td>
                    <td colSpan={3} className="p-1">{formData.correspondenceAddress || formData.permanentAddress || '-'}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-1 font-bold bg-gray-50 border-r border-black">City / Town</td>
                    <td className="p-1 border-r border-black">{formData.correspondenceCity || formData.permanentCity || '-'}</td>
                    <td className="p-1 font-bold bg-gray-50 border-r border-black">District</td>
                    <td className="p-1">{formData.correspondenceDistrict || formData.permanentDistrict || '-'}</td>
                  </tr>
                  <tr>
                    <td className="p-1 font-bold bg-gray-50 border-r border-black">State</td>
                    <td className="p-1 border-r border-black">{formData.correspondenceState || formData.permanentState || '-'}</td>
                    <td className="p-1 font-bold bg-gray-50 border-r border-black">PIN Code</td>
                    <td className="p-1 font-mono">{formData.correspondencePin || formData.permanentPin || '-'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* SPLIT ROW: 2. EMERGENCY CONTACT DETAILS & 4. KYC / GOVT ID DETAILS */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              {/* Emergency Contact */}
              <div>
                <div className="bg-[#8c641c] text-white font-bold text-[10px] px-2 py-0.5 uppercase tracking-wide">
                  2. EMERGENCY CONTACT DETAILS
                </div>
                <table className="w-full border-collapse border border-black text-[9.5px]">
                  <tbody>
                    <tr className="border-b border-black">
                      <td className="w-1/2 p-1 font-bold bg-gray-50 border-r border-black">Contact Person Name</td>
                      <td className="w-1/2 p-1">{formData.emergencyContactName || '-'}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-1 font-bold bg-gray-50 border-r border-black">Relationship</td>
                      <td className="p-1">{formData.emergencyRelationship || '-'}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-1 font-bold bg-gray-50 border-r border-black">Mobile Number</td>
                      <td className="p-1 font-mono">{formData.emergencyMobile || '-'}</td>
                    </tr>
                    <tr>
                      <td className="p-1 font-bold bg-gray-50 border-r border-black">Alternate Mobile Number</td>
                      <td className="p-1 font-mono">{formData.emergencyAltMobile || '-'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* KYC Details */}
              <div>
                <div className="bg-[#8c641c] text-white font-bold text-[10px] px-2 py-0.5 uppercase tracking-wide">
                  4. KYC / GOVERNMENT ID DETAILS (Attach Self Attested Copy)
                </div>
                <table className="w-full border-collapse border border-black text-[9.5px]">
                  <tbody>
                    <tr className="border-b border-black">
                      <td className="w-1/3 p-1 font-bold bg-gray-50 border-r border-black">Aadhaar Number</td>
                      <td className="w-2/3 p-1 font-mono">{formData.kycAadhaarNumber || formData.aadhaarNumber || '-'}</td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-1 font-bold bg-gray-50 border-r border-black">ID Proof Type</td>
                      <td className="p-1">
                        <span className="mr-2">[{formData.idProofType === 'Aadhaar' ? '✓' : ' '}] Aadhaar</span>
                        <span className="mr-2">[{formData.idProofType === 'PAN' ? '✓' : ' '}] PAN</span>
                        <span className="mr-2">[{formData.idProofType === 'Voter ID' ? '✓' : ' '}] Voter ID</span>
                        <span>[{formData.idProofType === 'Passport' ? '✓' : ' '}] Passport</span>
                        <div className="mt-0.5">
                          <span className="mr-2">[{formData.idProofType === 'Driving License' ? '✓' : ' '}] Driving License</span>
                          <span>[{formData.idProofType === 'Other' ? '✓' : ' '}] Other {formData.idProofOtherText}</span>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-1 font-bold bg-gray-50 border-r border-black">ID Proof Number</td>
                      <td className="p-1 font-mono uppercase">{formData.idProofNumber || '-'}</td>
                    </tr>
                    <tr>
                      <td className="p-1 font-bold bg-gray-50 border-r border-black">Upload / Attach ID Proof</td>
                      <td className="p-1 font-semibold">{formData.idProofAttached ? '(Self Attested Copy Attached)' : '(Self Attested Copy Attached)'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* SECTION 3: EDUCATIONAL DETAILS */}
            <div className="mb-3">
              <div className="bg-[#8c641c] text-white font-bold text-[11px] px-2 py-0.5 uppercase tracking-wide">
                3. EDUCATIONAL DETAILS
              </div>
              <table className="w-full border-collapse border border-black text-[9.5px]">
                <thead>
                  <tr className="bg-gray-100 font-bold border-b border-black">
                    <th className="p-1 border-r border-black text-left w-1/4">Qualification</th>
                    <th className="p-1 border-r border-black text-left w-2/5">Board / University</th>
                    <th className="p-1 border-r border-black text-center w-1/6">Year of Passing</th>
                    <th className="p-1 text-center w-1/6">Percentage / CGPA</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.educationList.map((row, i) => (
                    <tr key={i} className="border-b border-black">
                      <td className="p-1 font-semibold bg-gray-50 border-r border-black">{row.qualification}</td>
                      <td className="p-1 border-r border-black">{row.boardUniversity || '-'}</td>
                      <td className="p-1 text-center border-r border-black font-mono">{row.yearOfPassing || '-'}</td>
                      <td className="p-1 text-center">{row.percentageCgpa || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* SPLIT ROW: 6. TRAINING INTEREST & 7. TECH & SKILLS */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              {/* Training Interest */}
              <div>
                <div className="bg-[#8c641c] text-white font-bold text-[10px] px-2 py-0.5 uppercase tracking-wide">
                  6. TRAINING INTEREST & EXPERIENCE
                </div>
                <table className="w-full border-collapse border border-black text-[9px]">
                  <tbody>
                    <tr className="border-b border-black">
                      <td className="w-1/3 p-1 font-bold bg-gray-50 border-r border-black">Course Applying For</td>
                      <td className="w-2/3 p-1">
                        <span className="mr-2">[{formData.courseApplyingFor === 'Basic' ? '✓' : ' '}] Basic</span>
                        <span className="mr-2">[{formData.courseApplyingFor === 'Intermediate' ? '✓' : ' '}] Intermediate</span>
                        <span>[{formData.courseApplyingFor === 'Advanced' ? '✓' : ' '}] Advanced</span>
                      </td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-1 font-bold bg-gray-50 border-r border-black">Preferred Batch Timing</td>
                      <td className="p-1">
                        <span className="mr-1.5">[{formData.preferredBatchTiming.includes('Morning') ? '✓' : ' '}] Morning</span>
                        <span className="mr-1.5">[{formData.preferredBatchTiming.includes('Afternoon') ? '✓' : ' '}] Afternoon</span>
                        <span className="mr-1.5">[{formData.preferredBatchTiming.includes('Evening') ? '✓' : ' '}] Evening</span>
                        <span>[{formData.preferredBatchTiming.includes('Weekend') ? '✓' : ' '}] Weekend</span>
                      </td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-1 font-bold bg-gray-50 border-r border-black">Prior experience in Bidri Art?</td>
                      <td className="p-1">
                        <span className="mr-4">[{formData.priorExperience === 'Yes' ? '✓' : ' '}] Yes</span>
                        <span>[{formData.priorExperience === 'No' ? '✓' : ' '}] No</span>
                      </td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="p-1 font-bold bg-gray-50 border-r border-black">If Yes, Please Specify</td>
                      <td className="p-1">{formData.priorExperienceDetails || '-'}</td>
                    </tr>
                    <tr>
                      <td className="p-1 font-bold bg-gray-50 border-r border-black">How did you hear about center?</td>
                      <td className="p-1">{formData.sourceOfInfo || '-'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Tech & Skills */}
              <div>
                <div className="bg-[#8c641c] text-white font-bold text-[10px] px-2 py-0.5 uppercase tracking-wide">
                  7. TECHNOLOGY & SKILLS INTEREST (Optional)
                </div>
                <table className="w-full border-collapse border border-black text-[9px]">
                  <tbody>
                    <tr className="border-b border-black">
                      <td className="w-1/3 p-1 font-bold bg-gray-50 border-r border-black align-top">Interested in Learning</td>
                      <td className="w-2/3 p-1 space-y-0.5">
                        <div>[{formData.interestedSkills.includes('CAD / Design Software') ? '✓' : ' '}] CAD / Design Software</div>
                        <div>[{formData.interestedSkills.includes('3D Printing') ? '✓' : ' '}] 3D Printing</div>
                        <div>[{formData.interestedSkills.includes('CNC / Laser Engraving') ? '✓' : ' '}] CNC / Laser Engraving</div>
                        <div>[{formData.interestedSkills.includes('Digital Marketing for Artisans') ? '✓' : ' '}] Digital Marketing for Artisans</div>
                        <div>[{formData.interestedSkills.includes('Entrepreneurship / Startup') ? '✓' : ' '}] Entrepreneurship / Startup</div>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-1 font-bold bg-gray-50 border-r border-black">Basic Computer Knowledge</td>
                      <td className="p-1">
                        <span className="mr-4">[{formData.basicComputerKnowledge === 'Yes' ? '✓' : ' '}] Yes</span>
                        <span>[{formData.basicComputerKnowledge === 'No' ? '✓' : ' '}] No</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* SECTION 8: DECLARATION */}
            <div className="mb-3">
              <div className="bg-[#8c641c] text-white font-bold text-[10px] px-2 py-0.5 uppercase tracking-wide">
                8. DECLARATION
              </div>
              <div className="border border-black p-2 text-[9px] leading-snug">
                <p className="mb-3">
                  I hereby declare that the information provided above is true and correct to the best of my knowledge. I understand that any false information may lead to cancellation of my application.
                  <br />
                  I agree to abide by the rules and regulations of the Guru Nanak Bidri Art Skill Development Center.
                </p>
                <div className="flex justify-between items-end pt-2">
                  <div>
                    <div><span className="font-bold">Place:</span> {formData.declarationPlace || 'Bidar'}</div>
                    <div className="mt-1"><span className="font-bold">Date:</span> {formData.declarationDate || formData.date}</div>
                  </div>
                  <div className="text-right">
                    {formData.signatureDataUrl ? (
                      <img src={formData.signatureDataUrl} alt="Signature" className="h-8 max-w-[140px] inline-block mb-1 object-contain" />
                    ) : (
                      <div className="font-serif italic font-semibold text-xs mb-1">
                        {formData.applicantSignatureName || formData.fullName}
                      </div>
                    )}
                    <div className="border-t border-black pt-0.5 text-[9px] font-bold">
                      Signature of Applicant
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 9: DOCUMENTS CHECKLIST */}
            <div className="mb-3">
              <div className="bg-[#8c641c] text-white font-bold text-[10px] px-2 py-0.5 uppercase tracking-wide">
                9. DOCUMENTS CHECKLIST (Attach Self Attested Copies)
              </div>
              <table className="w-full border-collapse border border-black text-[9px]">
                <tbody>
                  <tr className="border-b border-black">
                    <td className="w-1/2 p-1 border-r border-black">
                      [{formData.checklistPhoto ? '✓' : ' '}] Recent Passport Size Photo (2 Nos.)
                    </td>
                    <td className="w-1/2 p-1">
                      [{formData.checklistAadhaar ? '✓' : ' '}] Aadhaar Card
                    </td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-1 border-r border-black">
                      [{formData.checklistEducation ? '✓' : ' '}] Educational Certificates
                    </td>
                    <td className="p-1">
                      [{formData.checklistAddressProof ? '✓' : ' '}] Address Proof
                    </td>
                  </tr>
                  <tr>
                    <td className="p-1 border-r border-black">
                      [{formData.checklistIdProof ? '✓' : ' '}] ID Proof (PAN / Voter ID / DL / Passport)
                    </td>
                    <td className="p-1">
                      [{formData.checklistOther ? '✓' : ' '}] Other (If any): {formData.checklistOtherText || '_____________________'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* SECTION: FOR OFFICE USE ONLY */}
            <div className="mb-3">
              <div className="bg-blue-950 text-white font-bold text-[10px] text-center py-0.5 uppercase tracking-wider">
                FOR OFFICE USE ONLY
              </div>
              <table className="w-full border-collapse border border-black text-[9px]">
                <tbody>
                  <tr className="border-b border-black">
                    <td className="w-1/4 p-1 font-bold bg-gray-50 border-r border-black">Application Received On:</td>
                    <td className="w-1/4 p-1 border-r border-black">{formData.officeApplicationReceivedOn || formData.date}</td>
                    <td className="w-1/4 p-1 font-bold bg-gray-50 border-r border-black">Verified By:</td>
                    <td className="w-1/4 p-1 border-r border-black">{formData.officeVerifiedBy}</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-1 font-bold bg-gray-50 border-r border-black">Documents Verified:</td>
                    <td className="p-1 border-r border-black">[✓] Yes [ ] No</td>
                    <td className="p-1 font-bold bg-gray-50 border-r border-black">Eligible:</td>
                    <td className="p-1">[✓] Yes [ ] No</td>
                  </tr>
                  <tr className="border-b border-black">
                    <td className="p-1 font-bold bg-gray-50 border-r border-black">Enrollment Approved By:</td>
                    <td className="p-1 border-r border-black">{formData.officeEnrollmentApprovedBy}</td>
                    <td className="p-1 font-bold bg-gray-50 border-r border-black">Batch Allotted:</td>
                    <td className="p-1">{formData.officeBatchAllotted}</td>
                  </tr>
                  <tr>
                    <td className="p-1 font-bold bg-gray-50 border-r border-black">Enrollment Date:</td>
                    <td className="p-1 border-r border-black">{formData.officeEnrollmentDate || formData.date}</td>
                    <td className="p-1 font-bold bg-gray-50 border-r border-black">Signature & Seal:</td>
                    <td className="p-1 text-center font-serif text-[8px] text-gray-500 italic">(Authorized Signatory)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Official Footer */}
            <div className="text-center text-[9px] pt-1 text-gray-800 border-t border-black leading-tight">
              <div className="font-bold text-black">GN JERBI Foundation NIDHI DST iTBI Center</div>
              <div>Guru Nanak Dev Engineering College Campus, Mailoor Road, Bidar – 585403, Karnataka, India.</div>
              <div className="flex justify-center items-center gap-4 mt-0.5 font-medium">
                <span>📞 08482-236478</span>
                <span>✉ info@gnjerbif.org</span>
                <span>🌐 www.gnjerbif.org</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnrollmentForm;
