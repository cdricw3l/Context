'use client';

import React, { useEffect, useState } from 'react';
import ProjectStructure from '../components/ProjectStructure';
import { Directory } from '../utils/types';

const Home: React.FC = () => {
  const [structure, setStructure] = useState<Directory | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/extractStructure/extractStructure');
      const data = await response.json();
      console.log(data);
      setStructure(data);
    };

    fetchData();
  }, []);

  if (!structure) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Project Structure</h1>
      <ProjectStructure structure={structure} />
    </div>
  );
};

export default Home;
