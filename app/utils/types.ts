export interface FileNode {
  name: string;
  path: string;
  type: 'blob' | 'tree';
  children?: FileNode[];
  sha: string;
  isOpen: boolean; // Ajoutez cette propriété pour gérer l'état ouvert/fermé
}

export interface TreeElement {
  path: string;
  mode: string;
  type: 'blob' | 'tree';
  sha: string;
  size: number;
  url: string;
}

export interface File {
  type: 'file';
  name: string;
  extension: string;
  imports: string[];
  css: string[];
  exports: string[];
}

export interface FileDetail {
  fileName: string;
  fileContent: string;
  fileContentMinimized: string;
  isBinary: boolean;
  fileDetail: any;
}


export interface Directory {
  type: 'directory';
  name: string;
  children: (File | Directory)[];
}

 export interface ProjectStructureProps {
  structure: Directory;
}