// app/components/ButtonLogout.tsx

import React from 'react';
import { signOut } from 'next-auth/react';



const ButtonLogout: React.FC = () => {
  return (
    <button
      onClick={() => signOut()}
      className="px-4 py-2 text-white rounded-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
      </svg>
    </button>
  );
};

export default ButtonLogout;