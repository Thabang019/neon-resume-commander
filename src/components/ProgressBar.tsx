import React from 'react';
import { Check } from 'lucide-react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  onStepClick?: (step: number) => void;
}

const stepLabels = ['Personal', 'Experience', 'Education', 'Skills', 'Projects', 'Template', 'Preview'];

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  currentStep, 
  totalSteps, 
  onStepClick 
}) => {
  const handleStepClick = (stepNumber: number) => {
    if (onStepClick && stepNumber <= currentStep) {
      onStepClick(stepNumber);
    }
  };

  return (
    <div className="glass-panel p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-cyber-blue glow-text">
          PROGRESS TRACKER
        </h2>
        <span className="text-sm text-muted-foreground font-mono">
          {currentStep}/{totalSteps} MODULES COMPLETE
        </span>
      </div>
      
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isClickable = stepNumber <= currentStep;
          
          return (
            <React.Fragment key={stepNumber}>
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                    ${isCompleted 
                      ? 'bg-neon-green border-neon-green text-space-dark animate-glow-pulse' 
                      : isCurrent 
                        ? 'bg-cyber-blue/20 border-cyber-blue text-cyber-blue animate-glow-pulse' 
                        : 'border-muted bg-muted/20 text-muted-foreground'
                    }
                    ${isClickable && onStepClick 
                      ? 'cursor-pointer hover:scale-110 hover:brightness-110' 
                      : ''
                    }
                  `}
                  onClick={() => handleStepClick(stepNumber)}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-mono">{stepNumber}</span>
                  )}
                </div>
                <span className="text-xs mt-2 font-mono text-center max-w-16">
                  {stepLabels[index]}
                </span>
              </div>
              
              {index < totalSteps - 1 && (
                <div 
                  className={`
                    flex-1 h-0.5 mx-4 transition-all duration-500
                    ${stepNumber < currentStep 
                      ? 'bg-gradient-to-r from-neon-green to-cyber-blue' 
                      : 'bg-muted/30'
                    }
                  `}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};