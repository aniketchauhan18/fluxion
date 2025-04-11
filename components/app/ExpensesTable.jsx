'use client'; // Mark as client component

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusIcon, TrashIcon } from 'lucide-react';

export default function ExpensesTable({ onTotalExpenseChange }) {
  const [expenses, setExpenses] = useState([
    { id: 1, description: '', category: '', amount: '', notes: '' },
    { id: 2, description: '', category: '', amount: '', notes: '' },
  ]);
  const [totalExpense, setTotalExpense] = useState(0);

  const categories = [
    'Rent/Mortgage', 'Utilities', 'Groceries', 'Transportation', 
    'Insurance', 'Entertainment', 'Health', 'Subscriptions', 'Other'
  ];

  const addRow = () => {
    const newId = expenses.length ? Math.max(...expenses.map(exp => exp.id)) + 1 : 1;
    setExpenses([...expenses, { id: newId, description: '', category: '', amount: '', notes: '' }]);
  };

  const removeRow = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const updateExpense = (id, field, value) => {
    setExpenses(expenses.map(expense => 
      expense.id === id ? { ...expense, [field]: value } : expense
    ));
  };

  // Recalculate total expense whenever expenses change.
  useEffect(() => {
    const total = expenses.reduce(
      (acc, expense) => acc + (parseFloat(expense.amount) || 0),
      0
    );
    setTotalExpense(total);
    if (onTotalExpenseChange) {
      onTotalExpenseChange(total);
    }
  }, [expenses, onTotalExpenseChange]);

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="bg-blue-50">
        <CardTitle className="text-xl font-bold text-blue-800">Scheduled Expenses for a month</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="w-64">Description</TableHead>
                <TableHead className="w-40">Category</TableHead>
                <TableHead className="w-32">Amount</TableHead>
                <TableHead className="w-64">Notes</TableHead>
                <TableHead className="w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>
                    <Input
                      placeholder="Description"
                      value={expense.description}
                      onChange={(e) => updateExpense(expense.id, 'description', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={expense.category}
                      onValueChange={(value) => updateExpense(expense.id, 'category', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className="mr-1">$</span>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={expense.amount}
                        onChange={(e) => updateExpense(expense.id, 'amount', e.target.value)}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Input
                      placeholder="Notes"
                      value={expense.notes}
                      onChange={(e) => updateExpense(expense.id, 'notes', e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeRow(expense.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="p-4">
          <Button onClick={addRow} className="flex items-center gap-1">
            <PlusIcon className="w-4 h-4" /> Add Expense
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
