
import React from 'react';
import { PersonalInfo } from '../types';
import { User, Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';

interface PersonalInfoFormProps {
  data: PersonalInfo;
  onUpdate: (data: PersonalInfo) => void;
}

export const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ data, onUpdate }) => {
  const handleChange = (field: keyof PersonalInfo, value: string) => {
    onUpdate({ ...data, [field]: value });
  };

  const fields = [
    { key: 'fullName' as keyof PersonalInfo, label: 'Full Name', icon: User, placeholder: 'John Doe' },
    { key: 'email' as keyof PersonalInfo, label: 'Email Address', icon: Mail, placeholder: 'john.doe@example.com' },
    { key: 'phone' as keyof PersonalInfo, label: 'Phone Number', icon: Phone, placeholder: '+1 (555) 123-4567' },
    { key: 'location' as keyof PersonalInfo, label: 'Location', icon: MapPin, placeholder: 'New York, NY' },
    { key: 'linkedIn' as keyof PersonalInfo, label: 'LinkedIn Profile', icon: Linkedin, placeholder: 'linkedin.com/in/johndoe' },
    { key: 'portfolio' as keyof PersonalInfo, label: 'Portfolio Website', icon: Globe, placeholder: 'johndoe.dev' },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-cyber-blue glow-text mb-2">
          PERSONAL INFORMATION
        </h2>
        <p className="text-muted-foreground font-mono text-sm">
          // Initialize your digital identity matrix
        </p>
      </div>

      <div className="grid gap-6">
        {fields.map(({ key, label, icon: Icon, placeholder }) => (
          <div key={key} className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-cyber-blue">
              <Icon className="w-4 h-4" />
              {label}
            </label>
            <input
              type="text"
              value={data[key]}
              onChange={(e) => handleChange(key, e.target.value)}
              placeholder={placeholder}
              className="w-full px-4 py-3 rounded-lg neon-input font-mono text-sm"
            />
          </div>
        ))}
      </div>
    </div>
  );
};
