// pages/api/extractStructure/extractStructure.ts

import { getRegexPatterns } from '../../../app/utils/dataProcessing';
import { File } from '../../../app/utils/types';

export const extractFileData = (fileContent: string, extend: string): File | undefined => {
  console.log("Extracting file data from content");
  console.log("extensiom" + extend)
  if (extend === '.ts' || extend === '.js' || extend === '.tsx' || extend === '.jsx' || extend === '.css') {
    const { importPattern, exportPattern, cssPattern } = getRegexPatterns(extend);

    const imports = fileContent.match(importPattern) || [];
    const exports = fileContent.match(exportPattern) || [];
    const css = fileContent.match(cssPattern) || [];

    return {
      type: 'file',
      name: '', // Le nom doit être défini ailleurs
      extension: extend,
      imports,
      exports,
      css,
    };
  }

  return undefined;
};
