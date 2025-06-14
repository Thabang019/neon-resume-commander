
import React from 'react';
import { Terminal, Zap } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="glass-panel mx-4 mt-4 p-4 animate-fade-in">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyber-blue/20 rounded-lg border border-cyber-blue/30 animate-glow-pulse">
            <Terminal className="w-6 h-6 text-cyber-blue" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-cyber-blue glow-text">
              NEON RESUME COMMANDER
            </h1>
            <p className="text-sm text-muted-foreground">
              // Initializing futuristic resume generation protocol...
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-neon-pink">
          <Zap className="w-4 h-4 animate-pulse" />
          <span className="text-sm font-mono">SYSTEM ONLINE</span>
        </div>
      </div>
    </header>
  );
};
