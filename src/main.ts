import { bootstrapApplication } from '@angular/platform-browser';
import { BudgetPlannerComponent } from './app/budget-planner.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD_1pahJ6bX952s9ojV9ItcRg8UZjt4Vwg",
  authDomain: "budget-planner-d00c7.firebaseapp.com",
  projectId: "budget-planner-d00c7",
  storageBucket: "budget-planner-d00c7.firebasestorage.app",
  messagingSenderId: "726642884394",
  appId: "1:726642884394:web:1afd37fa19db1b368b2853",
  measurementId: "G-WP1FR7XQ1Y"
};

bootstrapApplication(BudgetPlannerComponent, {
  providers: [
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore())
  ]
})
  .catch(err => console.error(err));
