// components/SubscriptionModal.tsx
import React, { useState } from 'react';

interface SubscriptionModalProps {
  onClose: () => void;
  currentPlan: string;
}

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ onClose, currentPlan }) => {
  const [newPlan, setNewPlan] = useState(currentPlan);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

  const handleUpdateSubscription = async () => {
    setIsUpdating(true);
    // Appel API pour mettre à jour l'abonnement
    try {
      const response = await fetch('/api/subscription/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPlan }),
      });
      if (!response.ok) throw new Error('Failed to update subscription');
      alert('Subscription updated successfully');
    } catch (error) {
      console.error('Error updating subscription:', error);
      alert('Failed to update subscription');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelSubscription = async () => {
    setIsCanceling(true);
    // Appel API pour annuler l'abonnement
    try {
      const response = await fetch('/api/subscription/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPlan }),
      });
      if (!response.ok) throw new Error('Failed to cancel subscription');
      alert('Subscription canceled successfully');
    } catch (error) {
      console.error('Error canceling subscription:', error);
      alert('Failed to cancel subscription');
    } finally {
      setIsCanceling(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-60" onClick={onClose}></div>
      <div className="bg-white rounded-lg p-8 relative z-10 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-center">Manage Your Subscription</h2>
          <button className="text-black px-4 py-2" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="mb-4">
          <label htmlFor="plan" className="block text-sm font-medium text-gray-700">
            Select New Plan
          </label>
          <select
            id="plan"
            name="plan"
            value={newPlan}
            onChange={(e) => setNewPlan(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="free">Free</option>
            <option value="medium">Medium - $10/month</option>
            <option value="premium">Premium - $20/month</option>
          </select>
        </div>
        <div className="flex justify-between">
          <button
            onClick={handleUpdateSubscription}
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            disabled={isUpdating}
          >
            {isUpdating ? 'Updating...' : 'Update Subscription'}
          </button>
          <button
            onClick={handleCancelSubscription}
            className="bg-red-500 text-white px-4 py-2 rounded"
            disabled={isCanceling}
          >
            {isCanceling ? 'Canceling...' : 'Cancel Subscription'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;
