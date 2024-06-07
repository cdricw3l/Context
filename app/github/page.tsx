'use client';

import { useState } from 'react';

const Home: React.FC = () => {
  const [error, setError] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [branch, setBranch] = useState('main');
  const [accessToken, setAccessToken] = useState('');
  const [response, setResponse] = useState<any>(null);

  const fetchRepoTree = async () => {
    setError('');
    setResponse(null);
    try {
      console.log("Fetching tree for repo: ", repoUrl);
      const res = await fetch('api/clone/cloneRepo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ repoUrl, branch, accessToken }),
      });
      const data = await res.json();
      if (res.ok) {
        console.log("Data receir4r2ved: ", data);
        setResponse(data);
      } else {
        setError(data.message);
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h1>GitHub Repository Tree Viewer</h1>
      <input
        type="text"
        className="text-black"
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
        placeholder="Enter GitHub Repository URL"
      />
      <input
        type="text"
        className="text-black"
        value={branch}
        onChange={(e) => setBranch(e.target.value)}
        placeholder="Enter Branch (default: main)"
      />
      <input
        type="text"
        className="text-black"
        value={accessToken}
        onChange={(e) => setAccessToken(e.target.value)}
        placeholder="Enter GitHub Access Token"
      />
      <button onClick={fetchRepoTree}>Fetch Tree</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {response && (
        <div>
          <h2>Repository Data</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Home;
