'use client';

import React, { useState, useEffect } from 'react';
import ExpensesTable from './ExpensesTable';
import { instrumentSerif } from '@/lib/fonts';

interface ExpensesTableWrapperProps {
  index: number;
  faceBalance: number;
  estimatedSpend: number;
  faceInterest: string;
  storeInterest: string;
  txnCost: number;
}

interface ModelResponse {
  profit?: number;
  loss?: number;
  execute: boolean;
}

export default function ExpensesTableWrapper({
  index,
  faceBalance,
  estimatedSpend,
  faceInterest,
  storeInterest,
  txnCost,
}: ExpensesTableWrapperProps) {
  const [totalExpense, setTotalExpense] = useState<number>(0);
  const [modelResponse, setModelResponse] = useState<ModelResponse | null>(null);
  const [previousProfit, setPreviousProfit] = useState<number | null>(null);
  const [movableBalance, setMovableBalance] = useState<number | null>(null);
  const [apyDifference, setApyDifference] = useState<number | null>(null);

  const callModelAPI = async () => {
    if (
      faceBalance === undefined ||
      estimatedSpend === undefined ||
      totalExpense === undefined ||
      faceInterest === undefined ||
      storeInterest === undefined ||
      txnCost === undefined
    )
      return;

    const numericFaceInterest = parseFloat(faceInterest.replace('%', ''));
    const numericStoreInterest = parseFloat(storeInterest.replace('%', ''));

    const movable = Number(faceBalance) - Number(estimatedSpend) - Number(totalExpense);
    const apyDiff = numericStoreInterest - numericFaceInterest;

    setMovableBalance(movable);
    setApyDifference(apyDiff);

    const payload = {
      movableBalance: movable,
      apyDifference: apyDiff,
      txncost: Number(txnCost),
    };

    try {
      const res = await fetch('https://model-k35o.onrender.com/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to calculate with model API');

      const data: ModelResponse = await res.json();
      setModelResponse(data);
      console.log('Model response:', data);

      const currentProfit =
        data.profit !== undefined
          ? data.profit
          : data.loss !== undefined
          ? -Math.abs(data.loss)
          : 0;

      if (previousProfit === null || currentProfit !== previousProfit) {
        await updateProfitOnServer(currentProfit);
        setPreviousProfit(currentProfit);
      }
    } catch (error) {
      console.error('API Error:', error);
    }
  };

  const updateProfitOnServer = async (profit: number) => {
    try {
      const response = await fetch('/api/profit-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          index,
          profit,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profit on server');
      }

      const result = await response.json();
      console.log('Profit updated on server:', result);
    } catch (error) {
      console.error('Error updating profit on server:', error);
    }
  };

  return (
    <div>
      <ExpensesTable onTotalExpenseChange={setTotalExpense} />
      <p className="mt-2 text-lg font-medium">
        Total Expense: ${totalExpense.toFixed(2)}
      </p>

      {movableBalance !== null && (
        <p className="mt-2 text-sm text-neutral-700">
          Movable Balance: ${movableBalance.toFixed(2)}
        </p>
      )}

      {apyDifference !== null && (
        <p className="text-sm text-neutral-700">
          APY Difference: {apyDifference.toFixed(2)}%
        </p>
      )}

      <button
        onClick={callModelAPI}
        className="mt-4 px-4 py-2 bg-neutral-500 text-white rounded hover:bg-neutral-600"
      >
        Call Model
      </button>

      {modelResponse && (
        <div className="mt-4 p-4 rounded-xl border border-neutral-200 bg-neutral-50">
          <h3 className={`text-base font-semibold text-neutral-800 mb-2 ${instrumentSerif.className}`}>
            Model Prediction
          </h3>
          <div className="flex flex-col space-y-1 text-sm">
            {modelResponse.profit !== undefined && (
              <div className="flex justify-between">
                <span className="text-neutral-600">Profit:</span>
                <span className="text-green-600 font-medium">
                  ${modelResponse.profit.toFixed(2)}
                </span>
              </div>
            )}
            {modelResponse.loss !== undefined && (
              <div className="flex justify-between">
                <span className="text-neutral-600">Loss:</span>
                <span className="text-red-600 font-medium">
                  ${Math.abs(modelResponse.loss).toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-neutral-600">Execute Transaction:</span>
              <span
                className={`font-medium ${
                  modelResponse.execute ? 'text-green-700' : 'text-red-600'
                }`}
              >
                {modelResponse.execute ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
