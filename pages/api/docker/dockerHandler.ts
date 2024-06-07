import { NextApiRequest, NextApiResponse } from 'next';
import Docker from 'dockerode';

const docker = new Docker({ socketPath: '/var/run/docker.sock' });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    console.log('Method not allowed');
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { repoUrl, scriptPath } = req.body;
  console.log(`Received request to clone ${repoUrl} and run ${scriptPath}`);

  try {
    // Ensure the Ubuntu image is available
    console.log('Pulling the Ubuntu image if not available');
    await pullImage('ubuntu:latest');

    // Create and start a new container with Ubuntu image
    console.log('Creating a new container with Ubuntu image');
    const container = await createContainer('ubuntu:latest');

    console.log('Starting the container');
    await container.start();

    // Install Node.js and Git inside the container
    console.log('Installing Node.js and Git inside the container');
    await installPackages(container);

    // Clone the GitHub repo
    console.log('Cloning the GitHub repository');
    await cloneRepo(container, repoUrl);

    // Execute the script inside the container
    console.log('Executing the script inside the container');
    const output = await executeScript(container, scriptPath);

    // Send the output to Next.js
    res.status(200).json({ data: output });

    // Stop and remove the container
    console.log('Stopping the container');
    await container.stop();
    console.log('Removing the container');
    await container.remove();
  } catch (error) {
    console.error('Error during Docker operation:', error);
    res.status(500).json({ error: error.message });
  }
}

async function pullImage(imageName: string) {
  return new Promise<void>((resolve, reject) => {
    docker.pull(imageName, {}, (err: Error | null, stream: NodeJS.ReadableStream | undefined) => {
      if (err) {
        console.error(`Error pulling ${imageName} image:`, err);
        return reject(err);
      }

      if (stream) {
        stream.on('data', (chunk: Buffer) => console.log(`Pulling ${imageName}:`, chunk.toString()));
        stream.on('end', resolve);
        stream.on('error', (streamErr: Error) => {
          console.error(`Stream error while pulling ${imageName} image:`, streamErr);
          reject(streamErr);
        });
      }
    });
  });
}

async function createContainer(imageName: string) {
  return docker.createContainer({
    Image: imageName,
    Cmd: ['/bin/sh', '-c', 'while :; do sleep 1; done'],
    Tty: true,
    Volumes: {
      '/stuff': {},
    },
    HostConfig: {
      Binds: ['/home/vagrant:/stuff'],
    },
  });
}

async function installPackages(container: Docker.Container) {
  const installExec = await container.exec({
    Cmd: [
      'sh',
      '-c',
      'apt-get update && apt-get install -y curl git && curl -fsSL https://deb.nodesource.com/setup_14.x | bash - && apt-get install -y nodejs',
    ],
    AttachStdout: true,
    AttachStderr: true,
  });

  return new Promise<void>((resolve, reject) => {
    installExec.start((err: Error | null, stream: NodeJS.ReadableStream | undefined) => {
      if (err) {
        console.error('Error during installation:', err);
        return reject(err);
      }

      if (stream) {
        stream.on('data', (data: Buffer) => console.log('Installation output:', data.toString()));
        stream.on('end', resolve);
        stream.on('error', reject);
      }
    });
  });
}

async function cloneRepo(container: Docker.Container, repoUrl: string) {
  const cloneExec = await container.exec({
    Cmd: ['git', 'clone', repoUrl, '/repo'],
    AttachStdout: true,
    AttachStderr: true,
  });

  return new Promise<void>((resolve, reject) => {
    cloneExec.start((err: Error | null, stream: NodeJS.ReadableStream | undefined) => {
      if (err) {
        console.error('Error during git clone:', err);
        return reject(err);
      }

      if (stream) {
        stream.on('data', (data: Buffer) => console.log('git clone:', data.toString()));
        stream.on('end', resolve);
        stream.on('error', reject);
      }
    });
  });
}

async function executeScript(container: Docker.Container, scriptPath: string) {
  const exec = await container.exec({
    Cmd: ['node', `/repo/${scriptPath}`],
    AttachStdout: true,
    AttachStderr: true,
  });

  return new Promise<string>((resolve, reject) => {
    exec.start((err: Error | null, stream: NodeJS.ReadableStream | undefined) => {
      if (err) {
        console.error('Error during script execution:', err);
        reject(err);
      }

      if (stream) {
        let output = '';
        stream.on('data', (chunk: Buffer) => {
          const chunkStr = chunk.toString();
          console.log('Script output:', chunkStr);
          output += chunkStr;
        });

        stream.on('end', () => {
          console.log('Script execution completed');
          resolve(output);
        });

        stream.on('error', (streamErr: Error) => {
          console.error('Stream error during script execution:', streamErr);
          reject(streamErr);
        });
      }
    });
  });
}