import { Directory } from './types';


export const filterHiddenFilesAndDirectories = (directory: Directory): Directory => {
  const filteredChildren = directory.children
    .filter(child => !child.name.startsWith('.'))
    .map(child => {
      if (child.type === 'directory') {
        return filterHiddenFilesAndDirectories(child as Directory);
      }
      return child;
    })
    .filter(child => child.type !== 'directory' || (child.type === 'directory' && (child as Directory).children.length > 0));

  return {
    ...directory,
    children: filteredChildren,
  };
};

export const getRegexPatterns = (extension: string): { importPattern: RegExp, exportPattern: RegExp, cssPattern: RegExp } => {
  let importPattern: RegExp;
  let exportPattern: RegExp;
  let cssPattern: RegExp;

  switch (extension) {
    case '.js':
    case '.jsx':
    case '.ts':
    case '.tsx':
      importPattern = /^(import\s+.+\s+from\s+['"].+['"];?)/gm;
      exportPattern = /^(export\s+.+;?)/gm;
      cssPattern = /<(\w+)[^>]*className=["']([^"']+)["'][^>]*>/g;
      break;
    // Ajoutez d'autres cas pour d'autres extensions de fichier si nécessaire
    default:
      importPattern = /^$/; // Regex qui ne matche rien
      exportPattern = /^$/; // Regex qui ne matche rien
      cssPattern = /^$/; // Regex qui ne matche rien
  }

  return { importPattern, exportPattern, cssPattern };
};