import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FormData } from '../components/types';
import { TemplateType } from '../components/templates/TemplatePreview';

export const generatePDF = async (
  formData: FormData,
  selectedTemplate: TemplateType
): Promise<void> => {
  try {
    // Create a temporary container for the resume
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    tempContainer.style.width = '210mm'; // A4 width
    tempContainer.style.minHeight = '297mm'; // A4 height
    tempContainer.style.backgroundColor = 'white';
    tempContainer.style.padding = '20mm';
    tempContainer.style.boxSizing = 'border-box';
    tempContainer.style.fontFamily = 'Arial, sans-serif';
    
    document.body.appendChild(tempContainer);

    // Generate the resume content based on template
    const resumeContent = generateResumeHTML(formData, selectedTemplate);
    tempContainer.innerHTML = resumeContent;

    // Wait for fonts and images to load
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate canvas from the HTML
    const canvas = await html2canvas(tempContainer, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: tempContainer.offsetWidth,
      height: tempContainer.offsetHeight,
    });

    // Remove temporary container
    document.body.removeChild(tempContainer);

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Add the canvas as an image to the PDF
    pdf.addImage(
      canvas.toDataURL('image/png'),
      'PNG',
      0,
      0,
      imgWidth,
      imgHeight
    );

    // If content is longer than one page, add additional pages
    if (imgHeight > 297) {
      let remainingHeight = imgHeight - 297;
      let currentPage = 1;
      
      while (remainingHeight > 0) {
        pdf.addPage();
        const yOffset = -297 * currentPage;
        const pageHeight = Math.min(remainingHeight, 297);
        
        pdf.addImage(
          canvas.toDataURL('image/png'),
          'PNG',
          0,
          yOffset,
          imgWidth,
          imgHeight
        );
        
        remainingHeight -= 297;
        currentPage++;
      }
    }

    // Generate filename
    const fileName = `${formData.personalInfo.fullName || 'Resume'}_${selectedTemplate}_${new Date().toISOString().split('T')[0]}.pdf`;

    // Download the PDF
    pdf.save(fileName);

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};

