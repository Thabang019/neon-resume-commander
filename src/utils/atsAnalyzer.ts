import { FormData } from '../components/types';

// Add this interface to atsAnalyzer.ts
export interface UIAnalysisResult extends Omit<ATSAnalysisResult, 'hardSkillsAnalysis' | 'keywordMatches' | 'formattingCheck'> {
  hardSkillsAnalysis: {
    foundSkills: string[];
    requiredSkills: string[];
    missingCriticalSkills: string[];
    skillsScore: number;
    recommendations: string[];
  };
  keywordMatches: {
    keyword: string;
    found: boolean;
    importance: 'high' | 'medium' | 'low';
    frequency: number;
    positions: number[];
  }[];
  formattingCheck: {
    score: number;
    strengths: string[];
    issues: {
      message: string;
      type: 'critical' | 'warning' | 'info';
    }[];
    suggestions: string[];
    fontConsistency: boolean;
    spacing: boolean;
    structure: boolean;
  };
}

// Define missing interfaces
export interface KeywordMatch {
  keyword: string;
  frequency: number;
  positions: number[];
  relevance: 'high' | 'medium' | 'low';
}

export interface HardSkillsAnalysis {
  matchedSkills: string[];
  missingSkills: string[];
  skillsScore: number;
  recommendations: string[];
}

export interface FormattingCheck {
  score: number;
  issues: string[];
  suggestions: string[];
  fontConsistency: boolean;
  spacing: boolean;
  structure: boolean;
}

export interface ContentEnhancement {
  actionVerbsUsed: number;
  quantifiedAchievements: number;
  industryKeywords: number;
  readabilityScore: number;
  suggestions: string[];
}

export interface Recommendation {
  priority: 'high' | 'medium' | 'low';
  category: 'keywords' | 'skills' | 'formatting' | 'content';
  title: string;
  description: string;
  action: string;
}

// Enhanced interfaces with AI-powered features
export interface ATSAnalysisResult {
  overallScore: number;
  keywordMatches: KeywordMatch[];
  missingKeywords: string[];
  hardSkillsAnalysis: HardSkillsAnalysis;
  formattingCheck: FormattingCheck;
  contentEnhancement: ContentEnhancement;
  recommendations: Recommendation[];
  aiInsights?: AIInsights; // New AI-powered insights
}

export interface AIInsights {
  overallAssessment: string;
  keyStrengths: string[];
  criticalGaps: string[];
  industryAlignment: {
    score: number;
    feedback: string;
  };
  contentQuality: {
    score: number;
    feedback: string;
  };
  competitiveAnalysis: string;
  tailoredSuggestions: string[];
}

// Basic ATS Analyzer implementation
export class ATSAnalyzer {
  private jobDescription: string;
  private resumeData: FormData;

  constructor(jobDescription: string, resumeData: FormData) {
    this.jobDescription = jobDescription;
    this.resumeData = resumeData;
  }

  public analyze(): ATSAnalysisResult {
    const keywordMatches = this.analyzeKeywords();
    const hardSkillsAnalysis = this.analyzeHardSkills();
    const formattingCheck = this.checkFormatting();
    const contentEnhancement = this.analyzeContent();
    const recommendations = this.generateRecommendations();

    const overallScore = this.calculateOverallScore(
      keywordMatches,
      hardSkillsAnalysis,
      formattingCheck,
      contentEnhancement
    );

    return {
      overallScore,
      keywordMatches,
      missingKeywords: this.findMissingKeywords(),
      hardSkillsAnalysis,
      formattingCheck,
      contentEnhancement,
      recommendations
    };
  }

  private analyzeKeywords(): KeywordMatch[] {
    const jobKeywords = this.extractKeywords(this.jobDescription);
    const resumeText = this.getResumeText();
    
    return jobKeywords.map(keyword => ({
      keyword,
      frequency: this.countKeywordFrequency(keyword, resumeText),
      positions: this.findKeywordPositions(keyword, resumeText),
      relevance: this.determineKeywordRelevance(keyword)
    }));
  }

