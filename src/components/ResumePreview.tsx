
import React from 'react';
import { FormData } from './types';
import { MapPin, Mail, Phone, Linkedin, Globe, Calendar, Star } from 'lucide-react';

interface ResumePreviewProps {
  formData: FormData;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ formData }) => {
  const { personalInfo, experience, education, skills } = formData;

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString + '-01');
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  const getLevelStars = (level: string) => {
    const levels = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3, 'Expert': 4 };
    return levels[level as keyof typeof levels] || 0;
  };

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

      <div className="bg-white text-gray-900 rounded-lg p-8 shadow-2xl min-h-[800px] font-mono text-sm">
        {/* Header */}
        <div className="border-b-2 border-gray-800 pb-6 mb-6">
          <h1 className="text-3xl font-bold mb-2">
            {personalInfo.fullName || 'Your Name'}
          </h1>
          <div className="grid md:grid-cols-2 gap-2 text-sm">
            {personalInfo.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {personalInfo.email}
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {personalInfo.phone}
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {personalInfo.location}
              </div>
            )}
            {personalInfo.linkedIn && (
              <div className="flex items-center gap-2">
                <Linkedin className="w-4 h-4" />
                {personalInfo.linkedIn}
              </div>
            )}
            {personalInfo.portfolio && (
              <div className="flex items-center gap-2 md:col-span-2">
                <Globe className="w-4 h-4" />
                {personalInfo.portfolio}
              </div>
            )}
          </div>
        </div>

        {/* Experience */}
        {experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold border-b border-gray-300 pb-2 mb-4">
              EXPERIENCE
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold">{exp.position || 'Position'}</h3>
                      <p className="text-gray-600">{exp.company || 'Company'}</p>
                    </div>
                    <div className="text-right text-sm flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                    </div>
                  </div>
                  {exp.description && (
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold border-b border-gray-300 pb-2 mb-4">
              EDUCATION
            </h2>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="space-y-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold">
                        {edu.degree || 'Degree'} in {edu.field || 'Field'}
                      </h3>
                      <p className="text-gray-600">{edu.institution || 'Institution'}</p>
                    </div>
                    <div className="text-right text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(edu.graduationDate)}
                      </div>
                      {edu.gpa && (
                        <div className="text-gray-600">GPA: {edu.gpa}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold border-b border-gray-300 pb-2 mb-4">
              SKILLS
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {skills.map((skill) => (
                <div key={skill.id} className="flex justify-between items-center">
                  <span className="font-medium">{skill.name || 'Skill'}</span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 4 }, (_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < getLevelStars(skill.level) 
                            ? 'fill-gray-800 text-gray-800' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-xs text-gray-600 ml-1">
                      {skill.level}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Placeholder when empty */}
        {!personalInfo.fullName && experience.length === 0 && education.length === 0 && skills.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <div className="text-lg mb-2">Preview will appear here</div>
            <div className="text-sm">Start filling out the form to see your resume</div>
          </div>
        )}
      </div>
    </div>
  );
};
