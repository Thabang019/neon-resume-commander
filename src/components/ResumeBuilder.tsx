
import React, { useState } from 'react';
import { FormData } from './types';
import { FormSection } from './FormSection';
import { ResumePreview } from './ResumePreview';
import { ProgressBar } from './ProgressBar';
import { Header } from './Header';

const initialFormData: FormData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedIn: '',
    portfolio: ''
  },
  experience: [],
  education: [],
  skills: []
};

export const ResumeBuilder: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const updateFormData = (section: keyof FormData, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-animated-gradient bg-300% animate-gradient-shift">
      <div className="scan-lines absolute inset-0 pointer-events-none" />
      
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <ProgressBar currentStep={currentStep} totalSteps={5} />
        
        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          {/* Form Section */}
          <div className="glass-panel p-6 animate-slide-in-left">
            <FormSection
              currentStep={currentStep}
              formData={formData}
              updateFormData={updateFormData}
              nextStep={nextStep}
              prevStep={prevStep}
            />
          </div>

          {/* Preview Section */}
          <div className="glass-panel p-6 animate-slide-in-right">
            <ResumePreview formData={formData} />
          </div>
        </div>
      </div>
    </div>
  );
};
