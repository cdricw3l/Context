// next_gpt/app/page.tsx

'use client';

import React, { useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import RightPanel from '../components/RightPanel';
import NavBar from '../components/NavBar';
import LeftPanel from '../components/LeftPaneltest';
import Loading from '../components/Loading';

const Home: React.FC = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      signIn();
    }
  }, [status]);

  if (status === 'loading') {
    return <Loading />;
  }

  if (!session) {
    return null; // Optionally, you can return a loading spinner or a placeholder here
  }

  return (
    <div className="flex h-screen max-h-max w-full">
      <div className="flex w-64 shadow-md">
        <NavBar />
      </div>
      <div className="flex flex-row flex-auto">
        <div className="flex-auto">
          <RightPanel />
        </div>
        <div className="flex-auto">
          <LeftPanel />
        </div>
      </div>
    </div>
  );
};

export default Home;