  private analyzeHardSkills(): HardSkillsAnalysis {
    const jobSkills = this.extractHardSkills(this.jobDescription);
    const resumeSkills = this.resumeData.skills.map(skill => skill.name.toLowerCase());
    
    const matchedSkills = jobSkills.filter(skill => 
      resumeSkills.some(rSkill => rSkill.includes(skill.toLowerCase()))
    );
    
    const missingSkills = jobSkills.filter(skill => 
      !resumeSkills.some(rSkill => rSkill.includes(skill.toLowerCase()))
    );

    return {
      matchedSkills,
      missingSkills,
      skillsScore: (matchedSkills.length / jobSkills.length) * 100,
      recommendations: this.generateSkillRecommendations(missingSkills)
    };
  }

  private checkFormatting(): FormattingCheck {
    // Basic formatting checks
    const issues: string[] = [];
    const suggestions: string[] = [];

    if (this.resumeData.personalInfo.email && !this.isValidEmail(this.resumeData.personalInfo.email)) {
      issues.push('Invalid email format');
      suggestions.push('Use a professional email address');
    }

    if (this.resumeData.experience.length === 0) {
      issues.push('No work experience listed');
      suggestions.push('Add relevant work experience');
    }

    return {
      score: Math.max(0, 100 - (issues.length * 20)),
      issues,
      suggestions,
      fontConsistency: true,
      spacing: true,
      structure: this.resumeData.experience.length > 0
    };
  }

  private analyzeContent(): ContentEnhancement {
    const resumeText = this.getResumeText();
    const actionVerbs = ['achieved', 'managed', 'developed', 'implemented', 'created', 'led'];
    const actionVerbsUsed = actionVerbs.filter(verb => 
      resumeText.toLowerCase().includes(verb)
    ).length;

    const quantifiedAchievements = (resumeText.match(/\d+%|\$\d+|\d+\+/g) || []).length;
    const industryKeywords = this.countIndustryKeywords(resumeText);

    return {
      actionVerbsUsed,
      quantifiedAchievements,
      industryKeywords,
      readabilityScore: this.calculateReadabilityScore(resumeText),
      suggestions: this.generateContentSuggestions(actionVerbsUsed, quantifiedAchievements)
    };
  }

  private generateRecommendations(): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Add basic recommendations
    if (this.resumeData.skills.length < 5) {
      recommendations.push({
        priority: 'high',
        category: 'skills',
        title: 'Add More Skills',
        description: 'Your resume has fewer than 5 skills listed',
        action: 'Add relevant technical and soft skills'
      });
    }

    if (this.resumeData.experience.length === 0) {
      recommendations.push({
        priority: 'high',
        category: 'content',
        title: 'Add Work Experience',
        description: 'No work experience is listed',
        action: 'Include relevant work experience and achievements'
      });
    }

