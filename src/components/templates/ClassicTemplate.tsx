import React from 'react';
import { FormData } from '../types';
import { MapPin, Mail, Phone, Linkedin, Globe, Calendar, Star } from 'lucide-react';

interface ClassicTemplateProps {
  formData: FormData;
}

export const ClassicTemplate: React.FC<ClassicTemplateProps> = ({ formData }) => {
  const { personalInfo, experience, education, skills, projects } = formData;

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
    <div className="bg-white text-gray-900 rounded-lg p-8 shadow-2xl min-h-[800px] font-serif text-sm">
      {/* Header */}
      <div className="border-b-2 border-gray-800 pb-6 mb-6 text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">
          {personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
          {personalInfo.email && (
            <div className="flex items-center gap-1">
              <Mail className="w-4 h-4" />
              {personalInfo.email}
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              {personalInfo.phone}
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {personalInfo.location}
            </div>
          )}
          {personalInfo.linkedIn && (
            <div className="flex items-center gap-1">
              <Linkedin className="w-4 h-4" />
              {personalInfo.linkedIn}
            </div>
          )}
          {personalInfo.portfolio && (
            <div className="flex items-center gap-1">
              <Globe className="w-4 h-4" />
              {personalInfo.portfolio}
            </div>
          )}
        </div>
      </div>

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold border-b border-gray-300 pb-2 mb-4 text-gray-800">
            PROFESSIONAL EXPERIENCE
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{exp.position || 'Position'}</h3>
                    <p className="text-gray-600 font-medium">{exp.company || 'Company'}</p>
                  </div>
                  <div className="text-right text-sm text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                  </div>
                </div>
                {exp.description && (
                  <p className="text-gray-700 leading-relaxed">
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
          <h2 className="text-xl font-bold border-b border-gray-300 pb-2 mb-4 text-gray-800">
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
                    <div className="flex items-center gap-1 text-gray-500">
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
          <h2 className="text-xl font-bold border-b border-gray-300 pb-2 mb-4 text-gray-800">
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
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold border-b border-gray-300 pb-2 mb-4 text-gray-800">
            PROJECTS
          </h2>
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold">{project.name || 'Project Name'}</h3>
                    {project.technologies && (
                      <p className="text-gray-600 text-sm">
                        <strong>Technologies:</strong> {project.technologies}
                      </p>
                    )}
                  </div>
                  <div className="text-right text-sm flex items-center gap-1 text-gray-500">
                    <Calendar className="w-3 h-3" />
                    {formatDate(project.startDate)} - {project.current ? 'Present' : formatDate(project.endDate)}
                  </div>
                </div>
                {project.description && (
                  <p className="text-gray-700 leading-relaxed">
                    {project.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Placeholder when empty */}
      {!personalInfo.fullName && experience.length === 0 && education.length === 0 && skills.length === 0 && projects.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-lg mb-2">Classic Template Preview</div>
          <div className="text-sm">Start filling out the form to see your resume</div>
        </div>
      )}
    </div>
  );
};