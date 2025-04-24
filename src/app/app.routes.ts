import { Routes } from '@angular/router';
import { CourseListComponent } from './components/course-list/course-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'courses', pathMatch: 'full' },
  { path: 'courses', component: CourseListComponent },
  { path: '**', redirectTo: 'courses' }, // Catch-all route for any undefined routes
];
