This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.



Avantages de l'Isolation avec Docker

    Isolation des Processus :
        Chaque conteneur Docker fonctionne dans un environnement isolé avec ses propres processus, système de fichiers et réseau. Cela signifie que même si un processus à l'intérieur du conteneur est corrompu ou malveillant, il ne pourra pas affecter le système hôte ou d'autres conteneurs.

    Système de Fichiers Isolé :
        Les conteneurs ont leur propre système de fichiers, séparé de celui du système hôte. Toute modification ou corruption de fichiers dans le conteneur n'affecte pas le système de fichiers du système hôte.

    Facilité de Nettoyage :
        Si quelque chose ne va pas à l'intérieur du conteneur, vous pouvez facilement le supprimer et recréer un nouveau conteneur à partir de l'image Docker, garantissant un environnement propre et sans corruption.

    Contrôle des Ressources :
        Docker permet de limiter les ressources (CPU, mémoire) disponibles pour chaque conteneur, réduisant ainsi l'impact d'un conteneur défectueux sur le reste du système.

Fonctionnement de l'Isolation avec Docker

Voici comment Docker garantit que les problèmes à l'intérieur d'un conteneur n'affectent pas votre application globale :

    Création d'un Conteneur pour chaque Clonage :
        Chaque fois qu'un utilisateur demande de cloner un dépôt, un nouveau conteneur Docker est créé pour cette opération spécifique. Ce conteneur est isolé du reste du système.

    Suppression du Conteneur après l'Opération :
        Après que le dépôt a été cloné et les fichiers nécessaires ont été extraits, le conteneur est supprimé. Cela garantit qu'aucune donnée corrompue ou non sécurisée ne persiste.

    Isolation des Répertoires :
        Le répertoire dans lequel le dépôt est cloné est à l'intérieur du conteneur. Si le répertoire est corrompu, cela n'affecte que le conteneur spécifique et non le système hôte ou d'autres conteneurs.

Exécution de l'Isolation avec Docker

Voici comment mettre en place cette isolation dans votre application Next.js avec Docker :
Dockerfile

Dockerfile

# Utiliser une image de base officielle Node.js
FROM node:16

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste de l'application
COPY . .

# Commande à exécuter lorsque le conteneur démarre
CMD ["node", "scripts/clone-repo.js"]

Script de Clonage

javascript

// scripts/clone-repo.js
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs').promises;

const repoUrl = process.argv[2];
const cloneDir = path.join('/tmp', 'clone', `${Date.now()}`);

const cloneRepo = async (repoUrl, cloneDir) => {
  if (!repoUrl) {
    throw new Error('Repository URL is required');
  }

  await fs.mkdir(cloneDir, { recursive: true });

  execSync(`git clone ${repoUrl} ${cloneDir}`, { stdio: 'inherit' });

  const files = await getFiles(cloneDir);

  await fs.rm(cloneDir, { recursive: true, force: true });

  return files;
};

const getFiles = async (dir, filelist = []) => {
  const files = await fs.readdir(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = await fs.stat(filePath);
    if (stat.isDirectory()) {
      filelist = await getFiles(filePath, filelist);
    } else {
      filelist.push(filePath);
    }
  }
  return filelist;
};

cloneRepo(repoUrl, cloneDir)
  .then(files => console.log(files.join('\n')))
  .catch(err => console.error(err.message));

API Route dans Next.js

typescript

// pages/api/clone.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { spawn } from 'child_process';

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const { repoUrl } = req.body;

  if (!repoUrl) {
    return res.status(400).json({ error: 'Repository URL is required' });
  }

  const dockerProcess = spawn('docker', [
    'run',
    '--rm',
    'clone-repo-image',
    repoUrl,
  ]);

  let output = '';
  dockerProcess.stdout.on('data', (data) => {
    output += data.toString();
  });

  dockerProcess.stderr.on('data', (data) => {
    console.error(data.toString());
  });

  dockerProcess.on('close', (code) => {
    if (code === 0) {
      res.status(200).json({ files: output.split('\n').filter(Boolean) });
    } else {
      res.status(500).json({ error: 'Failed to clone repository' });
    }
  });
};

