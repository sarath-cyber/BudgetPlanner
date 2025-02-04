import { bootstrapApplication } from '@angular/platform-browser';
import { config } from './app/app.config.server';
import { BudgetPlannerComponent } from './app/budget-planner.component';

const bootstrap = () => bootstrapApplication(BudgetPlannerComponent, config);

export default bootstrap;
