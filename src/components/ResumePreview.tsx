import React from 'react';
import { FormData } from './types';
import { TemplateType, TemplatePreview } from './templates/TemplatePreview';

interface ResumePreviewProps {
  formData: FormData;
  selectedTemplate: TemplateType;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ formData, selectedTemplate }) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-neon-pink glow-text mb-2">
          LIVE PREVIEW
        </h2>
        <p className="text-muted-foreground font-mono text-sm">
          // Real-time resume compilation
        </p>
      </div>

      <TemplatePreview formData={formData} template={selectedTemplate} />
    </div>
  );
};