export default handler;

Diagramme de Flux d'Exécution en reStructuredText (reST)

rst

Application de Clonage de Dépôt GitHub
======================================

Diagramme de Flux d'Exécution
------------------------------

1. Utilisateur saisit l'URL du dépôt sur le frontend
---------------------------------------------------

+-----------------------------+
| Utilisateur                 |
| saisit l'URL du dépôt GitHub|
+-------------+---------------+
              |
              v
2. Frontend envoie la requête à l'API
-------------------------------------

+------------------------------------+
| Frontend (Next.js)                 |
|                                     |
| pages/index.tsx                    |
+------------------------------------+
              |
              v
3. Route API reçoit la requête
------------------------------

+------------------------------------+
| Backend (Next.js API Route)        |
|                                     |
| pages/api/clone.ts                 |
+------------------------------------+
              |
              v
4. API démarre un conteneur Docker
----------------------------------

+------------------------------------+
| Backend                            |
| Démarre un conteneur Docker        |
| avec l'image `clone-repo-image`    |
+------------------------------------+
              |
              v
5. Conteneur Docker clone le dépôt
----------------------------------

+------------------------------------+
| Conteneur Docker                   |
| Exécute `clone-repo.js`            |
| - Clone le dépôt GitHub            |
| - Lit les fichiers clonés          |
| - Retourne la liste des fichiers   |
+------------------------------------+
              |
              v
6. Conteneur termine et retourne les données à l'API
-----------------------------------------------------

+------------------------------------+
| Backend (Next.js API Route)        |
|                                     |
| Récolte les données du conteneur   |
| et les retourne au frontend        |
+------------------------------------+
              |
              v
7. Frontend affiche les fichiers à l'utilisateur
------------------------------------------------

+-----------------------------+
| Frontend (Next.js)          |
| Affiche la liste des fichiers|
| clonés à l'utilisateur       |
+-----------------------------+

En utilisant cette approche, vous garantissez que votre application reste protégée contre les répertoires corrompus et les opérations non sécurisées, en utilisant des conteneurs Docker pour isoler chaque opération de clonage.
vois tu une meilleur maniere de faire pour serurisé l'integrité de l'app?
ChatGPT

Pour sécuriser davantage l'intégrité de votre application, vous pouvez combiner plusieurs pratiques et outils en plus de l'utilisation des conteneurs Docker. Voici quelques améliorations et meilleures pratiques à considérer :
1. Validation et Sanitation de l'Entrée Utilisateur

Avant de démarrer le conteneur Docker avec l'URL du dépôt, validez et nettoyez l'entrée utilisateur pour vous assurer qu'elle ne contient pas de caractères ou de structures potentiellement dangereuses.

typescript

// pages/api/clone.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { spawn } from 'child_process';
import { isValidUrl } from '../../utils/validators';  // Utilisez une fonction de validation

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const { repoUrl } = req.body;

  if (!repoUrl || !isValidUrl(repoUrl)) {
    return res.status(400).json({ error: 'Invalid Repository URL' });
  }

  const dockerProcess = spawn('docker', [
    'run',
    '--rm',
    'clone-repo-image',
    repoUrl,
  ]);

  let output = '';
  dockerProcess.stdout.on('data', (data) => {
    output += data.toString();
  });

  dockerProcess.stderr.on('data', (data) => {
    console.error(data.toString());
  });

  dockerProcess.on('close', (code) => {
    if (code === 0) {
      res.status(200).json({ files: output.split('\n').filter(Boolean) });
    } else {
      res.status(500).json({ error: 'Failed to clone repository' });
    }
  });
};

export default handler;