const generateResumeHTML = (formData: FormData, template: TemplateType): string => {
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

  switch (template) {
    case 'classic':
      return `
        <div style="font-family: 'Times New Roman', serif; color: #1f2937; line-height: 1.6;">
          <!-- Header -->
          <div style="border-bottom: 2px solid #1f2937; padding-bottom: 20px; margin-bottom: 20px; text-align: center;">
            <h1 style="font-size: 32px; font-weight: bold; margin-bottom: 15px; color: #1f2937;">
              ${personalInfo.fullName || 'Your Name'}
            </h1>
            <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 15px; font-size: 14px; color: #4b5563;">
              ${personalInfo.email ? `<span>📧 ${personalInfo.email}</span>` : ''}
              ${personalInfo.phone ? `<span>📞 ${personalInfo.phone}</span>` : ''}
              ${personalInfo.location ? `<span>📍 ${personalInfo.location}</span>` : ''}
              ${personalInfo.linkedIn ? `<span>💼 ${personalInfo.linkedIn}</span>` : ''}
              ${personalInfo.portfolio ? `<span>🌐 ${personalInfo.portfolio}</span>` : ''}
            </div>
          </div>

          <!-- Experience -->
          ${experience.length > 0 ? `
            <div style="margin-bottom: 25px;">
              <h2 style="font-size: 20px; font-weight: bold; border-bottom: 1px solid #d1d5db; padding-bottom: 8px; margin-bottom: 15px; color: #1f2937;">
                PROFESSIONAL EXPERIENCE
              </h2>
              ${experience.map(exp => `
                <div style="margin-bottom: 20px;">
                  <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                    <div>
                      <h3 style="font-weight: bold; font-size: 16px; margin: 0;">${exp.position || 'Position'}</h3>
                      <p style="color: #4b5563; font-weight: 500; margin: 2px 0;">${exp.company || 'Company'}</p>
                    </div>
                    <div style="text-align: right; font-size: 12px; color: #6b7280;">
                      📅 ${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}
                    </div>
                  </div>
                  ${exp.description ? `<p style="color: #374151; margin: 8px 0;">${exp.description}</p>` : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}

          <!-- Education -->
          ${education.length > 0 ? `
            <div style="margin-bottom: 25px;">
              <h2 style="font-size: 20px; font-weight: bold; border-bottom: 1px solid #d1d5db; padding-bottom: 8px; margin-bottom: 15px; color: #1f2937;">
                EDUCATION
              </h2>
              ${education.map(edu => `
                <div style="margin-bottom: 15px;">
                  <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div>
                      <h3 style="font-weight: bold; margin: 0;">${edu.degree || 'Degree'} in ${edu.field || 'Field'}</h3>
                      <p style="color: #4b5563; margin: 2px 0;">${edu.institution || 'Institution'}</p>
                    </div>
                    <div style="text-align: right; font-size: 12px;">
                      <div style="color: #6b7280;">📅 ${formatDate(edu.graduationDate)}</div>
                      ${edu.gpa ? `<div style="color: #4b5563;">GPA: ${edu.gpa}</div>` : ''}
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : ''}

          <!-- Skills -->
          ${skills.length > 0 ? `
            <div style="margin-bottom: 25px;">
              <h2 style="font-size: 20px; font-weight: bold; border-bottom: 1px solid #d1d5db; padding-bottom: 8px; margin-bottom: 15px; color: #1f2937;">
                SKILLS
              </h2>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                ${skills.map(skill => `
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-weight: 500;">${skill.name || 'Skill'}</span>
                    <div style="display: flex; gap: 2px;">
                      ${Array.from({ length: 4 }, (_, i) => 
                        `<span style="color: ${i < getLevelStars(skill.level) ? '#1f2937' : '#d1d5db'};">★</span>`
                      ).join('')}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Projects -->
          ${projects.length > 0 ? `
            <div style="margin-bottom: 25px;">
              <h2 style="font-size: 20px; font-weight: bold; border-bottom: 1px solid #d1d5db; padding-bottom: 8px; margin-bottom: 15px; color: #1f2937;">
                PROJECTS
              </h2>
              ${projects.map(project => `
                <div style="margin-bottom: 20px;">
                  <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                    <div style="flex: 1;">
                      <h3 style="font-weight: bold; margin: 0;">${project.name || 'Project Name'}</h3>
                      ${project.technologies ? `<p style="color: #4b5563; font-size: 12px; margin: 2px 0;"><strong>Technologies:</strong> ${project.technologies}</p>` : ''}
                    </div>
                    <div style="text-align: right; font-size: 12px; color: #6b7280;">
                      📅 ${formatDate(project.startDate)} - ${project.current ? 'Present' : formatDate(project.endDate)}
                    </div>
                  </div>
                  ${project.description ? `<p style="color: #374151; margin: 8px 0;">${project.description}</p>` : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      `;

    case 'modern':
      return `
        <div style="font-family: 'Arial', sans-serif; color: #1f2937; line-height: 1.6;">
          <!-- Header with gradient background -->
          <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 30px; margin: -20mm -20mm 20px -20mm;">
            <h1 style="font-size: 36px; font-weight: 300; margin-bottom: 15px;">
              ${personalInfo.fullName || 'Your Name'}
            </h1>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 14px; opacity: 0.9;">
              ${personalInfo.email ? `<div>📧 ${personalInfo.email}</div>` : ''}
              ${personalInfo.phone ? `<div>📞 ${personalInfo.phone}</div>` : ''}
              ${personalInfo.location ? `<div>📍 ${personalInfo.location}</div>` : ''}
              ${personalInfo.linkedIn ? `<div>💼 ${personalInfo.linkedIn}</div>` : ''}
              ${personalInfo.portfolio ? `<div style="grid-column: 1 / -1;">🌐 ${personalInfo.portfolio}</div>` : ''}
            </div>
          </div>

          <!-- Experience -->
          ${experience.length > 0 ? `
            <div style="margin-bottom: 30px;">
              <h2 style="font-size: 24px; font-weight: 300; color: #3b82f6; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #dbeafe;">
                Experience
              </h2>
              ${experience.map((exp, index) => `
                <div style="position: relative; padding-left: 25px; margin-bottom: 25px;">
                  <div style="position: absolute; left: 0; top: 8px; width: 12px; height: 12px; background: #3b82f6; border-radius: 50%;"></div>
                  ${index < experience.length - 1 ? '<div style="position: absolute; left: 5px; top: 20px; width: 2px; height: 60px; background: #dbeafe;"></div>' : ''}
                  <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                    <div>
                      <h3 style="font-weight: 600; font-size: 18px; color: #1f2937; margin: 0;">${exp.position || 'Position'}</h3>
                      <p style="color: #3b82f6; font-weight: 500; margin: 2px 0;">${exp.company || 'Company'}</p>
                    </div>
                    <div style="text-align: right; font-size: 12px; color: #6b7280;">
                      📅 ${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}
                    </div>
                  </div>
                  ${exp.description ? `<p style="color: #374151; margin: 8px 0;">${exp.description}</p>` : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}

          <!-- Projects -->
          ${projects.length > 0 ? `
            <div style="margin-bottom: 30px;">
              <h2 style="font-size: 24px; font-weight: 300; color: #3b82f6; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #dbeafe;">
                Projects
              </h2>
              ${projects.map(project => `
                <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                  <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                    <div style="flex: 1;">
                      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                        <span style="color: #3b82f6;">💻</span>
                        <h3 style="font-weight: 600; color: #1f2937; margin: 0;">${project.name || 'Project Name'}</h3>
                        ${project.url ? '<span style="color: #3b82f6;">🔗</span>' : ''}
                      </div>
                      ${project.technologies ? `<p style="color: #3b82f6; font-size: 12px; font-weight: 500; margin: 4px 0;">${project.technologies}</p>` : ''}
                    </div>
                    <div style="text-align: right; font-size: 12px; color: #6b7280;">
                      📅 ${formatDate(project.startDate)} - ${project.current ? 'Present' : formatDate(project.endDate)}
                    </div>
                  </div>
                  ${project.description ? `<p style="color: #374151; margin: 8px 0;">${project.description}</p>` : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
            <!-- Education -->
            ${education.length > 0 ? `
              <div>
                <h2 style="font-size: 24px; font-weight: 300; color: #3b82f6; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #dbeafe;">
                  Education
                </h2>
                ${education.map(edu => `
                  <div style="margin-bottom: 15px;">
                    <h3 style="font-weight: 600; color: #1f2937; margin: 0;">${edu.degree || 'Degree'} in ${edu.field || 'Field'}</h3>
                    <p style="color: #3b82f6; margin: 2px 0;">${edu.institution || 'Institution'}</p>
                    <div style="display: flex; justify-content: space-between; font-size: 12px; color: #6b7280;">
                      <span>📅 ${formatDate(edu.graduationDate)}</span>
                      ${edu.gpa ? `<span>GPA: ${edu.gpa}</span>` : ''}
                    </div>
                  </div>
                `).join('')}
              </div>
            ` : ''}

            <!-- Skills -->
            ${skills.length > 0 ? `
              <div>
                <h2 style="font-size: 24px; font-weight: 300; color: #3b82f6; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 2px solid #dbeafe;">
                  Skills
                </h2>
                ${skills.map(skill => `
                  <div style="margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                      <span style="font-weight: 500; color: #1f2937;">${skill.name || 'Skill'}</span>
                      <div style="display: flex; gap: 2px;">
                        ${Array.from({ length: 4 }, (_, i) => 
                          `<span style="color: ${i < getLevelStars(skill.level) ? '#3b82f6' : '#d1d5db'};">★</span>`
                        ).join('')}
                      </div>
                    </div>
                    <div style="width: 100%; background: #e5e7eb; border-radius: 4px; height: 8px;">
                      <div style="background: #3b82f6; height: 8px; border-radius: 4px; width: ${(getLevelStars(skill.level) / 4) * 100}%; transition: width 0.3s;"></div>
                    </div>
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </div>
        </div>
      `;

    case 'creative':
      return `
        <div style="font-family: 'Arial', sans-serif; color: #1f2937; line-height: 1.6; display: grid; grid-template-columns: 1fr 2fr; min-height: 100%; gap: 0;">
          <!-- Left Sidebar -->
          <div style="background: linear-gradient(180deg, #8b5cf6, #ec4899); color: white; padding: 25px; margin: -20mm 0 -20mm -20mm;">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="width: 80px; height: 80px; background: rgba(255,255,255,0.2); border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold;">
                ${personalInfo.fullName ? personalInfo.fullName.split(' ').map(n => n[0]).join('') : 'YN'}
              </div>
              <h1 style="font-size: 24px; font-weight: bold; margin: 0;">
                ${personalInfo.fullName || 'Your Name'}
              </h1>
            </div>

            <!-- Contact Info -->
            <div style="margin-bottom: 30px;">
              <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 8px;">Contact</h3>
              <div style="font-size: 12px; line-height: 1.8;">
                ${personalInfo.email ? `<div style="margin-bottom: 8px;">📧 ${personalInfo.email}</div>` : ''}
                ${personalInfo.phone ? `<div style="margin-bottom: 8px;">📞 ${personalInfo.phone}</div>` : ''}
                ${personalInfo.location ? `<div style="margin-bottom: 8px;">📍 ${personalInfo.location}</div>` : ''}
                ${personalInfo.linkedIn ? `<div style="margin-bottom: 8px;">💼 ${personalInfo.linkedIn}</div>` : ''}
                ${personalInfo.portfolio ? `<div style="margin-bottom: 8px;">🌐 ${personalInfo.portfolio}</div>` : ''}
              </div>
            </div>

            <!-- Skills -->
            ${skills.length > 0 ? `
              <div style="margin-bottom: 30px;">
                <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 8px;">Skills</h3>
                ${skills.map(skill => `
                  <div style="margin-bottom: 15px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                      <span style="font-weight: 500; font-size: 12px;">${skill.name || 'Skill'}</span>
                      <div style="display: flex; gap: 2px;">
                        ${Array.from({ length: 4 }, (_, i) => 
                          `<span style="color: ${i < getLevelStars(skill.level) ? 'white' : 'rgba(255,255,255,0.3)'}; font-size: 10px;">★</span>`
                        ).join('')}
                      </div>
                    </div>
                    <div style="width: 100%; background: rgba(255,255,255,0.2); border-radius: 4px; height: 6px;">
                      <div style="background: white; height: 6px; border-radius: 4px; width: ${(getLevelStars(skill.level) / 4) * 100}%;"></div>
                    </div>
                  </div>
                `).join('')}
              </div>
            ` : ''}

            <!-- Education -->
            ${education.length > 0 ? `
              <div>
                <h3 style="font-size: 16px; font-weight: 600; margin-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.3); padding-bottom: 8px; display: flex; align-items: center; gap: 8px;">
                  🎓 Education
                </h3>
                ${education.map(edu => `
                  <div style="margin-bottom: 15px; font-size: 12px;">
                    <h4 style="font-weight: 600; margin: 0 0 2px 0;">${edu.degree || 'Degree'}</h4>
                    <p style="color: rgba(255,255,255,0.8); margin: 2px 0;">${edu.field || 'Field'}</p>
                    <p style="color: rgba(255,255,255,0.8); margin: 2px 0;">${edu.institution || 'Institution'}</p>
                    <div style="display: flex; justify-content: space-between; font-size: 10px; color: rgba(255,255,255,0.7); margin-top: 4px;">
                      <span>${formatDate(edu.graduationDate)}</span>
                      ${edu.gpa ? `<span>GPA: ${edu.gpa}</span>` : ''}
                    </div>
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </div>

          <!-- Right Content -->
          <div style="padding: 30px;">
            <!-- Experience -->
            ${experience.length > 0 ? `
              <div style="margin-bottom: 30px;">
                <h2 style="font-size: 24px; font-weight: bold; color: #8b5cf6; margin-bottom: 20px; display: flex; align-items: center; gap: 8px;">
                  💼 Professional Experience
                </h2>
                ${experience.map((exp, index) => `
                  <div style="position: relative; margin-bottom: 25px;">
                    <div style="display: flex; align-items: start; gap: 15px;">
                      <div style="display: flex; flex-direction: column; align-items: center;">
                        <div style="width: 15px; height: 15px; background: #8b5cf6; border-radius: 50%;"></div>
                        ${index < experience.length - 1 ? '<div style="width: 2px; height: 60px; background: #e5e7eb; margin-top: 8px;"></div>' : ''}
                      </div>
                      <div style="flex: 1;">
                        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                          <div>
                            <h3 style="font-weight: bold; font-size: 16px; color: #1f2937; margin: 0;">${exp.position || 'Position'}</h3>
                            <p style="color: #8b5cf6; font-weight: 600; margin: 2px 0;">${exp.company || 'Company'}</p>
                          </div>
                          <div style="text-align: right; font-size: 12px; color: #6b7280;">
                            📅 ${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}
                          </div>
                        </div>
                        ${exp.description ? `<p style="color: #374151; margin: 8px 0; font-size: 14px;">${exp.description}</p>` : ''}
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            ` : ''}

            <!-- Projects -->
            ${projects.length > 0 ? `
              <div>
                <h2 style="font-size: 24px; font-weight: bold; color: #8b5cf6; margin-bottom: 20px; display: flex; align-items: center; gap: 8px;">
                  💻 Featured Projects
                </h2>
                ${projects.map(project => `
                  <div style="border-left: 4px solid #8b5cf6; padding-left: 15px; background: #f8fafc; padding: 15px; border-radius: 0 8px 8px 0; margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                      <div style="flex: 1;">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                          <h3 style="font-weight: bold; color: #1f2937; margin: 0;">${project.name || 'Project Name'}</h3>
                          ${project.url ? '<span style="color: #8b5cf6;">🔗</span>' : ''}
                        </div>
                        ${project.technologies ? `
                          <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 8px;">
                            ${project.technologies.split(',').map(tech => 
                              `<span style="background: #e0e7ff; color: #5b21b6; padding: 2px 6px; border-radius: 12px; font-size: 10px;">${tech.trim()}</span>`
                            ).join('')}
                          </div>
                        ` : ''}
                      </div>
                      <div style="text-align: right; font-size: 12px; color: #6b7280;">
                        📅 ${formatDate(project.startDate)} - ${project.current ? 'Present' : formatDate(project.endDate)}
                      </div>
                    </div>
                    ${project.description ? `<p style="color: #374151; margin: 8px 0; font-size: 14px;">${project.description}</p>` : ''}
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </div>
        </div>
      `;

    default:
      return generateResumeHTML(formData, 'classic');
  }
};