
import React from 'react';
import { Transaction, TransactionType } from '../types';
import { TrashIcon } from './Icons';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  containerClassName?: string;
}

const TransactionItem: React.FC<{ transaction: Transaction, onDelete: (id: string) => void }> = ({ transaction, onDelete }) => {
  const isIncome = transaction.type === TransactionType.Income;
  const amountColor = isIncome ? 'text-income' : 'text-expense';
  const sign = isIncome ? '+' : '-';

  return (
    <li className="flex items-center justify-between py-3 px-4 bg-secondary hover:bg-gray-700/50 rounded-lg transition-colors">
      <div className="flex items-center space-x-4">
        <div className={`w-2 h-10 rounded-full ${isIncome ? 'bg-income' : 'bg-expense'}`}></div>
        <div>
          <p className="font-semibold text-text-primary">{transaction.description || transaction.category}</p>
          <p className="text-sm text-text-secondary">{transaction.category} &middot; {new Date(transaction.date).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <p className={`font-bold text-lg ${amountColor}`}>{sign}₹{transaction.amount.toFixed(2)}</p>
        <button
          onClick={() => onDelete(transaction.id)}
          className="text-text-secondary hover:text-expense transition-colors p-1 rounded-full"
          aria-label="Delete transaction"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
    </li>
  );
};

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete, containerClassName = '' }) => {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-10 text-text-secondary">
        <p>No transactions yet.</p>
        <p>Click the '+' button to add your first one!</p>
      </div>
    );
  }

  return (
    <ul className={`space-y-3 ${containerClassName}`}>
      {transactions.map(t => (
        <TransactionItem key={t.id} transaction={t} onDelete={onDelete} />
      ))}
    </ul>
  );
};

export default TransactionList;