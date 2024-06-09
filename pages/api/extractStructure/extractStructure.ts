import { getRegexPatterns } from '../../../app/utils/dataProcessing';
import { File } from '../../../app/utils/types';

export const extractFileData = (fileContent: string, extend: string): File | undefined => {
  console.log("Extracting file data from content");

  if (extend === '.ts' || extend === '.js' || extend === '.tsx' || extend === '.jsx' || extend === '.css') {
    const { importPattern, exportPattern, cssPattern } = getRegexPatterns(extend);

    const imports = fileContent.match(importPattern) || [];
    const exports = fileContent.match(exportPattern) || [];

    const cssMatches: string[] = [];
    const lines = fileContent.split('\n');

    lines.forEach((line, lineNumber) => {
      let match;
      while ((match = cssPattern.exec(line)) !== null) {
        const elementType = match[1];
        const classNames = match[2];
        const columnNumber = match.index + 1;
        cssMatches.push(`ClassName: ${classNames}, Element: ${elementType}, Line: ${lineNumber + 1}, Column: ${columnNumber}`);
      }
    });

    return {
      type: 'file',
      name: '', // Le nom doit être défini ailleurs
      extension: extend,
      imports,
      exports,
      css: cssMatches,
    };
  }

  return undefined;
};
