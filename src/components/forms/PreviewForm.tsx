
import React from 'react';
import { FormData } from '../types';
import { Download, CheckCircle, Sparkles } from 'lucide-react';

interface PreviewFormProps {
  formData: FormData;
}

export const PreviewForm: React.FC<PreviewFormProps> = ({ formData }) => {
  const handleDownload = () => {
    // In a real app, this would generate and download a PDF
    console.log('Generating PDF resume...', formData);
    alert('🚀 Resume download initiated! (This is a demo)');
  };

  const getCompletionPercentage = () => {
    let totalFields = 0;
    let filledFields = 0;

    // Personal info (6 fields)
    totalFields += 6;
    Object.values(formData.personalInfo).forEach(value => {
      if (value.trim()) filledFields++;
    });

    // Experience
    if (formData.experience.length > 0) {
      totalFields += formData.experience.length * 5;
      formData.experience.forEach(exp => {
        if (exp.company) filledFields++;
        if (exp.position) filledFields++;
        if (exp.startDate) filledFields++;
        if (exp.endDate || exp.current) filledFields++;
        if (exp.description) filledFields++;
      });
    }

    // Education
    if (formData.education.length > 0) {
      totalFields += formData.education.length * 4;
      formData.education.forEach(edu => {
        if (edu.institution) filledFields++;
        if (edu.degree) filledFields++;
        if (edu.field) filledFields++;
        if (edu.graduationDate) filledFields++;
      });
    }

    // Skills
    if (formData.skills.length > 0) {
      totalFields += formData.skills.length * 2;
      formData.skills.forEach(skill => {
        if (skill.name) filledFields++;
        if (skill.level) filledFields++;
      });
    }

    return totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;
  };

  const completionPercentage = getCompletionPercentage();

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-cyber-blue glow-text mb-2">
          FINAL PROTOCOL
        </h2>
        <p className="text-muted-foreground font-mono text-sm">
          // Resume compilation ready for deployment
        </p>
      </div>

      <div className="cyber-card space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-neon-green" />
            <span className="text-lg font-semibold text-neon-green">
              SYSTEM STATUS: READY
            </span>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-cyber-blue font-mono">
              {completionPercentage}%
            </div>
            <div className="text-sm text-muted-foreground">Complete</div>
          </div>
        </div>

        <div className="w-full bg-space-blue/30 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-neon-green to-cyber-blue h-3 rounded-full transition-all duration-1000 animate-glow-pulse"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4 text-sm font-mono">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Personal Info:</span>
              <span className="text-cyber-blue">
                {Object.values(formData.personalInfo).filter(v => v.trim()).length}/6
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Experience:</span>
              <span className="text-cyber-blue">{formData.experience.length} entries</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Education:</span>
              <span className="text-cyber-blue">{formData.education.length} entries</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Skills:</span>
              <span className="text-cyber-blue">{formData.skills.length} skills</span>
            </div>
          </div>
        </div>
      </div>

      <div className="cyber-card text-center space-y-4">
        <div className="flex items-center justify-center gap-2 text-neon-pink mb-4">
          <Sparkles className="w-5 h-5 animate-pulse" />
          <span className="font-mono">DOWNLOAD READY</span>
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        
        <button
          onClick={handleDownload}
          className="cyber-button text-lg px-8 py-4 flex items-center gap-3 mx-auto animate-glow-pulse"
        >
          <Download className="w-5 h-5" />
          DOWNLOAD RESUME.PDF
        </button>
        
        <p className="text-xs text-muted-foreground font-mono mt-4">
          // High-resolution PDF generation protocol activated
        </p>
      </div>
    </div>
  );
};
