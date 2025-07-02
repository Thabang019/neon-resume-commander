import React from 'react';
import { FormData } from '../types';
import { MapPin, Mail, Phone, Linkedin, Globe, Calendar, Star, ExternalLink, Code, Briefcase, GraduationCap } from 'lucide-react';

interface CreativeTemplateProps {
  formData: FormData;
}

export const CreativeTemplate: React.FC<CreativeTemplateProps> = ({ formData }) => {
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
      <div className="grid md:grid-cols-3 min-h-[800px]">
        {/* Left Sidebar */}
        <div className="bg-gradient-to-b from-purple-600 to-pink-600 text-white p-6">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl font-bold">
                {personalInfo.fullName ? personalInfo.fullName.split(' ').map(n => n[0]).join('') : 'YN'}
              </span>
            </div>
            <h1 className="text-2xl font-bold mb-2">
              {personalInfo.fullName || 'Your Name'}
            </h1>
          </div>

          {/* Contact Info */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 border-b border-white/30 pb-2">Contact</h3>
            <div className="space-y-3 text-sm">
              {personalInfo.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span className="break-all">{personalInfo.email}</span>
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
                  <span className="break-all">{personalInfo.linkedIn}</span>
                </div>
              )}
              {personalInfo.portfolio && (
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span className="break-all">{personalInfo.portfolio}</span>
                </div>
              )}
            </div>
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 border-b border-white/30 pb-2">Skills</h3>
              <div className="space-y-4">
                {skills.map((skill) => (
                  <div key={skill.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{skill.name || 'Skill'}</span>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 4 }, (_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < getLevelStars(skill.level) 
                                ? 'fill-white text-white' 
                                : 'text-white/30'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div 
                        className="bg-white h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(getLevelStars(skill.level) / 4) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 border-b border-white/30 pb-2 flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Education
              </h3>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id} className="space-y-1">
                    <h4 className="font-semibold">
                      {edu.degree || 'Degree'}
                    </h4>
                    <p className="text-white/80 text-sm">{edu.field || 'Field'}</p>
                    <p className="text-white/80 text-sm">{edu.institution || 'Institution'}</p>
                    <div className="flex justify-between text-xs text-white/70">
                      <span>{formatDate(edu.graduationDate)}</span>
                      {edu.gpa && <span>GPA: {edu.gpa}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Content */}
        <div className="md:col-span-2 p-8">
          {/* Experience */}
          {experience.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-purple-600 mb-6 flex items-center gap-2">
                <Briefcase className="w-6 h-6" />
                Professional Experience
              </h2>
              <div className="space-y-6">
                {experience.map((exp, index) => (
                  <div key={exp.id} className="relative">
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-4 h-4 bg-purple-600 rounded-full"></div>
                        {index < experience.length - 1 && (
                          <div className="w-0.5 h-16 bg-purple-200 mt-2"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-bold text-lg text-gray-800">{exp.position || 'Position'}</h3>
                            <p className="text-purple-600 font-semibold">{exp.company || 'Company'}</p>
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
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-purple-600 mb-6 flex items-center gap-2">
                <Code className="w-6 h-6" />
                Featured Projects
              </h2>
              <div className="grid gap-6">
                {projects.map((project) => (
                  <div key={project.id} className="border-l-4 border-purple-600 pl-4 bg-gray-50 p-4 rounded-r-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-800">{project.name || 'Project Name'}</h3>
                          {project.url && (
                            <a href={project.url} className="text-purple-600 hover:text-purple-800">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                        {project.technologies && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {project.technologies.split(',').map((tech, index) => (
                              <span key={index} className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                                {tech.trim()}
                              </span>
                            ))}
                          </div>
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
        </div>
      </div>

      {/* Placeholder when empty */}
      {!personalInfo.fullName && experience.length === 0 && education.length === 0 && skills.length === 0 && projects.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <div className="text-lg mb-2">Creative Template Preview</div>
            <div className="text-sm">Start filling out the form to see your resume</div>
          </div>
        </div>
      )}
    </div>
  );
};