import React from 'react';
import { Transaction } from '../types';
import Summary from './Summary';
import ExpensePieChart from './ExpensePieChart';
import TransactionList from './TransactionList';
import BudgetTracker from './BudgetTracker';

interface DashboardProps {
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlyBalance: number;
  monthlyExpenseTransactions: Transaction[];
  allTransactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
  budget: number;
  onEditBudget: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  monthlyIncome,
  monthlyExpenses,
  monthlyBalance,
  monthlyExpenseTransactions,
  allTransactions,
  onDeleteTransaction,
  budget,
  onEditBudget,
}) => {
  const recentTransactions = allTransactions.slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      <Summary totalIncome={monthlyIncome} totalExpenses={monthlyExpenses} balance={monthlyBalance} />
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <BudgetTracker budget={budget} spent={monthlyExpenses} onEdit={onEditBudget} />
          <div className="bg-primary rounded-lg shadow p-4 sm:p-6">
            <h2 className="text-xl font-semibold mb-4 text-text-primary">Monthly Expense Breakdown</h2>
            {monthlyExpenseTransactions.length > 0 ? (
              <ExpensePieChart data={monthlyExpenseTransactions} />
            ) : (
              <div className="flex items-center justify-center h-[244px] text-text-secondary">
                No expense data for this month.
              </div>
            )}
          </div>
        </div>
        <div className="lg:col-span-3 bg-primary rounded-lg shadow p-4 sm:p-6">
           <h2 className="text-xl font-semibold mb-4 text-text-primary">Recent Transactions</h2>
           <TransactionList 
              transactions={recentTransactions} 
              onDelete={onDeleteTransaction}
              containerClassName="max-h-[500px] overflow-y-auto pr-2"
           />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
