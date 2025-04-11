'use client';

import React, { useState, useEffect } from 'react';
import ExpensesTable from './ExpensesTable';

export default function ExpensesTableWrapper({
  index,
  faceBalance,
  estimatedSpend,
  faceInterest,
  storeInterest,
  txnCost,
}) {
  console.log(faceBalance, estimatedSpend, faceInterest, storeInterest, txnCost);
  const [totalExpense, setTotalExpense] = useState(0);
  const [modelResponse, setModelResponse] = useState(null);
  
  // Track previous profit to detect changes
  const [previousProfit, setPreviousProfit] = useState(null);
  
  const callModelAPI = async () => {
    // Guard clauses for undefined values
    if (
      faceBalance === undefined ||
      estimatedSpend === undefined ||
      totalExpense === undefined ||
      faceInterest === undefined ||
      storeInterest === undefined ||
      txnCost === undefined
    ) return;
      
    // Convert percentage strings to numbers
    const numericFaceInterest = parseFloat(faceInterest.replace('%', ''));
    const numericStoreInterest = parseFloat(storeInterest.replace('%', ''));
      
    // Calculate values ensuring all are numbers
    const movableBalance = Number(faceBalance) - Number(estimatedSpend) - Number(totalExpense);
    const apyDifference = numericStoreInterest - numericFaceInterest;
      
    // Build the payload with proper numeric values
    const payload = {
      movableBalance,
      apyDifference,
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
      
      const data = await res.json();
      setModelResponse(data);
      console.log('Model response:', data);
      
      // Determine profit value (could be profit or loss)
      const currentProfit = data.profit !== undefined ? data.profit : (data.loss !== undefined ? -Math.abs(data.loss) : 0);
      
      // If profit has changed, update the profit array on server
      if (previousProfit === null || currentProfit !== previousProfit) {
        await updateProfitOnServer(currentProfit);
        setPreviousProfit(currentProfit);
      }
    } catch (error) {
      console.error('API Error:', error);
    }
  };
  
  // Function to update profit array on server
  const updateProfitOnServer = async (profit) => {
    try {
      const response = await fetch('/api/profit-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          index,
          profit
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
      
      <button
        onClick={callModelAPI}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Call Model API
      </button>
      
      {modelResponse && (
        <div className="mt-4 p-4 rounded-xl border border-gray-200 shadow-sm bg-gray-50">
          <h3 className="text-base font-semibold text-gray-800 mb-2">Model Prediction</h3>
          <div className="flex flex-col space-y-1 text-sm">
            {modelResponse.profit !== undefined && (
              <div className="flex justify-between">
                <span className="text-gray-600">Profit:</span>
                <span className="text-green-600 font-medium">
                  ${modelResponse.profit.toFixed(2)}
                </span>
              </div>
            )}
            {modelResponse.loss !== undefined && (
              <div className="flex justify-between">
                <span className="text-gray-600">Loss:</span>
                <span className="text-red-600 font-medium">
                  ${Math.abs(modelResponse.loss).toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Execute Transaction:</span>
              <span className={`font-medium ${modelResponse.execute ? 'text-green-700' : 'text-red-600'}`}>
                {modelResponse.execute ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}