import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

// ✅ Firebase imports
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD_1pahJ6bX952s9ojV9ItcRg8UZjt4Vwg",
  authDomain: "budget-planner-d00c7.firebaseapp.com",
  projectId: "budget-planner-d00c7",
  storageBucket: "budget-planner-d00c7.appspot.com",
  messagingSenderId: "726642884394",
  appId: "1:726642884394:web:1afd37fa19db1b368b2853",
  measurementId: "G-WP1FR7XQ1Y"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),

    // ✅ Add Firebase providers
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore())
  ]
};
