
import React from 'react';
import { Skill } from '../types';
import { Plus, Trash2, Zap, Star } from 'lucide-react';

interface SkillsFormProps {
  data: Skill[];
  onUpdate: (data: Skill[]) => void;
}

const skillLevels: Skill['level'][] = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

export const SkillsForm: React.FC<SkillsFormProps> = ({ data, onUpdate }) => {
  const addSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: '',
      level: 'Intermediate',
    };
    onUpdate([...data, newSkill]);
  };

  const updateSkill = (id: string, field: keyof Skill, value: any) => {
    const updated = data.map(skill => 
      skill.id === id ? { ...skill, [field]: value } : skill
    );
    onUpdate(updated);
  };

  const removeSkill = (id: string) => {
    onUpdate(data.filter(skill => skill.id !== id));
  };

  const getLevelColor = (level: Skill['level']) => {
    switch (level) {
      case 'Beginner': return 'text-yellow-400';
      case 'Intermediate': return 'text-blue-400';
      case 'Advanced': return 'text-green-400';
      case 'Expert': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const getLevelStars = (level: Skill['level']) => {
    const stars = {
      'Beginner': 1,
      'Intermediate': 2,
      'Advanced': 3,
      'Expert': 4
    };
    return stars[level];
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-cyber-blue glow-text mb-2">
          SKILL MATRIX
        </h2>
        <p className="text-muted-foreground font-mono text-sm">
          // Configure ability parameters
        </p>
      </div>

      <div className="space-y-4">
        {data.map((skill, index) => (
          <div key={skill.id} className="cyber-card animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-neon-pink font-mono">
                SKILL #{index + 1}
              </h3>
              <button
                onClick={() => removeSkill(skill.id)}
                className="text-red-400 hover:text-red-300 transition-colors p-2 hover:bg-red-400/10 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-cyber-blue">
                  <Zap className="w-4 h-4" />
                  Skill Name
                </label>
                <input
                  type="text"
                  value={skill.name}
                  onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                  placeholder="JavaScript, Python, etc."
                  className="w-full px-4 py-3 rounded-lg neon-input font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-cyber-blue">
                  <Star className="w-4 h-4" />
                  Proficiency Level
                </label>
                <select
                  value={skill.level}
                  onChange={(e) => updateSkill(skill.id, 'level', e.target.value as Skill['level'])}
                  className="w-full px-4 py-3 rounded-lg neon-input font-mono text-sm"
                >
                  {skillLevels.map(level => (
                    <option key={level} value={level} className="bg-space-light">
                      {level}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Level:</span>
              <span className={`font-semibold ${getLevelColor(skill.level)}`}>
                {skill.level}
              </span>
              <div className="flex ml-2">
                {Array.from({ length: 4 }, (_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < getLevelStars(skill.level) 
                        ? getLevelColor(skill.level) + ' fill-current' 
                        : 'text-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addSkill}
          className="w-full cyber-button-secondary flex items-center justify-center gap-2 py-4"
        >
          <Plus className="w-5 h-5" />
          ADD SKILL MODULE
        </button>
      </div>
    </div>
  );
};
