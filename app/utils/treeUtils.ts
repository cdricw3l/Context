import { FileNode, TreeElement } from './types';

// Fonction pour transformer une liste de chemins en une arborescence de fichiers et trier les nœuds par ordre alphabétique
export const buildTree = (elements: TreeElement[]): FileNode => {
  console.log('Building tree from elements:', elements);

  const root: FileNode = { name: 'Root', path: '.', type: 'tree', children: [] };
  const map = new Map<string, FileNode>();
  map.set('', root);

  elements.forEach(({ path, type, sha }) => {
    const parts = path.split('/');
    let currentPath = '';
    parts.forEach((part, index) => {
      currentPath = currentPath ? `${currentPath}/${part}` : part;

      if (!map.has(currentPath)) {
        const node: FileNode = {
          name: part,
          path: currentPath,
          type: index === parts.length - 1 ? type : 'tree',
          sha: index === parts.length - 1 ? sha : undefined, // Ajoutez le SHA uniquement pour les fichiers (blobs)
          children: [],
          isOpen: false
        };
        map.set(currentPath, node);

        // Ajout de ce nœud à son nœud parent
        if (index > 0) {
          const parentPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
          const parentNode = map.get(parentPath);
          if (parentNode && parentNode.children) {
            parentNode.children.push(node);
            // Trie des enfants du nœud parent
            const folders = parentNode.children.filter(child => child.type === 'tree').sort((a, b) => a.name.localeCompare(b.name));
            const files = parentNode.children.filter(child => child.type === 'blob').sort((a, b) => a.name.localeCompare(b.name));
            parentNode.children = [...folders, ...files];
          }
        } else {
          // Si c'est le premier nœud, l'ajouter aux enfants de la racine
          root.children?.push(node);
          // Trie des enfants de la racine
          const folders = root.children?.filter(child => child.type === 'tree').sort((a, b) => a.name.localeCompare(b.name));
          const files = root.children?.filter(child => child.type === 'blob').sort((a, b) => a.name.localeCompare(b.name));
          root.children = [...(folders || []), ...(files || [])];
        }
      }
    });
  });

  console.log("root:", root);
  return root;
};

// Fonction pour générer une représentation textuelle de l'arborescence des fichiers
export const generateTextTree = (node: FileNode, indent: string = ''): string => {
  let treeText = `${indent}${node.name}\n`;

  if (node.children) {
    const childIndent = indent + '  ';
    const lastChildIndent = indent + '└─';
    const midChildIndent = indent + '├─';

    node.children.forEach((child, index) => {
      const isLast = index === node.children!.length - 1;
      treeText += generateTextTree(child, isLast ? lastChildIndent : midChildIndent);
    });
  }

  return treeText;
};
