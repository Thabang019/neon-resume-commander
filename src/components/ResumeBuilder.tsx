import React, { useState } from 'react';
import { FormData } from './types';
import { TemplateType } from './templates/TemplatePreview';
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
  skills: [],
  projects: []
};

export const ResumeBuilder: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>('classic');
  const [analysisCompleted, setAnalysisCompleted] = useState(false);

  const updateFormData = (section: keyof FormData, data: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const nextStep = () => {
    if (currentStep === 7) {
      setAnalysisCompleted(false);
    }
    if (currentStep < 8) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep === 7) {
      setAnalysisCompleted(false);
    }
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };


  const goToStep = (step: number) => {
    if (step !== 7) {
      setAnalysisCompleted(false);
    }
    setCurrentStep(step);
  };


  const handleTemplateChange = (template: TemplateType) => {
    setSelectedTemplate(template);
  };

  return (
    <div className="min-h-screen bg-animated-gradient bg-300% animate-gradient-shift">
      <div className="scan-lines absolute inset-0 pointer-events-none" />
      
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <ProgressBar 
          currentStep={currentStep} 
          totalSteps={8} 
          onStepClick={goToStep}
        />
        
        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          {/* Form Section */}
          <div className="glass-panel p-6 animate-slide-in-left">
            <FormSection
              currentStep={currentStep}
              formData={formData}
              selectedTemplate={selectedTemplate}
              updateFormData={updateFormData}
              onTemplateChange={handleTemplateChange}
              nextStep={nextStep}
              prevStep={prevStep}
              setAnalysisCompleted={setAnalysisCompleted}
            />
          </div>

          {/* Preview Section */}
          <div className="glass-panel p-6 animate-slide-in-right">
            {currentStep === 7 && !analysisCompleted ? (
              <div className="text-center py-16">
                <div className="text-lg mb-2 text-cyber-blue glow-text">ATS Analysis in Progress</div>
                <div className="text-sm text-muted-foreground font-mono">
                  Complete the analysis to see your optimized resume preview
                </div>
              </div>
            ) : (
              <ResumePreview
                formData={formData}
                selectedTemplate={selectedTemplate}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};