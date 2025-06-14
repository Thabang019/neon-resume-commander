
import React, { useState } from 'react';
import { Project } from '../types';
import { Plus, Trash2, Calendar, ExternalLink, Code } from 'lucide-react';

interface ProjectsFormProps {
  data: Project[];
  onUpdate: (data: Project[]) => void;
}

export const ProjectsForm: React.FC<ProjectsFormProps> = ({ data, onUpdate }) => {
  const [projects, setProjects] = useState<Project[]>(data);

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: '',
      description: '',
      technologies: '',
      startDate: '',
      endDate: '',
      url: '',
      current: false
    };
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    onUpdate(updatedProjects);
  };

  const updateProject = (id: string, field: keyof Project, value: string | boolean) => {
    const updatedProjects = projects.map(project =>
      project.id === id ? { ...project, [field]: value } : project
    );
    setProjects(updatedProjects);
    onUpdate(updatedProjects);
  };

  const removeProject = (id: string) => {
    const updatedProjects = projects.filter(project => project.id !== id);
    setProjects(updatedProjects);
    onUpdate(updatedProjects);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-cyber-blue glow-text mb-2">
          PROJECT ARCHIVE
        </h2>
        <p className="text-muted-foreground font-mono text-sm">
          // Cataloging development achievements and innovations
        </p>
      </div>

      <div className="space-y-6">
        {projects.map((project, index) => (
          <div key={project.id} className="cyber-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neon-pink font-mono">
                PROJECT #{index + 1:02d}
              </h3>
              <button
                onClick={() => removeProject(project.id)}
                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-all duration-300"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="cyber-input-group">
                <label className="cyber-label">
                  <Code className="w-4 h-4" />
                  Project Name
                </label>
                <input
                  type="text"
                  value={project.name}
                  onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                  className="cyber-input"
                  placeholder="Enter project name..."
                />
              </div>

              <div className="cyber-input-group">
                <label className="cyber-label">
                  <ExternalLink className="w-4 h-4" />
                  Project URL (Optional)
                </label>
                <input
                  type="url"
                  value={project.url}
                  onChange={(e) => updateProject(project.id, 'url', e.target.value)}
                  className="cyber-input"
                  placeholder="https://github.com/..."
                />
              </div>
            </div>

            <div className="cyber-input-group">
              <label className="cyber-label">Technologies Used</label>
              <input
                type="text"
                value={project.technologies}
                onChange={(e) => updateProject(project.id, 'technologies', e.target.value)}
                className="cyber-input"
                placeholder="React, TypeScript, Node.js, etc..."
              />
            </div>

            <div className="cyber-input-group">
              <label className="cyber-label">Project Description</label>
              <textarea
                value={project.description}
                onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                className="cyber-input min-h-[100px] resize-none"
                placeholder="Describe your project, its features, and impact..."
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="cyber-input-group">
                <label className="cyber-label">
                  <Calendar className="w-4 h-4" />
                  Start Date
                </label>
                <input
                  type="month"
                  value={project.startDate}
                  onChange={(e) => updateProject(project.id, 'startDate', e.target.value)}
                  className="cyber-input"
                />
              </div>

              <div className="cyber-input-group">
                <label className="cyber-label">
                  <Calendar className="w-4 h-4" />
                  End Date
                </label>
                <input
                  type="month"
                  value={project.endDate}
                  onChange={(e) => updateProject(project.id, 'endDate', e.target.value)}
                  className="cyber-input"
                  disabled={project.current}
                />
              </div>

              <div className="cyber-input-group">
                <label className="cyber-label">Status</label>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    checked={project.current}
                    onChange={(e) => updateProject(project.id, 'current', e.target.checked)}
                    className="cyber-checkbox"
                  />
                  <span className="text-sm text-muted-foreground font-mono">
                    Currently working on this
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addProject}
          className="w-full cyber-button-secondary flex items-center justify-center gap-2 py-4"
        >
          <Plus className="w-5 h-5" />
          ADD NEW PROJECT
        </button>
      </div>
    </div>
  );
};
