import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';

interface Expense {
  date: string;
  type: string;
  amount: number;
  comments?: string; // New optional comments field
}

@Component({
  selector: 'app-budget-planner',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './budget-planner.component.html',
  styleUrls: ['./budget-planner.component.css'],
})
export class BudgetPlannerComponent {
  expense: Expense = { date: '', type: '', amount: 0, comments: '' };
  searchDate: string = '';
  filteredExpenses: Expense[] = [];
  expenses: Expense[] = [];
  totalExpense: number = 0;
  currentMonth: string = '';
  showPopup = false;
  confirmationText = '';
  fromDate: string = '';
  toDate: string = '';

  expenseTypes = [
    { name: 'Food', icon: 'assets/food.png' },
    { name: 'Bills', icon: 'assets/bills.png' },
    { name: 'Groceries', icon: 'assets/groceries.png' },
    { name: 'Entertainment', icon: 'assets/entertainment.png' },
    { name: 'Transportation' },
    { name: 'Rents & EMI' },
    { name: 'Shopping' },
    { name: 'Miscellaneous' },
    { name: 'Fuel' }
  ];

  constructor() {
    this.loadExpenses();
  }

  addExpense() {
    if (!this.expense.date || !this.expense.type || this.expense.amount <= 0) return;

    const selectedMonth = new Date(this.expense.date).toLocaleString('default', { month: 'long', year: 'numeric' });

    if (this.currentMonth && this.currentMonth !== selectedMonth) {
      this.totalExpense = 0; // Reset total if month changes
      this.currentMonth = selectedMonth;
    }

    this.currentMonth = selectedMonth;

    this.expenses.push({ ...this.expense });

    this.totalExpense += this.expense.amount;
    this.saveExpenses();

    // Reset only type, amount, and comments, keeping the date
    this.expense.type = '';
    this.expense.amount = 0;
    this.expense.comments = '';
  }

  saveExpenses() {
    localStorage.setItem('expenses', JSON.stringify(this.expenses));
    localStorage.setItem('currentMonth', this.currentMonth);
    localStorage.setItem('totalExpense', this.totalExpense.toString());
  }

  loadExpenses() {
    if (typeof window !== 'undefined' && localStorage) {
      const storedExpenses = localStorage.getItem('expenses');
      this.expenses = storedExpenses ? JSON.parse(storedExpenses) : [];

      this.currentMonth = localStorage.getItem('currentMonth') || '';
      this.totalExpense = parseFloat(localStorage.getItem('totalExpense') || '0');
    } else {
      this.expenses = [];
      this.totalExpense = 0;
    }
  }

  fetchHistory() {
    if (!this.fromDate || !this.toDate) {
      alert("Please select both From and To dates.");
      return;
    }

    const from = new Date(this.fromDate).getTime();
    const to = new Date(this.toDate).getTime();

    this.filteredExpenses = this.expenses.filter(exp => {
      const expDate = new Date(exp.date).getTime();
      return expDate >= from && expDate <= to;
    });

    if (this.filteredExpenses.length === 0) {
      alert("No expenses found in this date range.");
    }
  }

  downloadExcel(): void {
    const worksheet = XLSX.utils.json_to_sheet(this.expenses);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Expenses');
    XLSX.writeFile(workbook, 'Budget-Planner.xlsx');
  }

  showClearConfirmation() {
    this.showPopup = true;
  }

  confirmClearData() {
    if (this.confirmationText === 'CONFIRM DELETE') {
      localStorage.clear();
      alert('Data cleared successfully!');
      this.showPopup = false;
      this.confirmationText = '';
    } else {
      alert('Incorrect confirmation text. Please type "CONFIRM DELETE".');
    }
  }

  cancelClear() {
    this.showPopup = false;
    this.confirmationText = '';
  }
}
