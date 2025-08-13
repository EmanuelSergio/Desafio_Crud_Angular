import { Routes } from '@angular/router';
import { TaskListComponent } from './features/tasks/task-list.component';
import { TaskFormComponent } from './features/tasks/task-form.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'tasks' },
  { path: 'tasks', component: TaskListComponent },
  { path: 'tasks/new', component: TaskFormComponent },
  { path: 'tasks/:id/edit', component: TaskFormComponent },
  { path: '**', redirectTo: 'tasks' }
];
