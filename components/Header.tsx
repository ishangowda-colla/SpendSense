
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-primary shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <h1 className="text-3xl font-bold text-text-primary tracking-tight">
          Spend<span className="text-accent">Sense</span>
        </h1>
        <p className="text-text-secondary">Your AI-Powered Financial Companion</p>
      </div>
    </header>
  );
};

export default Header;
