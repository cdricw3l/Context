import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { filterHiddenFilesAndDirectories, getRegexPatterns } from '../../../app/utils/dataProcessing';
import { File, Directory } from '../../../app/utils/types';

const sourceDir = path.resolve('./../next_gpt');

export const extractFileData = (file: string, extend:string): File | undefined => {
    console.log("Extracting file data from: ", file);
  
    if (extend === '.ts' || extend === '.js' || extend === '.tsx' || extend === '.jsx' || extend === '.css') {
      if (fs.lstatSync(file).isFile()) {  // Vérification si c'est bien un fichier
        const fileContent = fs.readFileSync(file, 'utf-8');
        const { importPattern, exportPattern, cssPattern } = getRegexPatterns(extend);
  
        const imports = fileContent.match(importPattern) || [];
        const exports = fileContent.match(exportPattern) || [];
        const css = fileContent.match(cssPattern) || [];
  
        return {
          type: 'file',
          name: path.basename(file, path.extname(file)),
          extension: path.extname(file),
          imports,
          exports,
          css,
        };
      }
    }
    return undefined;
  };

/*const extractDirectoryData = (dirPath: string): Directory => {
  const dirName = path.basename(dirPath);
  const children: (File | Directory)[] = [];

  const files = fs.readdirSync(dirPath);
  files.forEach(file => {
    const file = path.join(dirPath, file);
    const isDirectory = fs.lstatSync(file).isDirectory();

    if (isDirectory) {
      children.push(extractDirectoryData(file));
    } else {
      const fileData = extractFileData(file);
      if (fileData) {
        children.push(fileData);
      }
    }
  });

  return {
    type: 'directory',
    name: dirName,
    children,
  };
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log(sourceDir);
  //const rawStructure: Directory = extractDirectoryData(sourceDir);
  //const filteredStructure = extractFileData(req.);
  res.status(200).json(filteredStructure);
}*/
