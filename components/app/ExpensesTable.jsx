'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, DollarSign, AlertCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function ExpensesTable({ onTotalExpenseChange }) {
  const [expenses, setExpenses] = useState([
    { id: 1, description: '', category: '', amount: '', notes: '' },
    { id: 2, description: '', category: '', amount: '', notes: '' },
  ]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [emptyRows, setEmptyRows] = useState([]);

  const categories = [
    'Rent/Mortgage', 'Utilities', 'Groceries', 'Transportation', 
    'Insurance', 'Entertainment', 'Health', 'Subscriptions', 'Other'
  ];

  // Category colors for visual differentiation
  const categoryColors = {
    'Rent/Mortgage': 'bg-blue-100 text-blue-800',
    'Utilities': 'bg-amber-100 text-amber-800',
    'Groceries': 'bg-green-100 text-green-800',
    'Transportation': 'bg-purple-100 text-purple-800',
    'Insurance': 'bg-cyan-100 text-cyan-800',
    'Entertainment': 'bg-pink-100 text-pink-800',
    'Health': 'bg-red-100 text-red-800',
    'Subscriptions': 'bg-indigo-100 text-indigo-800',
    'Other': 'bg-gray-100 text-gray-800',
  };

  const addRow = () => {
    const newId = expenses.length ? Math.max(...expenses.map(exp => exp.id)) + 1 : 1;
    setExpenses([...expenses, { id: newId, description: '', category: '', amount: '', notes: '' }]);
  };

  const removeRow = (id) => {
    if (expenses.length > 1) {
      setExpenses(expenses.filter(expense => expense.id !== id));
    }
  };

  const updateExpense = (id, field, value) => {
    setExpenses(expenses.map(expense => 
      expense.id === id ? { ...expense, [field]: value } : expense
    ));
  };

  // Validate and highlight empty rows
  useEffect(() => {
    const empty = expenses.filter(
      expense => !expense.description || !expense.category || !expense.amount
    ).map(expense => expense.id);
    setEmptyRows(empty);
  }, [expenses]);

  // Recalculate total expense whenever expenses change
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
    <Card className="w-full shadow-xl border-0 overflow-hidden">
      <CardHeader className="bg-gradient-to-r text-gray-800 ">
        <CardTitle className="text-2xl font-bold flex items-center justify-between gap-2">
          <span>Monthly Expenses</span>
          <Badge variant="outline" className="text-lg font-mono bg-white/20 backdrop-blur-sm py-1 px-3">
            ${totalExpense.toFixed(2)}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0 bg-slate-50">
        <ScrollArea className="h-48">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-100 hover:bg-slate-100">
                <TableHead className="font-semibold text-slate-700">Description</TableHead>
                <TableHead className="font-semibold text-slate-700">Category</TableHead>
                <TableHead className="font-semibold text-slate-700">Amount</TableHead>
                <TableHead className="font-semibold text-slate-700">Notes</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow 
                  key={expense.id}
                  className={`${emptyRows.includes(expense.id) ? 'bg-red-50/50' : ''} transition-colors`}
                >
                  <TableCell className="py-2">
                    <Input
                      placeholder="What's this expense for?"
                      value={expense.description}
                      onChange={(e) => updateExpense(expense.id, 'description', e.target.value)}
                      className={`${!expense.description && 'border-red-200'} transition-colors`}
                    />
                  </TableCell>
                  <TableCell className="py-2">
                    <Select
                      value={expense.category}
                      onValueChange={(value) => updateExpense(expense.id, 'category', value)}
                    >
                      <SelectTrigger className={`${!expense.category && 'border-red-200'} transition-colors`}>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${categoryColors[category].split(' ')[0].replace('bg-', 'bg-')}`}></span>
                              {category}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="py-2">
                    <div className="relative">
                      <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={expense.amount}
                        onChange={(e) => updateExpense(expense.id, 'amount', e.target.value)}
                        className={`pl-8 ${!expense.amount && 'border-red-200'} transition-colors`}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="py-2">
                    <Input
                      placeholder="Optional notes"
                      value={expense.notes}
                      onChange={(e) => updateExpense(expense.id, 'notes', e.target.value)}
                    />
                  </TableCell>
                  <TableCell className="p-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeRow(expense.id)}
                      className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full"
                      disabled={expenses.length <= 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
      
      <Separator />
      
      <CardFooter className="flex justify-between p-4 bg-slate-50">
        <div className="flex items-center text-sm text-slate-600">
          {emptyRows.length > 0 && (
            <div className="flex items-center gap-1">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <span>Please complete all required fields</span>
            </div>
          )}
        </div>
        <Button 
          onClick={addRow} 
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center gap-1 px-4"
        >
          <Plus className="w-4 h-4" /> Add Expense
        </Button>
      </CardFooter>
    </Card>
  );
}