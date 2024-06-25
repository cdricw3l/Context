import React from 'react';
import { createPortal } from 'react-dom';
import Identicon from '@polkadot/react-identicon';
import { PolkadotAccount } from "./components/ConnectWalletButton';
import Loading from './components/Loading';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: PolkadotAccount[];
  selectedAccount?: string;
  onAccountSelect: (account: PolkadotAccount) => void;
  onDisconnect: () => void;
  accountInfo: Record<string, any>;
  isLoading: boolean;
}

const truncateAddress = (address: string, startLength = 4, endLength = 4) => {
  if (address.length <= startLength + endLength) {
    return address;
  }
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
};

const ModalExtension: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  accounts,
  selectedAccount,
  onAccountSelect,
  onDisconnect,
  accountInfo,
  isLoading,
}) => {
  if (!isOpen) return null;
  

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg overflow-hidden shadow-2xl transform transition-all sm:max-w-lg sm:w-full">
        <div className="flex justify-end p-2">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>
        <div className="px-6 py-4">
          <h2 className="text-2xl font-bold mb-4 text-center">Select Account</h2>
          {isLoading ? (
            <Loading />
          ) : (
            <ul className="space-y-2">
              {accounts.map((account) => (
                <li key={account.address} className="flex items-center justify-between p-2 bg-gray-100 rounded-lg shadow hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3">
                    <Identicon value={account.address} size={40} theme="polkadot" />
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">{account.meta.name || 'Unnamed Account'}</span>
                      <span className="text-xs text-gray-600">{truncateAddress(account.address)}</span>
                      <span className="text-xs text-gray-600">{"Balance: " + ((accountInfo[account.address]?.balance/10**10) ?? 0)+ " FLMG"}</span>
                    </div>
                  </div>
                  {selectedAccount === account.address ? (
                    <span className="ml-2 text-green-500">✔</span>
                  ) : (
                    <button
                      className="ml-4 px-4 py-2 text-sm bg-blue-500 bg-gradient-to-t from-pink-500  to-transparent text-white rounded-lg transition hover:bg-blue-400"
                      onClick={() => onAccountSelect(account)}
                    >
                      Select
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 flex justify-center">
            <button
              className="px-4 py-2 text-sm bg-red-500 bg-gradient-to-t from-pink-500  to-transparent text-white rounded-lg transition hover:bg-red-400"
              onClick={onDisconnect}
            >
              Disconnect
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ModalExtension;
