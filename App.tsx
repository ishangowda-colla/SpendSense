import React, { useState, useMemo } from 'react';
// Note: You may need to install uuid: npm install uuid @types/uuid
import { v4 as uuidv4 } from 'uuid';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Navigation from './components/Navigation';
import TransactionsView from './components/TransactionsView';
import AnalyticsView from './components/AnalyticsView';
import AddTransactionModal from './components/AddTransactionModal';
import EditBudgetModal from './components/EditBudgetModal';
import { PlusIcon } from './components/Icons';
import { Transaction, TransactionType } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';

type View = 'dashboard' | 'transactions' | 'analytics';

function App() {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', []);
  const [budget, setBudget] = useLocalStorage<number>('budget', 50000);
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditBudgetModalOpen, setIsEditBudgetModalOpen] = useState(false);

  const sortedTransactions = useMemo(() => {
    return [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions]);

  const monthlyTransactions = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    return sortedTransactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
    });
  }, [sortedTransactions]);

  const { monthlyIncome, monthlyExpenses, monthlyExpenseTransactions, monthlyIncomeTransactions } = useMemo(() => {
    let income = 0;
    let expenses = 0;
    const expenseTransactions: Transaction[] = [];
    const incomeTransactions: Transaction[] = [];

    monthlyTransactions.forEach(t => {
      if (t.type === TransactionType.Income) {
        income += t.amount;
        incomeTransactions.push(t);
      } else {
        expenses += t.amount;
        expenseTransactions.push(t);
      }
    });
    return { 
      monthlyIncome: income, 
      monthlyExpenses: expenses, 
      monthlyExpenseTransactions: expenseTransactions,
      monthlyIncomeTransactions: incomeTransactions,
    };
  }, [monthlyTransactions]);

  const monthlyBalance = monthlyIncome - monthlyExpenses;

  const handleAddTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: uuidv4(),
    };
    setTransactions(prev => [...prev, newTransaction]);
    setIsAddModalOpen(false);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };
  
  const handleSaveBudget = (newBudget: number) => {
    setBudget(newBudget);
    setIsEditBudgetModalOpen(false);
  };

  const renderView = () => {
    switch (activeView) {
      case 'transactions':
        return <TransactionsView transactions={sortedTransactions} onDeleteTransaction={handleDeleteTransaction} />;
      case 'analytics':
        return <AnalyticsView 
                  monthlyIncome={monthlyIncome} 
                  monthlyExpenses={monthlyExpenses} 
                  monthlyExpenseTransactions={monthlyExpenseTransactions}
                  monthlyIncomeTransactions={monthlyIncomeTransactions} 
               />;
      case 'dashboard':
      default:
        return <Dashboard 
          monthlyIncome={monthlyIncome}
          monthlyExpenses={monthlyExpenses}
          monthlyBalance={monthlyBalance}
          monthlyExpenseTransactions={monthlyExpenseTransactions}
          allTransactions={sortedTransactions}
          onDeleteTransaction={handleDeleteTransaction}
          budget={budget}
          onEditBudget={() => setIsEditBudgetModalOpen(true)}
        />;
    }
  };

  return (
    <div className="bg-background text-text-primary min-h-screen font-sans">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Navigation activeView={activeView} setActiveView={setActiveView} />
        {renderView()}
      </main>

      <button
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-8 right-8 bg-accent hover:bg-accent-hover text-white rounded-full p-4 shadow-lg transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent focus:ring-offset-background"
        aria-label="Add new transaction"
      >
        <PlusIcon className="h-8 w-8" />
      </button>

      {isAddModalOpen && (
        <AddTransactionModal
          onClose={() => setIsAddModalOpen(false)}
          onAddTransaction={handleAddTransaction}
        />
      )}
      
      {isEditBudgetModalOpen && (
        <EditBudgetModal
          currentBudget={budget}
          onClose={() => setIsEditBudgetModalOpen(false)}
          onSave={handleSaveBudget}
        />
      )}
    </div>
  );
}

export default App;