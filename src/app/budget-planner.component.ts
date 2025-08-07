import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import { FirestoreService } from './firestore.service';
import { Expense } from './expense.model';

@Component({
  selector: 'app-budget-planner',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './budget-planner.component.html',
  styleUrls: ['./budget-planner.component.css']
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

  constructor(private firestoreService: FirestoreService) {
    this.loadExpenses();
  }

  addExpense() {
    if (!this.expense.date || !this.expense.type || this.expense.amount <= 0) return;

    const selectedMonth = new Date(this.expense.date).toLocaleString('default', { month: 'long', year: 'numeric' });

    if (this.currentMonth && this.currentMonth !== selectedMonth) {
      this.totalExpense = 0;
      this.currentMonth = selectedMonth;
    }

    this.currentMonth = selectedMonth;

    // Save to Firestore
    this.firestoreService.addExpense({ ...this.expense }).then(() => {
      this.expenses.push({ ...this.expense });
      this.totalExpense += this.expense.amount;
      // Reset only type, amount, and comments, keeping the date
      this.expense.type = '';
      this.expense.amount = 0;
      this.expense.comments = '';
    });
  }

  saveExpenses() {
    // No longer needed, handled by Firestore
  }

  loadExpenses() {
    this.firestoreService.getExpenses().then((expenses: Expense[]) => {
      this.expenses = expenses;
      // Optionally, update totalExpense and currentMonth
      this.totalExpense = expenses.reduce((sum: number, exp: Expense) => sum + exp.amount, 0);
      if (expenses.length > 0) {
        const lastExpense: Expense = expenses[expenses.length - 1];
        this.currentMonth = new Date(lastExpense.date).toLocaleString('default', { month: 'long', year: 'numeric' });
      }
    });
  }

  fetchHistory() {
    if (!this.fromDate || !this.toDate) {
      alert("Please select both From and To dates.");
      return;
    }

    this.firestoreService.getExpensesByDateRange(this.fromDate, this.toDate).then((filtered: Expense[]) => {
      this.filteredExpenses = filtered;
      if (this.filteredExpenses.length === 0) {
        alert("No expenses found in this date range.");
      }
    });
  }

  showClearConfirmation() {
    this.showPopup = true;
  }

  confirmClearData() {
    if (this.confirmationText === 'CONFIRM DELETE') {
      this.firestoreService.clearAllExpenses().then(() => {
        alert('Data cleared successfully!');
        this.expenses = [];
        this.totalExpense = 0;
        this.currentMonth = '';
        this.showPopup = false;
        this.confirmationText = '';
      });
    } else {
      alert('Incorrect confirmation text. Please type "CONFIRM DELETE".');
    }
  }

  cancelClear() {
    this.showPopup = false;
    this.confirmationText = '';
  }

  downloadExcel(): void {
    const worksheet = XLSX.utils.json_to_sheet(this.expenses);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Expenses');
    XLSX.writeFile(workbook, 'Budget-Planner.xlsx');
  }
}

