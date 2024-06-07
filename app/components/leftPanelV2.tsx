//app/componant/leftPanel.txt

import React, { useState, useEffect } from 'react';
import siteMeta from '../../public/static/data';
import { useResponse } from '../context/ResponseContext';
import { FileNode, Directory, File, TreeElement } from '../utils/types';
import RepoStats from './RepoStats';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import NavFile from './Navfile';
import FileDetails from './FileDetails';
import ProjectStructure from './ProjectStructure';
import Loading from './Loading';
import { buildTree } from '../utils/treeUtils';
import Tree from './Tree';

export default function LeftPanel() {
  const [error, setError] = useState('');
  const [repoUrl, setRepoUrl] = useState('https://github.com/jhonny-jane-w3l/next_rust_gpt.git');
  const [branch, setBranch] = useState('main');
  const [accessToken, setAccessToken] = useState('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');
  const { response, setResponse, structure, setStructure, userTreeState, setUserTreeState, isTextView, setIsTextView, treeData, setTreeData } = useResponse();
  const [isClean, setClean] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState(siteMeta.leftBar[3]);

  // Ajouter les états pour les statistiques du dépôt
  const [commits, setCommits] = useState<number>(0);
  const [contributors, setContributors] = useState<{ login: string; contributions: number }[]>([]);
  const [stars, setStars] = useState<number>(0);
  const [forks, setForks] = useState<number>(0);

  // Ajouter un état pour le contenu Markdown
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const fetchRepoTree = async () => {
    console.log("Fetching tree for repo: ", repoUrl);
    setError('');
    setResponse(null);
    try {
      const res = await fetch('api/clone/cloneRepo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ repoUrl, branch, accessToken }),
      });
      const data = await res.json();

      if (res.ok) {
        console.log("Data received: ", data);
        setResponse(data);
        const treeData = buildTree(data.tree as TreeElement[]);
        setTreeData(treeData);
        setUserTreeState(treeData);  // Initialize the user tree state
      } else {
        setError(data.message);
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleOptionChange = async (option: string) => {
    setSelectedOption(option);
    console.log("Selected option: ", option);
    if (option === 'Documentation') {
      try {
        const res = await fetch(`/api/posts/posts?slug=github-markdown-guide`); // Remplacer 'appendix-01-keywords' par le slug approprié
        const post = await res.json();
        
        if (res.ok) {
          setMarkdownContent(post.content);
          console.log("Post: ", markdownContent);
          setError('');
        } else {
          setError(post.error);
        }
      } catch (error) {
        console.error('Failed to fetch markdown content', error);
        setError('Failed to fetch markdown content');
      }
    }
  };

  const handleTreeToggle = (node: FileNode) => {
    if (node.children) {
      node.isOpen = !node.isOpen;
      setUserTreeState({ ...userTreeState }); // Update the user tree state
    }
  };

  const handleFileSelect = (file: File) => {
    setSelectedFiles(prevFiles => [...prevFiles, file]);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const handleCopyFile = (file: File) => {
    setSelectedFiles(prevFiles => [...prevFiles, { ...file }]);
  };

  // Simuler la récupération des statistiques du dépôt pour cet exemple
  useEffect(() => {
    if (response) {
      // Ici, vous devez assigner les vraies valeurs récupérées
      setCommits(response.commits);
      setContributors(response.contributors);
      setStars(response.stars);
      setForks(response.forks);
    }
  }, [response]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/extractStructure/extractStructure');
      const data = await response.json();
      console.log(data);
      setStructure(data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedOption === 'global') {
      fetchRepoTree();
    }
  }, [selectedOption]);

  return (
    <div className="flex flex-auto flex-col h-full p-6 max-h-screen">
      <div className="flex flex-auto flex-row justify-center px-2 py-2">
        {siteMeta.leftBar.map((df, index) => (
          <button
            key={index}
            onClick={() => handleOptionChange(df)}
            className={`p-2 m-2 text-sm ${
              selectedOption === df
                ? 'bg-blue-700 text-white'
                : 'bg-blue-500 text-gray-300'
            } rounded-md hover:bg-blue-700 hover:text-white transition-colors duration-300`}
          >
            {df}
          </button>
        ))}
      </div>

      <div className="flex flex-row mx-2 justify-center "></div>

      <div className="border border-gray-300 overflow-x-scroll h-screen">
        {selectedOption === 'Tree' && structure === null  ?  (
          <Loading />
        
        ) : selectedOption === 'Tree' && structure !== null  ?  (
          <ProjectStructure structure={structure as Directory} />
        
        ) : selectedOption === 'Data repo' ? (
          <RepoStats commits={commits} contributors={contributors} stars={stars} forks={forks} />
        ) : selectedOption === 'Documentation' ? (
          error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>
              {markdownContent}
            </ReactMarkdown>
          )
        ) : selectedOption === 'global' ? (
              <ul className="text-left py-4 text-white text-sm">
                {treeData && <Tree node={treeData} onToggle={handleTreeToggle} />}
              </ul>
         ) : (
          <pre>
            {isClean ? JSON.stringify(response, null, 0) : JSON.stringify(response, null, 2)}
          </pre>
        )}
      </div>

      <div className="flex flex-col space-y-4 mt-4">
        {selectedFiles.map((file, index) => (
          <FileDetails
            key={index}
            file={file}
            onRemove={() => handleRemoveFile(index)}
            onCopy={() => handleCopyFile(file)}
          />
        ))}
      </div>
    </div>
  );
}
