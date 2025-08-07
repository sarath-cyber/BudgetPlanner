import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, query, where, deleteDoc, doc } from '@angular/fire/firestore';
import { Expense } from './expense.model';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private expensesCol;

  constructor(private firestore: Firestore) {
    this.expensesCol = collection(this.firestore, 'expenses');
  }

  async addExpense(expense: Expense): Promise<void> {
    await addDoc(this.expensesCol, expense);
  }

  async getExpenses(): Promise<Expense[]> {
    const snapshot = await getDocs(this.expensesCol);
    return snapshot.docs.map(d => {
      const data = d.data() as Omit<Expense, 'id'>;
      return { ...data, id: d.id };
    });
  }

  async getExpensesByDateRange(fromDate: string, toDate: string): Promise<Expense[]> {
    const q = query(
      this.expensesCol,
      where('date', '>=', fromDate),
      where('date', '<=', toDate)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => {
      const data = d.data() as Omit<Expense, 'id'>;
      return { ...data, id: d.id };
    });
  }

  async clearAllExpenses(): Promise<void> {
    const snapshot = await getDocs(this.expensesCol);
    const deletePromises = snapshot.docs.map(d =>
      deleteDoc(doc(this.firestore, 'expenses', d.id))
    );
    await Promise.all(deletePromises);
  }
}
