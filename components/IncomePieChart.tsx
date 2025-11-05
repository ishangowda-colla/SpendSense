import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Transaction } from '../types';

interface IncomePieChartProps {
  data: Transaction[];
}

// Different colors for income
const COLORS = ['#22c55e', '#4ade80', '#86efac', '#bbf7d0', '#6ee7b7'];

const IncomePieChart: React.FC<IncomePieChartProps> = ({ data }) => {
  const chartData = useMemo(() => {
    const categoryTotals = data.reduce((acc, transaction) => {
      const { category, amount } = transaction;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += amount;
      return acc;
    }, {} as { [key: string]: number });

    return Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: '#2a2a2a',
            borderColor: '#3a3a3a',
            color: '#f0f0f0'
          }}
          formatter={(value: number) => `₹${value.toFixed(2)}`}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default IncomePieChart;