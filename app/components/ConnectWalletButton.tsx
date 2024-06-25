'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import ModalExtension from '../components/ModalExtension';
import Loading from '../components/Loading';

export interface PolkadotAccount {
  address: string;
  meta: {
    name?: string;
    source: string;
  };
}

const truncateAddress = (address: string, startLength = 4, endLength = 4) => {
  if (address.length <= startLength + endLength) {
    return address;
  }
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
};

const ConnectWalletButton: React.FC = () => {
  const [accounts, setAccounts] = useState<PolkadotAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<PolkadotAccount | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accountInfo, setAccountInfo] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initPolkadotExtension = async () => {
      const { web3Enable, web3Accounts } = await import('@polkadot/extension-dapp');
      const extensions = await web3Enable('My App');
      if (extensions.length === 0) {
        console.log('No extension installed');
        return;
      }

      const accounts = await web3Accounts();
      setAccounts(accounts);

      const storedAccount = localStorage.getItem('selectedAccount');
      if (storedAccount) {
        const selected = accounts.find(account => account.address === storedAccount);
        if (selected) {
          setSelectedAccount(selected);
          await fetchAccountInfo([selected]);
        }
      }
    };

    if (typeof window !== 'undefined') {
      initPolkadotExtension();
    }
  }, []);

  const openModal = async () => {
    setIsModalOpen(true);
    setIsLoading(true);
    await fetchAccountInfo(accounts);
    setIsLoading(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleAccountSelect = (account: PolkadotAccount | null) => {
    if (account) {
      setSelectedAccount(account);
      localStorage.setItem('selectedAccount', account.address);
    }
    closeModal();
  };

  const handleDisconnect = () => {
    setSelectedAccount(null);
    localStorage.removeItem('selectedAccount');
    closeModal();
  };

  const fetchAccountInfo = async (accounts: PolkadotAccount[]) => {
    try {
      const response = await fetch('/api/polkadot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accounts: accounts.map(account => account.address),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAccountInfo(data.accountInfo);
      } else {
        console.error('Failed to fetch account info');
      }
    } catch (error) {
      console.error('Failed to fetch account info', error);
    }
  };

  const formatBalance = (balance: number) => {
    const formattedBalance = balance / 10**10;
    if (formattedBalance < 1) {
      return (balance / 10**10).toFixed(4); // Adjust the division if the balance is in different units
    } else {
      return formattedBalance.toFixed(2);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={openModal}
        className="px-4 py-2 bg-blue-500 bg-gradient-to-t from-pink-500  to-transparent text-black rounded-lg hover:bg-blue-400 transition duration-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3"
          />
        </svg>
      </button>
      {selectedAccount ? (
        <div className='flex flex-row items-center'>
          <div className="flex flex-col text-sm text-black text-center space-y-1 mr-4">
            <div className="flex items-center space-x-2">
              <span className="font-semibold">{selectedAccount.meta.name}</span>
              <span className="text-gray-600">{truncateAddress(selectedAccount.address)}</span>
            </div>
            <div className="text-blue-600 font-medium">
              Balance: {accountInfo[selectedAccount.address]?.balance ? formatBalance(accountInfo[selectedAccount.address].balance) + " FLMG" : '0 FLMG'}
            </div>
          </div>
          <div className="flex flex-row  items-center justify-end space-y-1 space-x-1">
            <span className="text-green-500">&#x2022;</span>
            <span className="text-green-500 text-sm">Connected</span>
          </div>
        </div>
      ) : (
        <div className="flex items-center text-sm text-red-500 space-x-2">
          <span>&#x2022;</span>
          <span>Disconnected</span>
        </div>
      )}
      <ModalExtension
        isOpen={isModalOpen}
        onClose={closeModal}
        accounts={accounts}
        selectedAccount={selectedAccount?.address}
        onAccountSelect={handleAccountSelect}
        onDisconnect={handleDisconnect}
        accountInfo={accountInfo}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ConnectWalletButton;
