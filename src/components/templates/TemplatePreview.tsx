import React from 'react';
import { FormData } from '../types';
import { ClassicTemplate } from './ClassicTemplate';
import { ModernTemplate } from './ModernTemplate';
import { CreativeTemplate } from './CreativeTemplate';

export type TemplateType = 'classic' | 'modern' | 'creative';

interface TemplatePreviewProps {
  formData: FormData;
  template: TemplateType;
}

export const TemplatePreview: React.FC<TemplatePreviewProps> = ({ formData, template }) => {
  switch (template) {
    case 'classic':
      return <ClassicTemplate formData={formData} />;
    case 'modern':
      return <ModernTemplate formData={formData} />;
    case 'creative':
      return <CreativeTemplate formData={formData} />;
    default:
      return <ClassicTemplate formData={formData} />;
  }
};