    return recommendations;
  }

  private calculateOverallScore(
    keywordMatches: KeywordMatch[],
    hardSkills: HardSkillsAnalysis,
    formatting: FormattingCheck,
    content: ContentEnhancement
  ): number {
    const keywordScore = keywordMatches.length > 0 ? 
      keywordMatches.reduce((sum, match) => sum + match.frequency, 0) / keywordMatches.length * 20 : 0;
    
    return Math.round(
      (keywordScore + hardSkills.skillsScore + formatting.score + content.readabilityScore) / 4
    );
  }

  private extractKeywords(text: string): string[] {
    // Simple keyword extraction - in real implementation, use NLP
    const commonKeywords = text.toLowerCase()
      .split(/[\s,.-]+/)
      .filter(word => word.length > 3)
      .slice(0, 20);
    
    return [...new Set(commonKeywords)];
  }

  private extractHardSkills(text: string): string[] {
    const skillPatterns = [
      'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 'AWS', 'Docker',
      'Kubernetes', 'Git', 'TypeScript', 'Vue.js', 'Angular', 'MongoDB', 'PostgreSQL'
    ];
    
    return skillPatterns.filter(skill => 
      text.toLowerCase().includes(skill.toLowerCase())
    );
  }

  private countKeywordFrequency(keyword: string, text: string): number {
    const regex = new RegExp(keyword, 'gi');
    return (text.match(regex) || []).length;
  }

  private findKeywordPositions(keyword: string, text: string): number[] {
    const positions: number[] = [];
    const regex = new RegExp(keyword, 'gi');
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      positions.push(match.index);
    }
    
    return positions;
  }

  private determineKeywordRelevance(keyword: string): 'high' | 'medium' | 'low' {
    // Simple relevance scoring
    const highRelevanceKeywords = ['experience', 'skills', 'management', 'development'];
    const mediumRelevanceKeywords = ['knowledge', 'ability', 'understanding'];
    
    if (highRelevanceKeywords.some(hrk => keyword.includes(hrk))) return 'high';
    if (mediumRelevanceKeywords.some(mrk => keyword.includes(mrk))) return 'medium';
    return 'low';
  }

  private findMissingKeywords(): string[] {
    const jobKeywords = this.extractKeywords(this.jobDescription);
    const resumeText = this.getResumeText().toLowerCase();
    
    return jobKeywords.filter(keyword => 
      !resumeText.includes(keyword.toLowerCase())
    );
  }

  private generateSkillRecommendations(missingSkills: string[]): string[] {
    return missingSkills.slice(0, 5).map(skill => 
      `Consider adding ${skill} to your skills section`
    );
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private countIndustryKeywords(text: string): number {
    const industryKeywords = ['agile', 'scrum', 'ci/cd', 'devops', 'microservices'];
    return industryKeywords.filter(keyword => 
      text.toLowerCase().includes(keyword)
    ).length;
  }

  private calculateReadabilityScore(text: string): number {
    // Simple readability score based on sentence length and word complexity
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgSentenceLength = text.split(' ').length / sentences.length;
    
    return Math.min(100, Math.max(0, 100 - (avgSentenceLength - 15) * 2));
  }

  private generateContentSuggestions(actionVerbs: number, quantifiedAchievements: number): string[] {
    const suggestions: string[] = [];
    
    if (actionVerbs < 3) {
      suggestions.push('Use more action verbs to describe your achievements');
    }
    
    if (quantifiedAchievements < 2) {
      suggestions.push('Add quantifiable achievements with numbers and percentages');
    }
    
    return suggestions;
  }

  private getResumeText(): string {
    const { personalInfo, experience, education, skills, projects } = this.resumeData;
    
    const sections = [
      personalInfo.fullName,
      personalInfo.email,
      personalInfo.phone,
      personalInfo.location,
      ...experience.map(exp => `${exp.position} ${exp.company} ${exp.description}`),
      ...education.map(edu => `${edu.degree} ${edu.field} ${edu.institution}`),
      ...skills.map(skill => `${skill.name} ${skill.level}`),
      ...projects.map(proj => `${proj.name} ${proj.description} ${proj.technologies}`)
    ];

    return sections.filter(Boolean).join(' ');
  }
}

