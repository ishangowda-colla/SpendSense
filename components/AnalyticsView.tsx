import React from 'react';
import { Transaction } from '../types';
import IncomeExpenseBarChart from './IncomeExpenseBarChart';
import ExpensePieChart from './ExpensePieChart';
import IncomePieChart from './IncomePieChart';

interface AnalyticsViewProps {
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlyExpenseTransactions: Transaction[];
  monthlyIncomeTransactions: Transaction[];
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ 
  monthlyIncome, 
  monthlyExpenses, 
  monthlyExpenseTransactions,
  monthlyIncomeTransactions
}) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-primary p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-text-primary">Monthly Financial Overview</h2>
        <IncomeExpenseBarChart totalIncome={monthlyIncome} totalExpenses={monthlyExpenses} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-primary p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-text-primary">Expense Breakdown</h2>
          {monthlyExpenseTransactions.length > 0 ? (
            <ExpensePieChart data={monthlyExpenseTransactions} />
          ) : (
            <div className="flex items-center justify-center h-[300px] text-text-secondary">
              No expense data for this month.
            </div>
          )}
        </div>
        <div className="bg-primary p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-text-primary">Income Sources</h2>
          {monthlyIncomeTransactions.length > 0 ? (
            <IncomePieChart data={monthlyIncomeTransactions} />
          ) : (
            <div className="flex items-center justify-center h-[300px] text-text-secondary">
              No income data for this month.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;