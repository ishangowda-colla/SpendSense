import React from 'react';

interface SummaryProps {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

const SummaryCard: React.FC<{ title: string; amount: number; colorClass: string }> = ({ title, amount, colorClass }) => (
  <div className="bg-secondary p-6 rounded-lg shadow-inner flex-1 text-center">
    <h3 className="text-lg font-medium text-text-secondary">{title}</h3>
    <p className={`text-3xl font-bold ${colorClass}`}>{formatCurrency(amount)}</p>
  </div>
);

const Summary: React.FC<SummaryProps> = ({ totalIncome, totalExpenses, balance }) => {
  return (
    <div className="bg-primary p-6 rounded-lg shadow">
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        <SummaryCard title="Total Income" amount={totalIncome} colorClass="text-income" />
        <SummaryCard title="Total Expenses" amount={totalExpenses} colorClass="text-expense" />
        <SummaryCard title="Current Balance" amount={balance} colorClass={balance >= 0 ? 'text-text-primary' : 'text-expense'} />
      </div>
    </div>
  );
};

export default Summary;