import React from 'react';
import { Transaction } from '../types';
import TransactionList from './TransactionList';

interface TransactionsViewProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
}

const TransactionsView: React.FC<TransactionsViewProps> = ({ transactions, onDeleteTransaction }) => {
  return (
    <div className="bg-primary rounded-lg shadow p-4 sm:p-6 animate-fade-in">
      <h2 className="text-xl font-semibold mb-4 text-text-primary">All Transactions</h2>
      <TransactionList transactions={transactions} onDelete={onDeleteTransaction} />
    </div>
  );
};

export default TransactionsView;
