import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface PaymentModalProps {
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ onClose }) => {
  const { data: session } = useSession();
  const data = session

  console.log('data:', data);
  const [userExists, setUserExists] = useState<boolean | null>(null);

 



  const handleCheckout = async (priceId: string) => {
    console.log('priceId:', priceId);
    try {
      console.log('Checking usebebbbbbbbbr exists...');
      const response = await fetch('/api/auth/check_user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to check user');
      }

      const { exists } = await response.json();
      setUserExists(exists);
    } catch (error) {
      console.error('Error checking user:', error);
      setUserExists(false);
    }

    try {
      if (userExists === false) {
        window.location.href = '/sign';
        return;
      }
      
      const response = await fetch('/api/auth/checkout_sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId , email: data?.user?.email}),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        console.error('Error response from server:', errorMessage);
        return;
      }

      const session = await response.json();
      console.log('Checkout session created:', session);
      window.location.href = session.url;
    } catch (error) {
      console.error('Error handling checkout:', error);
    }
  };

  const checkmark = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="inline w-6 h-6 text-green-500">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );

  

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-60" onClick={onClose}></div>
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-8 relative z-10 max-w-3xl w-full">
        <div className="flex justify-center items-center mb-6">
          <h2 className="text-2xl text-center font-bold text-white py-2 rounded">Choose Your Plan</h2>
          <button
            className="text-white px-4 py-2 rounded ml-4"
            onClick={onClose}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Free Plan */}
          <div className="text-black border border-gray-300 p-6 rounded-lg text-center shadow-lg">
            <h3 className="text-xl font-bold mb-4">Free</h3>
            <p className="mb-4">1 context 2 files.</p>
            <div className="mb-4 text-left">
              {checkmark} 1 context<br />
              {checkmark} 2 files<br />
            </div>
            <p className="mb-4 font-bold text-lg">0$/month</p>
            <button
              className="bg-gradient-to-r from-purple-500 to-transparent via-re bg-green-500 text-black px-4 py-2 rounded"
              onClick={() => onClose()}
            >
              Continue as visitor
            </button>
          </div>
          {/* Medium Plan */}
          <div className="border border-gray-300 text-black p-6 rounded-lg text-center shadow-lg">
            <h3 className="text-xl font-bold mb-4">Medium</h3>
            <p className="mb-4">2 contexts 5 files per context.</p>
            <div className="mb-4 text-left">
              {checkmark} 1 contexts<br />
              {checkmark} 15 files per context<br />
              {checkmark} Enhanced features<br />
            </div>
            <p className="mb-4 font-bold text-lg">10$/month</p>
            <button
              className="bg-gradient-to-r from-blue-500 to-transparent bg-green-500 text-black px-4 py-2 rounded"
              onClick={() => handleCheckout(process.env.NEXT_PUBLIC_STRIPE_PRICE_MEDIUM!)}
            >
              Choose Medium
            </button>
          </div>
          {/* Premium Plan */}
          <div className="text-black border border-gray-300 p-6 rounded-lg text-center shadow-lg">
            <h3 className="text-xl font-bold mb-4">Premium</h3>
            <p className="mb-4">Full access to all features with unlimited functionality.</p>
            <div className="mb-4 text-left text-sm">
              {checkmark} Unlimited contexts<br />
              {checkmark} Unlimited files<br />
              {checkmark} Full new feature access<br />
              {checkmark} Priority support<br />
            </div>
            <p className="mb-4 font-bold text-lg">20$/month</p>
            <button
              className="bg-gradient-to-r from-blue-500 to-transparent bg-green-500 text-black px-4 py-2 rounded"
              onClick={() => handleCheckout(process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM!)}
            >
              Choose Premium
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