// Gemini API service class using fetch
export class GeminiATSService {
  private apiKey: string = 'AIzaSyC6D0f4-yB-JJD54aqhtpJOzU6SGMK4hvk'
  private baseUrl: string = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async makeGeminiRequest(prompt: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    } catch (error) {
      console.error('Gemini API request failed:', error);
      throw error;
    }
  }

  async analyzeJobAlignment(jobDescription: string, resumeText: string): Promise<AIInsights> {
    const prompt = `
    You are an expert ATS (Applicant Tracking System) and recruitment consultant. 
    Analyze the alignment between this job description and resume.

    JOB DESCRIPTION:
    ${jobDescription}

    RESUME CONTENT:
    ${resumeText}

    Please provide a comprehensive analysis in JSON format with the following structure:
    {
      "overallAssessment": "Brief overall assessment of fit",
      "keyStrengths": ["strength1", "strength2", "strength3"],
      "criticalGaps": ["gap1", "gap2", "gap3"],
      "industryAlignment": {
        "score": 0-100,
        "feedback": "Detailed feedback on industry alignment"
      },
      "contentQuality": {
        "score": 0-100,
        "feedback": "Assessment of resume writing quality"
      },
      "competitiveAnalysis": "How this resume compares to typical candidates",
      "tailoredSuggestions": ["suggestion1", "suggestion2", "suggestion3"]
    }

    Focus on:
    - Technical skills alignment
    - Experience relevance
    - Industry-specific knowledge
    - Leadership and soft skills
    - Career progression logic
    - Achievement quantification
    `;

    try {
      const text = await this.makeGeminiRequest(prompt);
      
      // Parse JSON response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      throw new Error('Invalid JSON response from Gemini');
    } catch (error) {
      console.error('Gemini API error:', error);
      return this.getFallbackInsights();
    }
  }

  async generateOptimizedContent(
    originalContent: string, 
    jobDescription: string, 
    contentType: 'experience' | 'summary' | 'skills'
  ): Promise<string> {
    const prompts = {
      experience: `
        Rewrite this work experience bullet point to better match the job requirements.
        Make it more ATS-friendly with relevant keywords and quantifiable achievements.
        
        Original: ${originalContent}
        Job Description: ${jobDescription}
        
        Return only the improved bullet point:
      `,
      summary: `
        Create a professional summary that aligns with this job description.
        Include relevant keywords and highlight matching qualifications.
        
        Current summary: ${originalContent}
        Job Description: ${jobDescription}
        
        Return only the improved summary (2-3 sentences):
      `,
      skills: `
        Suggest additional technical skills to add based on the job description.
        Only suggest skills that are reasonable for someone with this background.
        
        Current skills: ${originalContent}
        Job Description: ${jobDescription}
        
        Return comma-separated list of suggested skills:
      `
    };

    try {
      const text = await this.makeGeminiRequest(prompts[contentType]);
      return text.trim();
    } catch (error) {
      console.error('Gemini content generation error:', error);
      return originalContent;
    }
  }

  async analyzeKeywordGaps(jobDescription: string, resumeText: string): Promise<{
    missingKeywords: string[];
    keywordSuggestions: { [key: string]: string[] };
  }> {
    const prompt = `
    Extract important keywords and phrases from this job description that are missing from the resume.
    Focus on technical skills, tools, methodologies, and industry-specific terms.

    Job Description: ${jobDescription}
    Resume: ${resumeText}

    Return JSON format:
    {
      "missingKeywords": ["keyword1", "keyword2"],
      "keywordSuggestions": {
        "technical_skills": ["skill1", "skill2"],
        "tools_technologies": ["tool1", "tool2"],
        "methodologies": ["method1", "method2"],
        "certifications": ["cert1", "cert2"]
      }
    }
    `;

    try {
      const text = await this.makeGeminiRequest(prompt);
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return {
        missingKeywords: [],
        keywordSuggestions: {}
      };
    } catch (error) {
      console.error('Keyword analysis error:', error);
      return {
        missingKeywords: [],
        keywordSuggestions: {}
      };
    }
  }

  private getFallbackInsights(): AIInsights {
    return {
      overallAssessment: "Unable to generate AI insights at this time",
      keyStrengths: [],
      criticalGaps: [],
      industryAlignment: {
        score: 0,
        feedback: "AI analysis unavailable"
      },
      contentQuality: {
        score: 0,
        feedback: "AI analysis unavailable"
      },
      competitiveAnalysis: "Analysis unavailable",
      tailoredSuggestions: []
    };
  }
}

// Enhanced ATS Analyzer with Gemini integration
export class EnhancedATSAnalyzer {
  private jobDescription: string;
  private resumeData: FormData;
  private geminiService: GeminiATSService;
  private originalAnalyzer: ATSAnalyzer;

  constructor(jobDescription: string, resumeData: FormData, apiKey: string) {
    this.jobDescription = jobDescription;
    this.resumeData = resumeData;
    this.geminiService = new GeminiATSService(apiKey);
    this.originalAnalyzer = new ATSAnalyzer(jobDescription, resumeData);
  }

  public async analyze(): Promise<ATSAnalysisResult> {
    // Get base analysis
    const baseAnalysis = this.originalAnalyzer.analyze();
    
    // Get AI-enhanced insights
    const resumeText = this.getResumeText();
    const aiInsights = await this.geminiService.analyzeJobAlignment(
      this.jobDescription, 
      resumeText
    );

    // Enhance keyword analysis with AI
    const keywordGaps = await this.geminiService.analyzeKeywordGaps(
      this.jobDescription,
      resumeText
    );

    // Merge AI insights with base analysis
    const enhancedRecommendations = [
      ...baseAnalysis.recommendations,
      ...this.generateAIRecommendations(aiInsights, keywordGaps)
    ];

    return {
      ...baseAnalysis,
      aiInsights,
      missingKeywords: [...baseAnalysis.missingKeywords, ...keywordGaps.missingKeywords],
      recommendations: enhancedRecommendations.slice(0, 8) // Top 8 recommendations
    };
  }

  public async optimizeContent(
    content: string, 
    type: 'experience' | 'summary' | 'skills'
  ): Promise<string> {
    return await this.geminiService.generateOptimizedContent(
      content, 
      this.jobDescription, 
      type
    );
  }

