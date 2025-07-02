import React from 'react';
import { TemplateType } from '../templates/TemplatePreview';
import { FileText, Zap, Palette, Check } from 'lucide-react';

interface TemplateSelectionFormProps {
  selectedTemplate: TemplateType;
  onTemplateChange: (template: TemplateType) => void;
}

const templates = [
  {
    id: 'classic' as TemplateType,
    name: 'Classic Professional',
    description: 'Traditional, clean design perfect for corporate environments',
    icon: FileText,
    color: 'from-gray-600 to-gray-800',
    features: ['Traditional Layout', 'Professional Typography', 'ATS-Friendly']
  },
  {
    id: 'modern' as TemplateType,
    name: 'Modern Minimalist',
    description: 'Contemporary design with clean lines and modern aesthetics',
    icon: Zap,
    color: 'from-blue-600 to-purple-600',
    features: ['Timeline Design', 'Progress Bars', 'Color Accents']
  },
  {
    id: 'creative' as TemplateType,
    name: 'Creative Portfolio',
    description: 'Eye-catching design for creative professionals and designers',
    icon: Palette,
    color: 'from-purple-600 to-pink-600',
    features: ['Sidebar Layout', 'Visual Elements', 'Creative Styling']
  }
];

export const TemplateSelectionForm: React.FC<TemplateSelectionFormProps> = ({
  selectedTemplate,
  onTemplateChange
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-cyber-blue glow-text mb-2">
          TEMPLATE SELECTION
        </h2>
        <p className="text-muted-foreground font-mono text-sm">
          // Choose your resume design template
        </p>
      </div>

      <div className="grid gap-6">
        {templates.map((template) => {
          const Icon = template.icon;
          const isSelected = selectedTemplate === template.id;
          
          return (
            <div
              key={template.id}
              className={`
                relative cursor-pointer transition-all duration-300 rounded-lg border-2 p-6
                ${isSelected 
                  ? 'border-cyber-blue bg-cyber-blue/10 shadow-lg shadow-cyber-blue/20' 
                  : 'border-muted hover:border-cyber-blue/50 hover:bg-cyber-blue/5'
                }
              `}
              onClick={() => onTemplateChange(template.id)}
            >
              {isSelected && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-cyber-blue rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-space-dark" />
                </div>
              )}
              
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${template.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {template.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {template.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {template.features.map((feature, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-muted rounded-full text-xs text-muted-foreground"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="cyber-card text-center">
        <p className="text-sm text-muted-foreground font-mono">
          Selected: <span className="text-cyber-blue font-semibold">
            {templates.find(t => t.id === selectedTemplate)?.name}
          </span>
        </p>
      </div>
    </div>
  );
};