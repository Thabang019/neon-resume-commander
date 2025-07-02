import React, { useState } from 'react';
import { FormData } from '../types';
import { TemplateType } from '../templates/TemplatePreview';
import { Download, CheckCircle, Sparkles, FileText, Palette, Zap, Loader2 } from 'lucide-react';
import { generatePDF } from '../../utils/pdfGenerator';
import { toast } from 'sonner';

interface PreviewFormProps {
  formData: FormData;
  selectedTemplate: TemplateType;
}

export const PreviewForm: React.FC<PreviewFormProps> = ({ formData, selectedTemplate }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    if (!formData.personalInfo.fullName.trim()) {
      toast.error('Please enter your full name before downloading');
      return;
    }

    setIsGenerating(true);
    
    try {
      await generatePDF(formData, selectedTemplate);
      toast.success('Resume downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
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

    // Projects
    if (formData.projects.length > 0) {
      totalFields += formData.projects.length * 5;
      formData.projects.forEach(project => {
        if (project.name) filledFields++;
        if (project.description) filledFields++;
        if (project.technologies) filledFields++;
        if (project.startDate) filledFields++;
        if (project.endDate || project.current) filledFields++;
      });
    }

    return totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;
  };

  const getTemplateIcon = () => {
    switch (selectedTemplate) {
      case 'classic': return FileText;
      case 'modern': return Zap;
      case 'creative': return Palette;
      default: return FileText;
    }
  };

  const getTemplateName = () => {
    switch (selectedTemplate) {
      case 'classic': return 'Classic Professional';
      case 'modern': return 'Modern Minimalist';
      case 'creative': return 'Creative Portfolio';
      default: return 'Classic Professional';
    }
  };

  const completionPercentage = getCompletionPercentage();
  const TemplateIcon = getTemplateIcon();

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
            <div className="flex justify-between">
              <span className="text-muted-foreground">Projects:</span>
              <span className="text-cyber-blue">{formData.projects.length} entries</span>
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
            <div className="flex justify-between">
              <span className="text-muted-foreground">Template:</span>
              <span className="text-neon-pink">{getTemplateName()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="cyber-card space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <TemplateIcon className="w-6 h-6 text-neon-pink" />
          <span className="text-lg font-semibold text-neon-pink">
            {getTemplateName()} Template Selected
          </span>
        </div>
        
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-neon-pink mb-4">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span className="font-mono">DOWNLOAD READY</span>
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          
          <button
            onClick={handleDownload}
            disabled={isGenerating || !formData.personalInfo.fullName.trim()}
            className="cyber-button text-lg px-8 py-4 flex items-center gap-3 mx-auto animate-glow-pulse disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                GENERATING PDF...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                DOWNLOAD {getTemplateName().toUpperCase()} RESUME.PDF
              </>
            )}
          </button>
          
          <p className="text-xs text-muted-foreground font-mono mt-4">
            // High-resolution PDF generation protocol {isGenerating ? 'in progress' : 'activated'}
          </p>
          
          {!formData.personalInfo.fullName.trim() && (
            <p className="text-xs text-red-400 font-mono mt-2">
              ⚠️ Full name required for PDF generation
            </p>
          )}
        </div>
      </div>
    </div>
  );
};