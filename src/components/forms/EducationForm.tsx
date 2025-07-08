
import React from 'react';
import { Education } from '../types';
import { Plus, Trash2, GraduationCap, Calendar, Book } from 'lucide-react';

interface EducationFormProps {
  data: Education[];
  onUpdate: (data: Education[]) => void;
}

export const EducationForm: React.FC<EducationFormProps> = ({ data, onUpdate }) => {
  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      graduationDate: '',
      gpa: '',
    };
    onUpdate([...data, newEducation]);
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    const updated = data.map(edu => 
      edu.id === id ? { ...edu, [field]: value } : edu
    );
    onUpdate(updated);
  };

  const removeEducation = (id: string) => {
    onUpdate(data.filter(edu => edu.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-cyber-blue glow-text mb-2">
          EDUCATION PROTOCOLS
        </h2>
        <p className="text-muted-foreground font-mono text-sm">
          // Compile academic achievement database
        </p>
      </div>

      <div className="space-y-6">
        {data.map((edu, index) => (
          <div key={edu.id} className="cyber-card space-y-4 animate-fade-in">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-neon-pink font-mono">
                EDUCATION #{index + 1}
              </h3>
              <button
                onClick={() => removeEducation(edu.id)}
                className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-red-400/10 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-cyber-blue">
                  <GraduationCap className="w-4 h-4" />
                  Institution
                </label>
                <input
                  type="text"
                  value={edu.institution}
                  onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                  placeholder="Cyber University"
                  className="w-full px-4 py-3 rounded-lg neon-input font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-cyber-blue">
                  <Book className="w-4 h-4" />
                  Qualification
                </label>
                <input
                  type="text"
                  value={edu.degree}
                  onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                  placeholder="Bachelor of Science"
                  className="w-full px-4 py-3 rounded-lg neon-input font-mono text-sm"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-cyber-blue">
                  Field of Study
                </label>
                <input
                  type="text"
                  value={edu.field}
                  onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                  placeholder="Computer Science"
                  className="w-full px-4 py-3 rounded-lg neon-input font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-cyber-blue">
                  <Calendar className="w-4 h-4" />
                  Graduation Date
                </label>
                <input
                  type="month"
                  value={edu.graduationDate}
                  onChange={(e) => updateEducation(edu.id, 'graduationDate', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg neon-input font-mono text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-cyber-blue">
                GPA (Optional)
              </label>
              <input
                type="text"
                value={edu.gpa || ''}
                onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                placeholder="3.8/4.0"
                className="w-full px-4 py-3 rounded-lg neon-input font-mono text-sm"
              />
            </div>
          </div>
        ))}

        <button
          onClick={addEducation}
          className="w-full cyber-button-secondary flex items-center justify-center gap-2 py-4"
        >
          <Plus className="w-5 h-5" />
          ADD EDUCATION MODULE
        </button>
      </div>
    </div>
  );
};