  private generateAIRecommendations(
    aiInsights: AIInsights, 
    keywordGaps: { missingKeywords: string[] }
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Critical gaps from AI analysis
    if (aiInsights.criticalGaps.length > 0) {
      recommendations.push({
        priority: 'high',
        category: 'skills',
        title: 'Address Critical Skill Gaps',
        description: 'AI analysis identified critical gaps in your qualifications',
        action: `Focus on: ${aiInsights.criticalGaps.slice(0, 2).join(', ')}`
      });
    }

    // Industry alignment improvements
    if (aiInsights.industryAlignment.score < 70) {
      recommendations.push({
        priority: 'medium',
        category: 'content',
        title: 'Improve Industry Alignment',
        description: aiInsights.industryAlignment.feedback,
        action: 'Highlight relevant industry experience and use industry-specific terminology'
      });
    }

    // Content quality improvements
    if (aiInsights.contentQuality.score < 70) {
      recommendations.push({
        priority: 'medium',
        category: 'content',
        title: 'Enhance Content Quality',
        description: aiInsights.contentQuality.feedback,
        action: 'Improve writing quality and professional presentation'
      });
    }

    // AI-suggested improvements
    if (aiInsights.tailoredSuggestions.length > 0) {
      recommendations.push({
        priority: 'low',
        category: 'content',
        title: 'AI-Suggested Improvements',
        description: 'Personalized suggestions based on job requirements',
        action: aiInsights.tailoredSuggestions[0]
      });
    }

    return recommendations;
  }

  private getResumeText(): string {
    const { personalInfo, experience, education, skills, projects } = this.resumeData;
    
    const sections = [
      personalInfo.fullName,
      personalInfo.email,
      personalInfo.phone,
      personalInfo.location,
      ...experience.map(exp => `${exp.position} ${exp.company} ${exp.description}`),
      ...education.map(edu => `${edu.degree} ${edu.field} ${edu.institution}`),
      ...skills.map(skill => `${skill.name} ${skill.level}`),
      ...projects.map(proj => `${proj.name} ${proj.description} ${proj.technologies}`)
    ];

    return sections.filter(Boolean).join(' ');
  }
}

// Usage example
export const analyzeWithGemini = async (
  jobDescription: string,
  resumeData: FormData,
  geminiApiKey: string
): Promise<UIAnalysisResult> => {
  const enhancedAnalyzer = new EnhancedATSAnalyzer(
    jobDescription, 
    resumeData, 
    geminiApiKey
  );
  
  const result = await enhancedAnalyzer.analyze();
  // Transform to UI-compatible format
  return {
    ...result,
    hardSkillsAnalysis: {
      foundSkills: result.hardSkillsAnalysis.matchedSkills,
      requiredSkills: [...result.hardSkillsAnalysis.matchedSkills, ...result.hardSkillsAnalysis.missingSkills],
      missingCriticalSkills: result.hardSkillsAnalysis.missingSkills,
      skillsScore: result.hardSkillsAnalysis.skillsScore,
      recommendations: result.hardSkillsAnalysis.recommendations
    },
    keywordMatches: result.keywordMatches.map(match => ({
      ...match,
      found: match.frequency > 0,
      importance: match.relevance
    })),
    formattingCheck: {
      ...result.formattingCheck,
      strengths: result.formattingCheck.suggestions.filter(s => !s.toLowerCase().includes('consider')),
      issues: result.formattingCheck.issues.map(issue => ({
        message: issue,
        type: issue.toLowerCase().includes('critical') ? 'critical' : 
              issue.toLowerCase().includes('suggestion') ? 'info' : 'warning'
      })),
      suggestions: result.formattingCheck.suggestions
    }
  };
};

// Content optimization helper
export const optimizeResumeContent = async (
  jobDescription: string,
  resumeData: FormData,
  geminiApiKey: string
): Promise<{
  optimizedExperience: string[];
  optimizedSummary?: string;
  suggestedSkills: string[];
}> => {
  const analyzer = new EnhancedATSAnalyzer(
    jobDescription, 
    resumeData, 
    geminiApiKey
  );

  const optimizedExperience = await Promise.all(
    resumeData.experience.map(exp => 
      analyzer.optimizeContent(exp.description || '', 'experience')
    )
  );

  const currentSkills = resumeData.skills.map(s => s.name).join(', ');
  const suggestedSkillsText = await analyzer.optimizeContent(
    currentSkills, 
    'skills'
  );
  const suggestedSkills = suggestedSkillsText.split(',').map(s => s.trim());

  return {
    optimizedExperience,
    suggestedSkills
  };
};