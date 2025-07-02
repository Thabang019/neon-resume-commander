import { FormData } from '../components/types';

export interface ATSAnalysisResult {
  overallScore: number;
  keywordMatches: KeywordMatch[];
  missingKeywords: string[];
  hardSkillsAnalysis: HardSkillsAnalysis;
  formattingCheck: FormattingCheck;
  contentEnhancement: ContentEnhancement;
  recommendations: Recommendation[];
}

export interface KeywordMatch {
  keyword: string;
  frequency: number;
  importance: 'high' | 'medium' | 'low';
  found: boolean;
  context?: string;
}

export interface HardSkillsAnalysis {
  requiredSkills: string[];
  foundSkills: string[];
  missingCriticalSkills: string[];
  certifications: {
    required: string[];
    found: string[];
    missing: string[];
  };
}

export interface FormattingCheck {
  score: number;
  issues: FormattingIssue[];
  strengths: string[];
}

export interface FormattingIssue {
  type: 'critical' | 'warning' | 'suggestion';
  message: string;
  section?: string;
}

export interface ContentEnhancement {
  actionVerbs: {
    suggested: string[];
    overused: string[];
  };
  quantifiableAchievements: {
    found: number;
    suggestions: string[];
  };
  genericTerms: string[];
}

export interface Recommendation {
  priority: 'high' | 'medium' | 'low';
  category: 'keywords' | 'formatting' | 'content' | 'skills';
  title: string;
  description: string;
  action: string;
}

// Common action verbs categorized by impact
const STRONG_ACTION_VERBS = [
  'achieved', 'accelerated', 'accomplished', 'advanced', 'amplified',
  'boosted', 'built', 'created', 'delivered', 'developed', 'drove',
  'enhanced', 'established', 'exceeded', 'executed', 'expanded',
  'generated', 'implemented', 'improved', 'increased', 'initiated',
  'launched', 'led', 'managed', 'optimized', 'orchestrated',
  'pioneered', 'produced', 'reduced', 'resolved', 'spearheaded',
  'streamlined', 'strengthened', 'transformed', 'upgraded'
];

const WEAK_ACTION_VERBS = [
  'responsible for', 'worked on', 'helped with', 'assisted',
  'participated in', 'involved in', 'contributed to'
];

const GENERIC_TERMS = [
  'team player', 'hard worker', 'detail-oriented', 'self-motivated',
  'excellent communication skills', 'fast learner', 'problem solver'
];

