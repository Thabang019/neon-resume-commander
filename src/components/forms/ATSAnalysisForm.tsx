import React, { useState } from 'react';
import { FormData } from '../types';
import { Upload, FileText, Loader2, Target, TrendingUp, AlertTriangle, CheckCircle, Eye, EyeOff } from 'lucide-react';
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
  const [showDetailedView, setShowDetailedView] = useState(false);

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
  // Update the handleAnalyze function
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

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-cyber-blue glow-text mb-2">
          ATS COMPATIBILITY ANALYSIS
        </h2>
        <p className="text-muted-foreground font-mono text-sm">
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
                  <p className="text-sm text-muted-foreground">
                    {uploadedFile ? uploadedFile.name : 'Drop PDF, DOCX, or TXT file here'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
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
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neon-pink font-mono">
                COMPATIBILITY SCORE
              </h3>
              <button
                onClick={() => setShowDetailedView(!showDetailedView)}
                className="flex items-center gap-2 text-cyber-blue hover:text-neon-pink transition-colors"
              >
                {showDetailedView ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showDetailedView ? 'Quick View' : 'Detailed View'}
              </button>
            </div>
            
            <div className="relative w-32 h-32 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-space-blue to-deep-purple"></div>
              <div className="absolute inset-2 rounded-full bg-space-dark flex items-center justify-center">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getScoreColor(analysisResult.overallScore)}`}>
                    {analysisResult.overallScore}%
                  </div>
                  <div className="text-xs text-muted-foreground">ATS Score</div>
                </div>
              </div>
            </div>

            <div className="w-full bg-space-blue/30 rounded-full h-3 mb-4">
              <div 
                className={`bg-gradient-to-r ${getScoreBackground(analysisResult.overallScore)} h-3 rounded-full transition-all duration-1000 animate-glow-pulse`}
                style={{ width: `${analysisResult.overallScore}%` }}
              />
            </div>

            <p className="text-sm text-muted-foreground font-mono">
              {analysisResult.overallScore >= 80 ? '// Excellent ATS compatibility' :
               analysisResult.overallScore >= 60 ? '// Good compatibility with room for improvement' :
               '// Needs significant optimization for ATS systems'}
            </p>
          </div>

          {/* Quick Overview */}
          {!showDetailedView && (
            <div className="grid md:grid-cols-3 gap-4">
              <div className="cyber-card text-center">
                <div className="text-2xl font-bold text-cyber-blue mb-2">
                  {analysisResult.keywordMatches.filter(k => k.found).length}/{analysisResult.keywordMatches.length}
                </div>
                <div className="text-sm text-muted-foreground">Keywords Matched</div>
              </div>
              
              <div className="cyber-card text-center">
                <div className="text-2xl font-bold text-neon-pink mb-2">
                  {analysisResult.hardSkillsAnalysis.foundSkills.length}/{analysisResult.hardSkillsAnalysis.requiredSkills.length}
                </div>
                <div className="text-sm text-muted-foreground">Skills Matched</div>
              </div>
              
              <div className="cyber-card text-center">
                <div className="text-2xl font-bold text-neon-green mb-2">
                  {analysisResult.formattingCheck.score}%
                </div>
                <div className="text-sm text-muted-foreground">Format Score</div>
              </div>
            </div>
          )}

          {/* Top Recommendations */}
          <div className="cyber-card">
            <h3 className="text-lg font-semibold text-neon-pink font-mono mb-4">
              TOP RECOMMENDATIONS
            </h3>
            <div className="space-y-3">
              {analysisResult.recommendations.slice(0, 5).map((rec, index) => (
                <div key={index} className={`p-3 rounded-lg border ${getPriorityColor(rec.priority)}`}>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {rec.priority === 'high' && <AlertTriangle className="w-4 h-4" />}
                      {rec.priority === 'medium' && <TrendingUp className="w-4 h-4" />}
                      {rec.priority === 'low' && <CheckCircle className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{rec.title}</span>
                        <span className="text-xs px-2 py-1 rounded-full bg-current/20 uppercase">
                          {rec.priority}
                        </span>
                      </div>
                      <p className="text-sm opacity-80 mb-2">{rec.description}</p>
                      <p className="text-xs font-mono opacity-60">→ {rec.action}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Analysis */}
          {showDetailedView && (
            <div className="space-y-6">
              {/* Keyword Analysis */}
              <div className="cyber-card">
                <h3 className="text-lg font-semibold text-neon-pink font-mono mb-4">
                  KEYWORD ANALYSIS
                </h3>
                <div className="grid gap-2 max-h-60 overflow-y-auto">
                  {analysisResult.keywordMatches.slice(0, 20).map((keyword, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded bg-space-blue/20">
                      <span className="text-sm font-mono">{keyword.keyword}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded ${
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
              <div className="cyber-card">
                <h3 className="text-lg font-semibold text-neon-pink font-mono mb-4">
                  SKILLS ANALYSIS
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-neon-green mb-2">Found Skills</h4>
                    <div className="space-y-1">
                      {analysisResult.hardSkillsAnalysis.foundSkills.map((skill, index) => (
                        <div key={index} className="text-sm font-mono text-neon-green">
                          ✓ {skill}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-red-400 mb-2">Missing Critical Skills</h4>
                    <div className="space-y-1">
                      {analysisResult.hardSkillsAnalysis.missingCriticalSkills.map((skill, index) => (
                        <div key={index} className="text-sm font-mono text-red-400">
                          ✗ {skill}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Formatting Check */}
              <div className="cyber-card">
                <h3 className="text-lg font-semibold text-neon-pink font-mono mb-4">
                  FORMATTING ANALYSIS
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-neon-green mb-2">Strengths</h4>
                    <div className="space-y-1">
                      {analysisResult.formattingCheck.strengths.map((strength, index) => (
                        <div key={index} className="text-sm text-neon-green">
                          ✓ {strength}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-yellow-400 mb-2">Issues</h4>
                    <div className="space-y-1">
                      {analysisResult.formattingCheck.issues.map((issue, index) => (
                        <div key={index} className={`text-sm ${
                          issue.type === 'critical' ? 'text-red-400' :
                          issue.type === 'warning' ? 'text-yellow-400' :
                          'text-blue-400'
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
        </div>
      )}
    </div>
  );
};