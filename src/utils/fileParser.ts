import mammoth from 'mammoth';

export interface ParsedFile {
  content: string;
  filename: string;
  type: string;
}

export const parseFile = async (file: File): Promise<ParsedFile> => {
  const filename = file.name;
  const type = file.type;

  try {
    let content = '';

    if (type === 'text/plain') {
      content = await file.text();
    } else if (type === 'application/pdf') {
      // For PDF parsing, we'll extract text using a simple approach
      // In a production app, you might want to use pdf-parse or similar
      content = await extractPDFText(file);
    } else if (type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // Parse DOCX files using mammoth
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      content = result.value;
    } else {
      throw new Error(`Unsupported file type: ${type}`);
    }

    return {
      content: content.trim(),
      filename,
      type
    };
  } catch (error) {
    console.error('Error parsing file:', error);
    throw new Error(`Failed to parse ${filename}. Please try a different format.`);
  }
};

const extractPDFText = async (file: File): Promise<string> => {
  // Simple PDF text extraction
  // In a production environment, you'd want to use a proper PDF parsing library
  // For now, we'll return a placeholder message
  return `PDF content from ${file.name} - Please paste the text content manually for better accuracy.`;
};

export const validateFileType = (file: File): boolean => {
  const allowedTypes = [
    'text/plain',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  return allowedTypes.includes(file.type);
};

export const getFileTypeLabel = (type: string): string => {
  switch (type) {
    case 'text/plain':
      return 'Text File';
    case 'application/pdf':
      return 'PDF Document';
    case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      return 'Word Document';
    default:
      return 'Unknown';
  }
};