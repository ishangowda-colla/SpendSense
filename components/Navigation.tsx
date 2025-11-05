import React from 'react';

type View = 'dashboard' | 'transactions' | 'analytics';

interface NavigationProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const NavButton: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-accent text-white'
        : 'text-text-secondary hover:bg-secondary hover:text-text-primary'
    }`}
  >
    {label}
  </button>
);

const Navigation: React.FC<NavigationProps> = ({ activeView, setActiveView }) => {
  return (
    <div className="mb-6 bg-primary p-2 rounded-lg shadow flex items-center justify-center space-x-2">
      <NavButton label="Dashboard" isActive={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} />
      <NavButton label="Transactions" isActive={activeView === 'transactions'} onClick={() => setActiveView('transactions')} />
      <NavButton label="Analytics" isActive={activeView === 'analytics'} onClick={() => setActiveView('analytics')} />
    </div>
  );
};

export default Navigation;