// Technical skills patterns
const TECHNICAL_SKILL_PATTERNS = [
  // Programming languages
  /\b(javascript|python|java|c\+\+|c#|php|ruby|go|rust|swift|kotlin|typescript)\b/gi,
  // Frameworks
  /\b(react|angular|vue|node\.?js|express|django|flask|spring|laravel|rails)\b/gi,
  // Databases
  /\b(mysql|postgresql|mongodb|redis|elasticsearch|oracle|sql server)\b/gi,
  // Cloud platforms
  /\b(aws|azure|gcp|google cloud|docker|kubernetes|terraform)\b/gi,
  // Tools
  /\b(git|jenkins|jira|confluence|slack|figma|adobe|photoshop)\b/gi
];

const CERTIFICATION_PATTERNS = [
  /\b(aws certified|azure certified|google cloud certified|cissp|cisa|pmp|scrum master|agile)\b/gi,
  /\b(comptia|cisco|microsoft certified|oracle certified|salesforce certified)\b/gi
];

export class ATSAnalyzer {
  private jobDescription: string;
  private resumeData: FormData;

  constructor(jobDescription: string, resumeData: FormData) {
    this.jobDescription = jobDescription.toLowerCase();
    this.resumeData = resumeData;
  }

  public analyze(): ATSAnalysisResult {
    const keywordMatches = this.analyzeKeywords();
    const hardSkillsAnalysis = this.analyzeHardSkills();
    const formattingCheck = this.checkFormatting();
    const contentEnhancement = this.analyzeContent();
    
    const overallScore = this.calculateOverallScore(
      keywordMatches,
      hardSkillsAnalysis,
      formattingCheck,
      contentEnhancement
    );

    const recommendations = this.generateRecommendations(
      keywordMatches,
      hardSkillsAnalysis,
      formattingCheck,
      contentEnhancement
    );

    return {
      overallScore,
      keywordMatches,
      missingKeywords: keywordMatches.filter(k => !k.found).map(k => k.keyword),
      hardSkillsAnalysis,
      formattingCheck,
      contentEnhancement,
      recommendations
    };
  }

  private analyzeKeywords(): KeywordMatch[] {
    const jobKeywords = this.extractKeywords(this.jobDescription);
    const resumeText = this.getResumeText().toLowerCase();
    
    return jobKeywords.map(keyword => {
      const regex = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      const matches = resumeText.match(regex);
      const frequency = matches ? matches.length : 0;
      
      return {
        keyword,
        frequency,
        importance: this.getKeywordImportance(keyword),
        found: frequency > 0,
        context: this.getKeywordContext(keyword, resumeText)
      };
    });
  }

  private extractKeywords(text: string): string[] {
    // Remove common stop words and extract meaningful terms
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
      'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
      'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
      'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these',
      'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him',
      'her', 'us', 'them', 'my', 'your', 'his', 'her', 'its', 'our', 'their'
    ]);

    const words = text
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word.toLowerCase()));

    // Calculate word frequency
    const wordFreq: { [key: string]: number } = {};
    words.forEach(word => {
      const lowerWord = word.toLowerCase();
      wordFreq[lowerWord] = (wordFreq[lowerWord] || 0) + 1;
    });

    // Extract phrases (2-3 words)
    const phrases: string[] = [];
    for (let i = 0; i < words.length - 1; i++) {
      const twoWordPhrase = `${words[i]} ${words[i + 1]}`.toLowerCase();
      if (!stopWords.has(words[i].toLowerCase()) && !stopWords.has(words[i + 1].toLowerCase())) {
        phrases.push(twoWordPhrase);
      }
      
      if (i < words.length - 2) {
        const threeWordPhrase = `${words[i]} ${words[i + 1]} ${words[i + 2]}`.toLowerCase();
        if (!stopWords.has(words[i].toLowerCase()) && 
            !stopWords.has(words[i + 1].toLowerCase()) && 
            !stopWords.has(words[i + 2].toLowerCase())) {
          phrases.push(threeWordPhrase);
        }
      }
    }

    // Combine single words and phrases, sort by frequency
    const allTerms = [
      ...Object.keys(wordFreq).filter(word => wordFreq[word] >= 2),
      ...phrases
    ];

    return [...new Set(allTerms)].slice(0, 50); // Top 50 unique terms
  }

  private getKeywordImportance(keyword: string): 'high' | 'medium' | 'low' {
    // Technical skills and certifications are high importance
    if (TECHNICAL_SKILL_PATTERNS.some(pattern => pattern.test(keyword)) ||
        CERTIFICATION_PATTERNS.some(pattern => pattern.test(keyword))) {
      return 'high';
    }

    // Job titles and action verbs are medium importance
    if (keyword.includes('manager') || keyword.includes('developer') || 
        keyword.includes('engineer') || keyword.includes('analyst') ||
        STRONG_ACTION_VERBS.some(verb => keyword.includes(verb))) {
      return 'medium';
    }

    return 'low';
  }

  private getKeywordContext(keyword: string, text: string): string | undefined {
    const regex = new RegExp(`(.{0,30}\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b.{0,30})`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : undefined;
  }

  private analyzeHardSkills(): HardSkillsAnalysis {
    const jobSkills = this.extractTechnicalSkills(this.jobDescription);
    const resumeText = this.getResumeText().toLowerCase();
    const resumeSkills = this.resumeData.skills.map(s => s.name.toLowerCase());
    
    const foundSkills = jobSkills.filter(skill => 
      resumeText.includes(skill.toLowerCase()) || 
      resumeSkills.some(rs => rs.includes(skill.toLowerCase()))
    );

    const missingCriticalSkills = jobSkills.filter(skill => 
      !foundSkills.includes(skill) && this.isCriticalSkill(skill)
    );

    const jobCertifications = this.extractCertifications(this.jobDescription);
    const resumeCertifications = this.extractCertifications(this.getResumeText());
    
    const foundCertifications = jobCertifications.filter(cert =>
      resumeCertifications.some(rc => rc.toLowerCase().includes(cert.toLowerCase()))
    );

    return {
      requiredSkills: jobSkills,
      foundSkills,
      missingCriticalSkills,
      certifications: {
        required: jobCertifications,
        found: foundCertifications,
        missing: jobCertifications.filter(cert => !foundCertifications.includes(cert))
      }
    };
  }

  private extractTechnicalSkills(text: string): string[] {
    const skills: string[] = [];
    
    TECHNICAL_SKILL_PATTERNS.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        skills.push(...matches.map(match => match.trim()));
      }
    });

    return [...new Set(skills)];
  }

  private extractCertifications(text: string): string[] {
    const certifications: string[] = [];
    
    CERTIFICATION_PATTERNS.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        certifications.push(...matches.map(match => match.trim()));
      }
    });

    return [...new Set(certifications)];
  }

  private isCriticalSkill(skill: string): boolean {
    const criticalKeywords = ['required', 'must have', 'essential', 'mandatory'];
    const skillContext = this.getKeywordContext(skill, this.jobDescription);
    
    return criticalKeywords.some(keyword => 
      skillContext?.toLowerCase().includes(keyword) || false
    );
  }

  private checkFormatting(): FormattingCheck {
    const issues: FormattingIssue[] = [];
    const strengths: string[] = [];
    let score = 100;

    // Check for standard section headers
    const resumeText = this.getResumeText();
    const standardSections = ['experience', 'education', 'skills', 'projects'];
    const foundSections = standardSections.filter(section => 
      resumeText.toLowerCase().includes(section)
    );

    if (foundSections.length < 3) {
      issues.push({
        type: 'warning',
        message: 'Missing standard section headers (Experience, Education, Skills)',
        section: 'structure'
      });
      score -= 15;
    } else {
      strengths.push('Contains standard ATS-friendly section headers');
    }

    // Check for bullet points in experience
    const hasExperience = this.resumeData.experience.length > 0;
    if (hasExperience) {
      const experienceWithBullets = this.resumeData.experience.filter(exp => 
        exp.description && exp.description.includes('•') || exp.description.includes('-')
      );
      
      if (experienceWithBullets.length === 0) {
        issues.push({
          type: 'suggestion',
          message: 'Consider using bullet points in experience descriptions',
          section: 'experience'
        });
        score -= 5;
      } else {
        strengths.push('Uses bullet points for experience descriptions');
      }
    }

    // Check for contact information
    const { personalInfo } = this.resumeData;
    if (!personalInfo.email || !personalInfo.phone) {
      issues.push({
        type: 'critical',
        message: 'Missing essential contact information (email or phone)',
        section: 'contact'
      });
      score -= 20;
    } else {
      strengths.push('Complete contact information provided');
    }

    // Check for quantifiable achievements
    const hasQuantifiableAchievements = this.resumeData.experience.some(exp =>
      exp.description && /\d+/.test(exp.description)
    );

    if (!hasQuantifiableAchievements) {
      issues.push({
        type: 'suggestion',
        message: 'Add quantifiable achievements (numbers, percentages, metrics)',
        section: 'experience'
      });
      score -= 10;
    } else {
      strengths.push('Includes quantifiable achievements');
    }

    return {
      score: Math.max(0, score),
      issues,
      strengths
    };
  }

  private analyzeContent(): ContentEnhancement {
    const resumeText = this.getResumeText();
    
    // Analyze action verbs
    const usedVerbs = STRONG_ACTION_VERBS.filter(verb => 
      resumeText.toLowerCase().includes(verb)
    );
    
    const overusedVerbs = usedVerbs.filter(verb => {
      const count = (resumeText.toLowerCase().match(new RegExp(verb, 'g')) || []).length;
      return count > 2;
    });

    const jobActionVerbs = STRONG_ACTION_VERBS.filter(verb =>
      this.jobDescription.includes(verb) && !usedVerbs.includes(verb)
    );

    // Count quantifiable achievements
    const quantifiableCount = this.resumeData.experience.reduce((count, exp) => {
      const numbers = exp.description?.match(/\d+/g) || [];
      return count + numbers.length;
    }, 0);

    // Find generic terms
    const foundGenericTerms = GENERIC_TERMS.filter(term =>
      resumeText.toLowerCase().includes(term.toLowerCase())
    );

    return {
      actionVerbs: {
        suggested: jobActionVerbs.slice(0, 10),
        overused: overusedVerbs
      },
      quantifiableAchievements: {
        found: quantifiableCount,
        suggestions: [
          'Add specific numbers (e.g., "Increased sales by 25%")',
          'Include timeframes (e.g., "Completed project 2 weeks ahead of schedule")',
          'Mention team sizes (e.g., "Led a team of 8 developers")',
          'Specify budget amounts (e.g., "Managed $2M budget")'
        ]
      },
      genericTerms: foundGenericTerms
    };
  }

  private calculateOverallScore(
    keywordMatches: KeywordMatch[],
    hardSkills: HardSkillsAnalysis,
    formatting: FormattingCheck,
    content: ContentEnhancement
  ): number {
    // Keyword matching (40% weight)
    const keywordScore = keywordMatches.length > 0 
      ? (keywordMatches.filter(k => k.found).length / keywordMatches.length) * 100
      : 0;

    // Hard skills (30% weight)
    const skillsScore = hardSkills.requiredSkills.length > 0
      ? (hardSkills.foundSkills.length / hardSkills.requiredSkills.length) * 100
      : 100;

    // Formatting (20% weight)
    const formattingScore = formatting.score;

    // Content quality (10% weight)
    const contentScore = Math.min(100, 
      (content.quantifiableAchievements.found * 10) + 
      (content.actionVerbs.suggested.length > 0 ? 50 : 100) -
      (content.genericTerms.length * 5)
    );

    const weightedScore = 
      (keywordScore * 0.4) +
      (skillsScore * 0.3) +
      (formattingScore * 0.2) +
      (contentScore * 0.1);

    return Math.round(Math.max(0, Math.min(100, weightedScore)));
  }

  private generateRecommendations(
    keywordMatches: KeywordMatch[],
    hardSkills: HardSkillsAnalysis,
    formatting: FormattingCheck,
    content: ContentEnhancement
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // High priority recommendations
    if (hardSkills.missingCriticalSkills.length > 0) {
      recommendations.push({
        priority: 'high',
        category: 'skills',
        title: 'Add Critical Missing Skills',
        description: `${hardSkills.missingCriticalSkills.length} critical skills are missing from your resume`,
        action: `Add these skills: ${hardSkills.missingCriticalSkills.slice(0, 3).join(', ')}`
      });
    }

    const criticalFormattingIssues = formatting.issues.filter(i => i.type === 'critical');
    if (criticalFormattingIssues.length > 0) {
      recommendations.push({
        priority: 'high',
        category: 'formatting',
        title: 'Fix Critical Formatting Issues',
        description: 'Your resume has formatting issues that may prevent ATS systems from reading it properly',
        action: criticalFormattingIssues[0].message
      });
    }

    // Medium priority recommendations
    const missingHighImportanceKeywords = keywordMatches
      .filter(k => !k.found && k.importance === 'high')
      .slice(0, 5);

    if (missingHighImportanceKeywords.length > 0) {
      recommendations.push({
        priority: 'medium',
        category: 'keywords',
        title: 'Include High-Impact Keywords',
        description: `${missingHighImportanceKeywords.length} important keywords are missing`,
        action: `Add keywords: ${missingHighImportanceKeywords.map(k => k.keyword).join(', ')}`
      });
    }

    if (content.quantifiableAchievements.found < 3) {
      recommendations.push({
        priority: 'medium',
        category: 'content',
        title: 'Add Quantifiable Achievements',
        description: 'Include more specific numbers and metrics to demonstrate impact',
        action: 'Add percentages, dollar amounts, timeframes, or team sizes to your accomplishments'
      });
    }

    // Low priority recommendations
    if (content.actionVerbs.suggested.length > 0) {
      recommendations.push({
        priority: 'low',
        category: 'content',
        title: 'Use Stronger Action Verbs',
        description: 'Enhance your resume with more impactful action verbs from the job description',
        action: `Consider using: ${content.actionVerbs.suggested.slice(0, 5).join(', ')}`
      });
    }

    if (content.genericTerms.length > 0) {
      recommendations.push({
        priority: 'low',
        category: 'content',
        title: 'Replace Generic Terms',
        description: 'Remove overused phrases and replace with specific examples',
        action: `Replace terms like: ${content.genericTerms.slice(0, 3).join(', ')}`
      });
    }

    return recommendations.slice(0, 5); // Top 5 recommendations
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

export const analyzeJobDescription = async (
  jobDescription: string,
  resumeData: FormData
): Promise<ATSAnalysisResult> => {
  const analyzer = new ATSAnalyzer(jobDescription, resumeData);
  return analyzer.analyze();
};