
import React from 'react';
import { FormData } from './types';
import { PersonalInfoForm } from './forms/PersonalInfoForm';
import { ExperienceForm } from './forms/ExperienceForm';
import { EducationForm } from './forms/EducationForm';
import { SkillsForm } from './forms/SkillsForm';
import { ProjectsForm } from './forms/ProjectsForm';
import { PreviewForm } from './forms/PreviewForm';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface FormSectionProps {
  currentStep: number;
  formData: FormData;
  updateFormData: (section: keyof FormData, data: any) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export const FormSection: React.FC<FormSectionProps> = ({
  currentStep,
  formData,
  updateFormData,
  nextStep,
  prevStep,
}) => {
  const renderCurrentForm = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoForm
            data={formData.personalInfo}
            onUpdate={(data) => updateFormData('personalInfo', data)}
          />
        );
      case 2:
        return (
          <ExperienceForm
            data={formData.experience}
            onUpdate={(data) => updateFormData('experience', data)}
          />
        );
      case 3:
        return (
          <EducationForm
            data={formData.education}
            onUpdate={(data) => updateFormData('education', data)}
          />
        );
      case 4:
        return (
          <SkillsForm
            data={formData.skills}
            onUpdate={(data) => updateFormData('skills', data)}
          />
        );
      case 5:
        return (
          <ProjectsForm
            data={formData.projects}
            onUpdate={(data) => updateFormData('projects', data)}
          />
        );
      case 6:
        return <PreviewForm formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        {renderCurrentForm()}
      </div>

      <div className="flex justify-between pt-6 border-t border-cyber-blue/20">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg font-mono transition-all duration-300
            ${currentStep === 1
              ? 'text-muted-foreground cursor-not-allowed opacity-50'
              : 'text-cyber-blue border border-cyber-blue/30 hover:bg-cyber-blue/10 hover:scale-105'
            }
          `}
        >
          <ChevronLeft className="w-4 h-4" />
          PREVIOUS
        </button>

        <button
          onClick={nextStep}
          disabled={currentStep === 6}
          className={`
            flex items-center gap-2 px-6 py-2 rounded-lg font-mono transition-all duration-300
            ${currentStep === 6
              ? 'text-muted-foreground cursor-not-allowed opacity-50'
              : 'cyber-button'
            }
          `}
        >
          NEXT
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
