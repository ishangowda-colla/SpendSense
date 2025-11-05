import React from 'react';
import { PencilIcon } from './Icons';

interface BudgetTrackerProps {
  budget: number;
  spent: number;
  onEdit: () => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

const BudgetTracker: React.FC<BudgetTrackerProps> = ({ budget, spent, onEdit }) => {
  const remaining = budget - spent;
  const progress = budget > 0 ? (spent / budget) * 100 : 0;
  const progressBarColor = progress > 100 ? 'bg-expense' : 'bg-accent';
  const remainingColor = remaining >= 0 ? 'text-text-primary' : 'text-expense';

  return (
    <div className="bg-primary p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-text-primary">Monthly Budget</h2>
        <button onClick={onEdit} className="p-1 text-text-secondary hover:text-accent transition-colors">
          <PencilIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-text-secondary text-sm mb-1">
          <span>Spent</span>
          <span>Remaining</span>
        </div>
        <div className="flex justify-between font-bold text-lg">
          <span className="text-expense">{formatCurrency(spent)}</span>
          <span className={remainingColor}>{formatCurrency(remaining)}</span>
        </div>
      </div>
      
      <div className="w-full bg-secondary rounded-full h-2.5 mb-2">
        <div 
          className={`${progressBarColor} h-2.5 rounded-full`} 
          style={{ width: `${Math.min(progress, 100)}%` }}
        ></div>
      </div>
      
      <div className="text-right text-text-secondary text-sm">
        Budget: <span className="font-semibold text-text-primary">{formatCurrency(budget)}</span>
      </div>
    </div>
  );
};

export default BudgetTracker;