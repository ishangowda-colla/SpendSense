
import React, { useState, useEffect } from 'react';
import { Transaction, TransactionType, ExpenseCategories, ExpenseCategory, IncomeCategories, IncomeCategory } from '../types';
import { XMarkIcon, SparklesIcon, PaperAirplaneIcon, ArrowPathIcon } from './Icons';
import { getTransactionFromAI, AITransactionResponse } from '../services/geminiService';

interface AddTransactionModalProps {
  onClose: () => void;
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ onClose, onAddTransaction }) => {
  const [type, setType] = useState<TransactionType>(TransactionType.Expense);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<ExpenseCategory | IncomeCategory | ''>('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    setCategory(''); // Reset category when type changes
  }, [type]);

  const handleAiSubmit = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    setAiError(null);
    try {
      const result = await getTransactionFromAI(aiPrompt);
      if (result) {
        fillFormFromAI(result);
        setAiPrompt(''); // Clear prompt on success
      } else {
        setAiError("Could not extract transaction details. Please be more specific or enter manually.");
      }
    } catch (error) {
      setAiError("An error occurred while contacting the AI. Please try again.");
      console.error(error);
    } finally {
      setIsAiLoading(false);
    }
  };

  const fillFormFromAI = (aiResponse: AITransactionResponse) => {
    setType(TransactionType.Expense); // AI currently only handles expenses
    setDescription(aiResponse.description);
    setAmount(aiResponse.amount.toString());
    setCategory(aiResponse.category);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (!isNaN(numericAmount) && numericAmount > 0 && category) {
      onAddTransaction({
        description,
        amount: numericAmount,
        type,
        category,
        date,
      });
    }
  };

  const isFormValid = amount && parseFloat(amount) > 0 && category;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-primary rounded-xl shadow-2xl w-full max-w-md relative animate-fade-in-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-text-secondary hover:text-text-primary">
          <XMarkIcon className="h-6 w-6" />
        </button>
        <div className="p-8">
          <h2 className="text-2xl font-bold text-center mb-6">Add Transaction</h2>
          
          {/* AI Input Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
               <SparklesIcon className="w-5 h-5 text-accent" />
               <label htmlFor="ai-prompt" className="text-sm font-medium text-text-secondary">
                Describe your transaction with AI
              </label>
            </div>
            <div className="relative">
              <input
                id="ai-prompt"
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAiSubmit() }}
                className="w-full p-3 pr-12 bg-secondary rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="e.g., 'Coffee with friends for ₹250'"
                disabled={isAiLoading}
              />
              <button 
                onClick={handleAiSubmit} 
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-accent disabled:text-text-secondary"
                disabled={isAiLoading || !aiPrompt.trim()}
              >
                {isAiLoading ? <ArrowPathIcon className="h-5 w-5 animate-spin"/> : <PaperAirplaneIcon className="h-5 w-5" />}
              </button>
            </div>
            {aiError && <p className="text-red-500 text-xs mt-1">{aiError}</p>}
          </div>

          <div className="flex items-center justify-center my-4">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="flex-shrink mx-4 text-text-secondary text-sm">Or Enter Manually</span>
            <div className="flex-grow border-t border-gray-600"></div>
          </div>
          
          {/* Manual Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary">Transaction Type</label>
              <div className="mt-1 grid grid-cols-2 gap-2 rounded-lg bg-secondary p-1">
                <button type="button" onClick={() => setType(TransactionType.Expense)} className={`px-4 py-2 text-sm font-semibold rounded-md ${type === TransactionType.Expense ? 'bg-accent text-white' : 'hover:bg-gray-700/50'}`}>Expense</button>
                <button type="button" onClick={() => setType(TransactionType.Income)} className={`px-4 py-2 text-sm font-semibold rounded-md ${type === TransactionType.Income ? 'bg-accent text-white' : 'hover:bg-gray-700/50'}`}>Income</button>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-text-secondary">Description (Optional)</label>
              <input type="text" id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 w-full p-2 bg-secondary rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-text-secondary">Amount</label>
                <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1 w-full p-2 bg-secondary rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-accent" required min="0.01" step="0.01" />
              </div>
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-text-secondary">Date</label>
                <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 w-full p-2 bg-secondary rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-accent" required />
              </div>
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-text-secondary">Category</label>
              <select id="category" value={category} onChange={(e) => setCategory(e.target.value as ExpenseCategory | IncomeCategory)} className="mt-1 w-full p-2 bg-secondary rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-accent" required>
                <option value="" disabled>Select a Category...</option>
                {type === TransactionType.Income ? (
                  IncomeCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)
                ) : (
                  ExpenseCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)
                )}
              </select>
            </div>


            <button type="submit" disabled={!isFormValid} className="w-full bg-accent hover:bg-accent-hover text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed">
              Add Transaction
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTransactionModal;