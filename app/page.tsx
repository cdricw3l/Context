'use client';

import React, { useEffect } from 'react'
import RightPanel from './components/RightPanel';
import NavBar from './components/NavBar';
import LeftPanel from './components/LeftPanel';
import Loading from './components/Loading';



const Home: React.FC = () => {


  console.log('Session found, rendering the application...');
  return (
    <div className="flex h-screen max-h-max w-full">
      <div className="w-64 shadow-md">
        <NavBar />
      </div>
      <div className="flex-1 grid grid-cols-2">
        <div>
          <RightPanel />
        </div>
        <div>
          <LeftPanel />
        </div>
      </div>
    </div>
  );
};

export default Home;
