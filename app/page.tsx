'use client';

import React from 'react';
import RightPanel from './components/RightPanel';
import NavBar from './components/NavBar';
import LeftPanel from './components/LeftPanel';

const Home: React.FC = () => {
  console.log('Rendering the application...');
  return (
    <div className="flex h-screen max-h-max w-full">
      <div className="w-64 shadow-md">
        <NavBar />
      </div>
      <div className="flex-1 grid grid-cols-1">
        <div>
          {/* <RightPanel /> */}
        </div>
        <div>
          <LeftPanel />
        </div>
      </div>
    </div>
  );
};

export default Home;
