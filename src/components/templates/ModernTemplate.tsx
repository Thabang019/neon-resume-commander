import React from 'react';
import { FormData } from '../types';
import { MapPin, Mail, Phone, Linkedin, Globe, Calendar, Star, ExternalLink, Code } from 'lucide-react';

interface ModernTemplateProps {
  formData: FormData;
}

export const ModernTemplate: React.FC<ModernTemplateProps> = ({ formData }) => {
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
    <div className="bg-white text-gray-900 rounded-lg shadow-2xl min-h-[800px] font-sans text-sm overflow-hidden">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
        <h1 className="text-4xl font-light mb-4">
          {personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="grid md:grid-cols-2 gap-2 text-sm opacity-90">
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

      <div className="p-8">
        {/* Experience */}
        {experience.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-light text-blue-600 mb-6 pb-2 border-b-2 border-blue-100">
              Experience
            </h2>
            <div className="space-y-6">
              {experience.map((exp) => (
                <div key={exp.id} className="relative pl-6 border-l-2 border-blue-100">
                  <div className="absolute w-3 h-3 bg-blue-600 rounded-full -left-2 top-2"></div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">{exp.position || 'Position'}</h3>
                      <p className="text-blue-600 font-medium">{exp.company || 'Company'}</p>
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

        {/* Projects */}
        {projects.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-light text-blue-600 mb-6 pb-2 border-b-2 border-blue-100">
              Projects
            </h2>
            <div className="grid gap-6">
              {projects.map((project) => (
                <div key={project.id} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Code className="w-4 h-4 text-blue-600" />
                        <h3 className="font-semibold text-gray-800">{project.name || 'Project Name'}</h3>
                        {project.url && (
                          <a href={project.url} className="text-blue-600 hover:text-blue-800">
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      {project.technologies && (
                        <p className="text-blue-600 text-sm font-medium mb-2">
                          {project.technologies}
                        </p>
                      )}
                    </div>
                    <div className="text-right text-sm text-gray-500 flex items-center gap-1">
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

        <div className="grid md:grid-cols-2 gap-8">
          {/* Education */}
          {education.length > 0 && (
            <div>
              <h2 className="text-2xl font-light text-blue-600 mb-6 pb-2 border-b-2 border-blue-100">
                Education
              </h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id} className="space-y-1">
                    <h3 className="font-semibold text-gray-800">
                      {edu.degree || 'Degree'} in {edu.field || 'Field'}
                    </h3>
                    <p className="text-blue-600">{edu.institution || 'Institution'}</p>
                    <div className="flex justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(edu.graduationDate)}
                      </div>
                      {edu.gpa && (
                        <div>GPA: {edu.gpa}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div>
              <h2 className="text-2xl font-light text-blue-600 mb-6 pb-2 border-b-2 border-blue-100">
                Skills
              </h2>
              <div className="space-y-3">
                {skills.map((skill) => (
                  <div key={skill.id} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-800">{skill.name || 'Skill'}</span>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 4 }, (_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < getLevelStars(skill.level) 
                                ? 'fill-blue-600 text-blue-600' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(getLevelStars(skill.level) / 4) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Placeholder when empty */}
      {!personalInfo.fullName && experience.length === 0 && education.length === 0 && skills.length === 0 && projects.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-lg mb-2">Modern Template Preview</div>
          <div className="text-sm">Start filling out the form to see your resume</div>
        </div>
      )}
    </div>
  );
};