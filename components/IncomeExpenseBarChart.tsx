import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface IncomeExpenseBarChartProps {
  totalIncome: number;
  totalExpenses: number;
}

const IncomeExpenseBarChart: React.FC<IncomeExpenseBarChartProps> = ({ totalIncome, totalExpenses }) => {
  const data = [
    { name: 'Financial Flow', income: totalIncome, expenses: totalExpenses },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical" margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <XAxis type="number" stroke="#a0a0a0" tickFormatter={(value) => `₹${value}`} />
        <YAxis type="category" dataKey="name" stroke="#a0a0a0" hide />
        <Tooltip
          contentStyle={{
            backgroundColor: '#2a2a2a',
            borderColor: '#3a3a3a',
            color: '#f0f0f0'
          }}
          formatter={(value: number) => `₹${value.toFixed(2)}`}
          cursor={{ fill: 'rgba(100,100,100,0.2)' }}
        />
        <Legend wrapperStyle={{ color: '#f0f0f0' }}/>
        <Bar dataKey="income" fill="#22c55e" name="Income" radius={[0, 8, 8, 0]} />
        <Bar dataKey="expenses" fill="#ef4444" name="Expenses" radius={[0, 8, 8, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default IncomeExpenseBarChart;