2. Utilisation de Politiques de Sécurité de Conteneur

Appliquez des politiques de sécurité strictes pour vos conteneurs Docker :

    Non-Root User : Exécutez le conteneur en tant qu'utilisateur non root pour limiter les permissions.
    Seccomp Profiles : Utilisez des profils Seccomp pour limiter les appels système accessibles par les conteneurs.
    Capabilities : Restreignez les capacités des conteneurs pour minimiser les risques.

Exemple Dockerfile avec Non-Root User

Dockerfile

# Utiliser une image de base officielle Node.js
FROM node:16

# Créer un utilisateur non-root
RUN addgroup --system appgroup && adduser --system appuser --ingroup appgroup

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste de l'application
COPY . .

# Changer l'utilisateur pour l'utilisateur non-root
USER appuser

# Commande à exécuter lorsque le conteneur démarre
CMD ["node", "scripts/clone-repo.js"]

3. Monitoring et Logging

Mettez en place un système de monitoring et de logging pour détecter toute activité anormale ou suspecte. Utilisez des outils comme Prometheus, Grafana, ou ELK Stack pour surveiller vos conteneurs et collecter des logs.
4. Scanner les Images Docker

Avant de déployer vos images Docker, utilisez des scanners de sécurité comme Clair ou Trivy pour détecter les vulnérabilités dans les images Docker.

sh

# Scanner une image Docker avec Trivy
trivy image clone-repo-image

5. Limiter les Ressources des Conteneurs

Utilisez des limites de ressources pour empêcher un conteneur de consommer toutes les ressources du système en cas de comportement anormal.
Exemple de Limitation des Ressources

sh

docker run --rm --memory=512m --cpus="1.0" clone-repo-image <repoUrl>

6. Utilisation de Répertoires Temporaire Sécurisés

Utilisez des répertoires temporaires sécurisés pour le clonage et assurez-vous qu'ils sont nettoyés après chaque utilisation.
Script de Clonage avec Nettoyage

javascript

// scripts/clone-repo.js
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs').promises;

const repoUrl = process.argv[2];
const cloneDir = path.join('/tmp', 'clone', `${Date.now()}`);

const cloneRepo = async (repoUrl, cloneDir) => {
  if (!repoUrl) {
    throw new Error('Repository URL is required');
  }

  await fs.mkdir(cloneDir, { recursive: true });

  try {
    execSync(`git clone ${repoUrl} ${cloneDir}`, { stdio: 'inherit' });
    const files = await getFiles(cloneDir);
    return files;
  } finally {
    await fs.rm(cloneDir, { recursive: true, force: true });
  }
};

const getFiles = async (dir, filelist = []) => {
  const files = await fs.readdir(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = await fs.stat(filePath);
    if (stat.isDirectory()) {
      filelist = await getFiles(filePath, filelist);
    } else {
      filelist.push(filePath);
    }
  }
  return filelist;
};

cloneRepo(repoUrl, cloneDir)
  .then(files => console.log(files.join('\n')))
  .catch(err => console.error(err.message));

Conclusion

En combinant ces meilleures pratiques avec l'utilisation de Docker, vous pouvez créer une application robuste et sécurisée qui minimise les risques associés aux opérations de clonage de dépôts GitHub. Docker fournit une isolation solide, mais une approche de sécurité en profondeur avec des validations, des limitations de ressources, un monitoring et une gestion des utilisateurs renforcera encore plus l'intégrité de votre application.


src/
├── components/
│   ├── InputForm.tsx
│   ├── ErrorMessage.tsx
│   ├── NavBar.tsx
│   └── Tree.tsx
├── pages/
│   ├── api/
│   │   ├── github/
│   │   │   └── getRepoTree.ts
│   ├── _app.tsx
│   └── index.tsx
├── utils/
│   ├── apiUtils.ts
│   └── treeUtils.ts
└── data/
    └── logo.svg


pnpm prisma studio
