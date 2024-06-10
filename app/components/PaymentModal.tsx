// app/components/PaymentModal.tsx
import React from 'react';

interface PaymentModalProps {
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="bg-white rounded-lg p-8 relative z-10 max-w-3xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 rounded">Choose Your Plan</h2>
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Free Plan */}
          <div className="border border-gray-300 p-6 rounded-lg text-center shadow-lg">
            <h3 className="text-xl font-bold mb-4">Free</h3>
            <p className="mb-4">Access to basic features with limited functionality.</p>
            <p className="mb-4 font-bold text-lg">0$/month</p>
            <button
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-black px-4 py-2 rounded"
              onClick={() => window.location.href = 'https://buy.stripe.com/test_bIYdSS4FGcNPbss288'}
            >
              Choose Free
            </button>
          </div>
          {/* Medium Plan */}
          <div className="border border-gray-300 text-black p-6 rounded-lg text-center shadow-lg">
            <h3 className="text-xl font-bold mb-4">Medium</h3>
            <p className="mb-4">Enhanced features with more functionality.</p>
            <p className="mb-4 font-bold text-lg">10$/month</p>
            <button
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-black px-4 py-2 rounded"
              onClick={() => window.location.href = 'https://buy.stripe.com/test_bIYdSS4FGcNPbss288'}
            >
              Choose Medium
            </button>
          </div>
          {/* Premium Plan */}
          <div className="border border-gray-300 p-6 rounded-lg text-center shadow-lg">
            <h3 className="text-xl font-bold mb-4">Premium</h3>
            <p className="mb-4">Full access to all features with unlimited functionality.</p>
            <p className="mb-4 font-bold text-lg">20$/month</p>
            <button
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-black px-4 py-2 rounded"
              onClick={() => window.location.href = 'https://buy.stripe.com/test_bIYdSS4FGcNPbss288'}
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