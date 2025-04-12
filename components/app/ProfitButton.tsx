'use client';

import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { Button } from '../ui/button';

export default function ProfitButton({ effYield }: { effYield: number }) {
  const [profits, setProfits] = useState<number[]>([]);
  const [monthlyData, setMonthlyData] = useState<
    { month: string; profit: number; cumulativePositive?: number }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function getProfits() {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/profit-update`, {
        cache: 'no-store',
      });

      if (!res.ok) {
        throw new Error('Failed to fetch profits');
      }

      const data = await res.json();
      if (data?.profitArray && Array.isArray(data.profitArray)) {
        const rawProfits = [data.profitArray[1], data.profitArray[2], data.profitArray[3], data.profitArray[4]];
        setProfits(rawProfits);

        // Sample monthly profit data (including cumulativePositive calculation)
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
        let cumulative = 0;
        const monthly = months.map((month, index) => {
          let profit = data.profitArray[index]>0 ? data.profitArray[index] : 0;
          if (profit > 0) {
            cumulative += profit;
          }
          return {
            month,
            profit,
            cumulativePositive: cumulative,
          };
        });

        setMonthlyData(monthly);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error(err);
      setError((err as Error).message || 'An error occurred while fetching profits');
    } finally {
      setLoading(false);
    }
  }

  const totalProfit = profits.reduce((acc, profit) => {
    return profit > 0 ? acc + profit : acc;
  }, 0);
  
  return (
    <div className="mt-10">
      <Button
        onClick={getProfits}
        className="px-4 py-2 bg-neutral-700 font-normal h-7 text-xs text-white rounded-lg hover:bg-neutral-700"
        disabled={loading}
      >
        {loading ? 'Fetching...' : 'Get Profits'}
      </Button>

      {error && <p className="text-red-600 mt-2">{error}</p>}

      {profits.length > 0 && (
        <>
          <div className="grid grid-cols-4 gap-4 mt-5">
            {profits.map((profit, index) => (
              <div key={index} className="p-4 rounded-lg border border-gray-200 bg-white">
                <p className="text-sm text-gray-600 mb-1">Instance {index + 1}</p>
                <p className={`text-lg font-medium ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {profit >= 0 ? '+' : ''}${profit.toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5">
            <p className="text-lg font-medium">Total Profit:</p>
            <p
              className={`text-xl font-bold ${
                totalProfit >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {totalProfit >= 0 ? '+' : ''}${(totalProfit).toFixed(2)}
            </p>
          </div>

          {/* Chart */}
          <div className="mt-10">
            <h3 className="text-lg font-semibold mb-3">Monthly Net Profit</h3>
            <div className="w-full h-64 bg-white rounded-lg shadow-sm p-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="#10B981"
                    strokeWidth={2}
                    name="Monthly Profit"
                  />
                  <Line
                    type="monotone"
                    dataKey="cumulativePositive"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                    name="Cumulative Positive Profit"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
