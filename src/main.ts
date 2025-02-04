import { bootstrapApplication } from '@angular/platform-browser';
import { BudgetPlannerComponent } from './app/budget-planner.component';

bootstrapApplication(BudgetPlannerComponent)
  .catch(err => console.error(err));
