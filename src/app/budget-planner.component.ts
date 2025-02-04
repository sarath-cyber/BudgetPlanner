import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';

interface Expense {
  date: string;
  type: string;
  amount: number;
}

@Component({
  selector: 'app-budget-planner',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './budget-planner.component.html',
  styleUrls: ['./budget-planner.component.css'],
})
export class BudgetPlannerComponent {
  expense: Expense = { date: '', type: '', amount: 0 };
  searchDate: string = '';
  filteredExpenses: Expense[] = [];
  expenses: Expense[] = [];
  totalExpense: number = 0;
  currentMonth: string = '';
  showPopup = false;
  confirmationText = '';

  expenseTypes = [
    { name: 'Food', icon: 'assets/food.png' },
    { name: 'Bills', icon: 'assets/bills.png' },
    { name: 'Groceries', icon: 'assets/groceries.png' },
    { name: 'Entertainment', icon: 'assets/entertainment.png' },
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
    this.expense = { date: '', type: '', amount: 0 };
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

  fetchHistory(): void {
    if (!this.searchDate) {
      alert('Please select a date');
      return;
    }

    this.filteredExpenses = this.expenses.filter(exp => exp.date === this.searchDate);

    if (this.filteredExpenses.length === 0) {
      alert('No records found for the selected date.');
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
