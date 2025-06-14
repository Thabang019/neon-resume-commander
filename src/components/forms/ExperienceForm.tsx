
import React, { useState } from 'react';
import { Experience } from '../types';
import { Plus, Trash2, Building, Calendar, FileText } from 'lucide-react';

interface ExperienceFormProps {
  data: Experience[];
  onUpdate: (data: Experience[]) => void;
}

export const ExperienceForm: React.FC<ExperienceFormProps> = ({ data, onUpdate }) => {
  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: '',
      current: false,
    };
    onUpdate([...data, newExperience]);
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    const updated = data.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    );
    onUpdate(updated);
  };

  const removeExperience = (id: string) => {
    onUpdate(data.filter(exp => exp.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-cyber-blue glow-text mb-2">
          EXPERIENCE MATRIX
        </h2>
        <p className="text-muted-foreground font-mono text-sm">
          // Load professional experience modules
        </p>
      </div>

      <div className="space-y-6">
        {data.map((exp, index) => (
          <div key={exp.id} className="cyber-card space-y-4 animate-fade-in">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-neon-pink font-mono">
                EXPERIENCE #{index + 1}
              </h3>
              <button
                onClick={() => removeExperience(exp.id)}
                className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-red-400/10 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-cyber-blue">
                  <Building className="w-4 h-4" />
                  Company
                </label>
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                  placeholder="Cyber Corp"
                  className="w-full px-4 py-3 rounded-lg neon-input font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-cyber-blue">
                  <FileText className="w-4 h-4" />
                  Position
                </label>
                <input
                  type="text"
                  value={exp.position}
                  onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                  placeholder="Senior Developer"
                  className="w-full px-4 py-3 rounded-lg neon-input font-mono text-sm"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-cyber-blue">
                  <Calendar className="w-4 h-4" />
                  Start Date
                </label>
                <input
                  type="month"
                  value={exp.startDate}
                  onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg neon-input font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-cyber-blue">
                  <Calendar className="w-4 h-4" />
                  End Date
                </label>
                <div className="space-y-2">
                  <input
                    type="month"
                    value={exp.endDate}
                    onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                    disabled={exp.current}
                    className="w-full px-4 py-3 rounded-lg neon-input font-mono text-sm disabled:opacity-50"
                  />
                  <label className="flex items-center gap-2 text-sm text-neon-pink">
                    <input
                      type="checkbox"
                      checked={exp.current}
                      onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                      className="rounded"
                    />
                    Current Position
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-cyber-blue">
                Job Description
              </label>
              <textarea
                value={exp.description}
                onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                placeholder="Describe your achievements and responsibilities..."
                rows={4}
                className="w-full px-4 py-3 rounded-lg neon-input font-mono text-sm resize-none"
              />
            </div>
          </div>
        ))}

        <button
          onClick={addExperience}
          className="w-full border-2 border-dashed border-cyber-blue/30 rounded-lg p-6 text-cyber-blue hover:border-cyber-blue/50 hover:bg-cyber-blue/5 transition-all duration-300 flex items-center justify-center gap-2 font-mono"
        >
          <Plus className="w-5 h-5" />
          ADD EXPERIENCE MODULE
        </button>
      </div>
    </div>
  );
};
