import React, { useState } from 'react';
import { FormData } from '../types';
import { Upload, FileText, Loader2, Target, TrendingUp, AlertTriangle, CheckCircle, Eye, EyeOff, X, Star } from 'lucide-react';
import { parseFile, validateFileType, getFileTypeLabel } from '../../utils/fileParser';
import { analyzeWithGemini, UIAnalysisResult } from '../../utils/atsAnalyzer';
import { toast } from 'sonner';

interface ATSAnalysisFormProps {
  formData: FormData;
  setAnalysisCompleted: (value: boolean) => void;
}

export const ATSAnalysisForm: React.FC<ATSAnalysisFormProps> = ({ formData, setAnalysisCompleted }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<UIAnalysisResult | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [showRecommendationsModal, setShowRecommendationsModal] = useState(false);
  const [showDetailedModal, setShowDetailedModal] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!validateFileType(file)) {
      toast.error('Please upload a PDF, DOCX, or TXT file');
      return;
    }

    try {
      const parsedFile = await parseFile(file);
      setJobDescription(parsedFile.content);
      setUploadedFile(file);
      toast.success(`${getFileTypeLabel(file.type)} uploaded successfully`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to parse file');
    }
  };

  const apiKey = "AIzaSyC6D0f4-yB-JJD54aqhtpJOzU6SGMK4hvk";
  
  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please provide a job description');
      return;
    }

    if (!formData.personalInfo.fullName) {
      toast.error('Please complete your resume before analyzing');
      return;
    }

    if (!apiKey) {
      toast.error('API configuration error - please contact support');
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await analyzeWithGemini(
        jobDescription, 
        formData, 
        apiKey
      );
      setAnalysisResult(result);
      if (setAnalysisCompleted) {
        setAnalysisCompleted(true);
      }
      toast.success('ATS analysis completed!');
    } catch (error) {
      console.error('Analysis error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Analysis failed';
      toast.error(`${errorMessage}. Please try again.`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-neon-green';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'from-neon-green to-green-400';
    if (score >= 60) return 'from-yellow-400 to-orange-400';
    return 'from-red-400 to-red-600';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-400/10 border-red-400/30';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'low': return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
    }
  };

  // Modal Component
  const Modal = ({ isOpen, onClose, title, children }: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
  }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Modal Content */}
        <div className="relative bg-ice-darkest border border-ice-medium/30 rounded-lg shadow-2xl max-w-4xl max-h-[90vh] w-full mx-4 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-ice-medium/30">
            <h2 className="text-xl font-bold text-ice-lightest font-mono">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 text-ice-light hover:text-ice-lightest hover:bg-ice-medium/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {children}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-cyber-blue glow-text mb-2">
          ATS COMPATIBILITY ANALYSIS
        </h2>
        <p className="text-ice-darkest font-mono text-sm">
          // Optimize your resume against job requirements
        </p>
      </div>

      {/* Job Description Input */}
      <div className="cyber-card space-y-4">
        <h3 className="text-lg font-semibold text-neon-pink font-mono">
          JOB DESCRIPTION INPUT
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          {/* File Upload */}
          <div className="space-y-2">
            <label className="cyber-label">
              <Upload className="w-4 h-4" />
              Upload Job Description
            </label>
            <div className="relative">
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="cyber-input flex items-center justify-center py-8 border-2 border-dashed border-cyber-blue/30 hover:border-cyber-blue/50 transition-colors">
                <div className="text-center">
                  <Upload className="w-8 h-8 text-cyber-blue mx-auto mb-2" />
                  <p className="text-sm text-ice-lightest">
                    {uploadedFile ? uploadedFile.name : 'Drop PDF, DOCX, or TXT file here'}
                  </p>
                  <p className="text-xs text-ice-light mt-1">
                    or click to browse
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Manual Input */}
          <div className="space-y-2">
            <label className="cyber-label">
              <FileText className="w-4 h-4" />
              Or Paste Text
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              rows={8}
              className="cyber-input resize-none"
            />
          </div>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !jobDescription.trim()}
          className="cyber-button w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              ANALYZING COMPATIBILITY...
            </>
          ) : (
            <>
              <Target className="w-5 h-5" />
              ANALYZE ATS COMPATIBILITY
            </>
          )}
        </button>
      </div>

      {/* Analysis Results */}
      {analysisResult && (
        <div className="space-y-6">
          {/* Overall Score */}
          <div className="cyber-card text-center">
            <h3 className="text-lg font-semibold text-neon-pink font-mono mb-4">
              COMPATIBILITY SCORE
            </h3>
            
            <div className="relative w-32 h-32 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-space-blue to-deep-purple"></div>
              <div className="absolute inset-2 rounded-full bg-space-dark flex items-center justify-center">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getScoreColor(analysisResult.overallScore)}`}>
                    {analysisResult.overallScore}%
                  </div>
                  <div className="text-xs text-ice-light">ATS Score</div>
                </div>
              </div>
            </div>

            <div className="w-full bg-space-blue/30 rounded-full h-3 mb-4">
              <div 
                className={`bg-gradient-to-r ${getScoreBackground(analysisResult.overallScore)} h-3 rounded-full transition-all duration-1000 animate-glow-pulse`}
                style={{ width: `${analysisResult.overallScore}%` }}
              />
            </div>

            <p className="text-sm text-ice-light font-mono mb-6">
              {analysisResult.overallScore >= 80 ? '// Excellent ATS compatibility' :
               analysisResult.overallScore >= 60 ? '// Good compatibility with room for improvement' :
               '// Needs significant optimization for ATS systems'}
            </p>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setShowRecommendationsModal(true)}
                className="cyber-button flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                VIEW RECOMMENDATIONS
              </button>
              <button
                onClick={() => setShowDetailedModal(true)}
                className="cyber-button-secondary flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                DETAILED ANALYSIS
              </button>
            </div>
          </div>

          {/* Quick Overview */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="cyber-card text-center">
              <div className="text-2xl font-bold text-cyber-blue mb-2">
                {analysisResult.keywordMatches.filter(k => k.found).length}/{analysisResult.keywordMatches.length}
              </div>
              <div className="text-sm text-ice-light">Keywords Matched</div>
            </div>
            
            <div className="cyber-card text-center">
              <div className="text-2xl font-bold text-neon-pink mb-2">
                {analysisResult.hardSkillsAnalysis.foundSkills.length}/{analysisResult.hardSkillsAnalysis.requiredSkills.length}
              </div>
              <div className="text-sm text-ice-light">Skills Matched</div>
            </div>
            
            <div className="cyber-card text-center">
              <div className="text-2xl font-bold text-neon-green mb-2">
                {analysisResult.formattingCheck.score}%
              </div>
              <div className="text-sm text-ice-light">Format Score</div>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations Modal */}
      <Modal
        isOpen={showRecommendationsModal}
        onClose={() => setShowRecommendationsModal(false)}
        title="TOP RECOMMENDATIONS"
      >
        {analysisResult && (
          <div className="space-y-4">
            {analysisResult.recommendations.slice(0, 8).map((rec, index) => (
              <div key={index} className={`p-4 rounded-lg border ${getPriorityColor(rec.priority)}`}>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {rec.priority === 'high' && <AlertTriangle className="w-5 h-5" />}
                    {rec.priority === 'medium' && <TrendingUp className="w-5 h-5" />}
                    {rec.priority === 'low' && <CheckCircle className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">{rec.title}</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-current/20 uppercase font-mono">
                        {rec.priority}
                      </span>
                    </div>
                    <p className="text-sm opacity-90 mb-3">{rec.description}</p>
                    <p className="text-xs font-mono opacity-70 bg-current/10 p-2 rounded">
                      → {rec.action}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* Detailed Analysis Modal */}
      <Modal
        isOpen={showDetailedModal}
        onClose={() => setShowDetailedModal(false)}
        title="DETAILED ANALYSIS"
      >
        {analysisResult && (
          <div className="space-y-8">
            {/* Keyword Analysis */}
            <div>
              <h3 className="text-lg font-semibold text-neon-pink font-mono mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" />
                KEYWORD ANALYSIS
              </h3>
              <div className="grid gap-2 max-h-60 overflow-y-auto bg-ice-dark/30 p-4 rounded-lg">
                {analysisResult.keywordMatches.slice(0, 20).map((keyword, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded bg-ice-darkest/50 border border-ice-medium/20">
                    <span className="text-sm font-mono text-ice-lightest">{keyword.keyword}</span>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-1 rounded font-mono ${
                        keyword.importance === 'high' ? 'bg-red-400/20 text-red-400' :
                        keyword.importance === 'medium' ? 'bg-yellow-400/20 text-yellow-400' :
                        'bg-blue-400/20 text-blue-400'
                      }`}>
                        {keyword.importance}
                      </span>
                      <span className={`w-3 h-3 rounded-full ${keyword.found ? 'bg-neon-green' : 'bg-red-400'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Analysis */}
            <div>
              <h3 className="text-lg font-semibold text-neon-pink font-mono mb-4 flex items-center gap-2">
                <Star className="w-5 h-5" />
                SKILLS ANALYSIS
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-ice-dark/30 p-4 rounded-lg">
                  <h4 className="text-sm font-semibold text-neon-green mb-3 font-mono">✓ FOUND SKILLS</h4>
                  <div className="space-y-2">
                    {analysisResult.hardSkillsAnalysis.foundSkills.map((skill, index) => (
                      <div key={index} className="text-sm font-mono text-neon-green bg-green-400/10 p-2 rounded">
                        ✓ {skill}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-ice-dark/30 p-4 rounded-lg">
                  <h4 className="text-sm font-semibold text-red-400 mb-3 font-mono">✗ MISSING CRITICAL SKILLS</h4>
                  <div className="space-y-2">
                    {analysisResult.hardSkillsAnalysis.missingCriticalSkills.map((skill, index) => (
                      <div key={index} className="text-sm font-mono text-red-400 bg-red-400/10 p-2 rounded">
                        ✗ {skill}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Formatting Check */}
            <div>
              <h3 className="text-lg font-semibold text-neon-pink font-mono mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                FORMATTING ANALYSIS
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-ice-dark/30 p-4 rounded-lg">
                  <h4 className="text-sm font-semibold text-neon-green mb-3 font-mono">✓ STRENGTHS</h4>
                  <div className="space-y-2">
                    {analysisResult.formattingCheck.strengths.map((strength, index) => (
                      <div key={index} className="text-sm text-neon-green bg-green-400/10 p-2 rounded">
                        ✓ {strength}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-ice-dark/30 p-4 rounded-lg">
                  <h4 className="text-sm font-semibold text-yellow-400 mb-3 font-mono">⚠ ISSUES</h4>
                  <div className="space-y-2">
                    {analysisResult.formattingCheck.issues.map((issue, index) => (
                      <div key={index} className={`text-sm p-2 rounded ${
                        issue.type === 'critical' ? 'text-red-400 bg-red-400/10' :
                        issue.type === 'warning' ? 'text-yellow-400 bg-yellow-400/10' :
                        'text-blue-400 bg-blue-400/10'
                      }`}>
                        {issue.type === 'critical' ? '⚠' : issue.type === 'warning' ? '⚡' : 'ℹ'} {issue.message}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};