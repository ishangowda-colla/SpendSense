import React, { useState } from 'react';
import { XMarkIcon } from './Icons';

interface EditBudgetModalProps {
  currentBudget: number;
  onClose: () => void;
  onSave: (newBudget: number) => void;
}

const EditBudgetModal: React.FC<EditBudgetModalProps> = ({ currentBudget, onClose, onSave }) => {
  const [budget, setBudget] = useState(currentBudget.toString());

  const handleSave = () => {
    const newBudget = parseFloat(budget);
    if (!isNaN(newBudget) && newBudget >= 0) {
      onSave(newBudget);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-primary rounded-xl shadow-2xl w-full max-w-sm relative animate-fade-in-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-text-secondary hover:text-text-primary">
          <XMarkIcon className="h-6 w-6" />
        </button>
        <div className="p-8">
          <h2 className="text-2xl font-bold text-center mb-4">Set Monthly Budget</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-text-secondary">
                Budget Amount
              </label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-text-secondary sm:text-sm">₹</span>
                </div>
                <input
                  type="number"
                  id="budget"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  min="0"
                  step="100"
                  className="w-full p-2 pl-7 bg-secondary rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="e.g., 50000"
                />
              </div>
            </div>
            <button
              onClick={handleSave}
              className="w-full bg-accent hover:bg-accent-hover text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              Save Budget
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBudgetModal;