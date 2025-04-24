import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { CourseDialogComponent } from '../course-dialog/course-dialog.component';
import { SubcourseDialogComponent } from '../subcourse-dialog/subcourse-dialog.component';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CourseService } from '../../services/course.service';
import { Course, Subcourse } from '../../models/course';

@Component({
  selector: 'app-course-list',
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    ToastModule,
    ConfirmDialogModule,
    CardModule,
    PanelModule,
    CourseDialogComponent,
    SubcourseDialogComponent,
  ],
  providers: [MessageService, ConfirmationService],

  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.css',
})
export class CourseListComponent implements OnInit {
  courses: Course[] = [];
  courseDialog = false;
  subcourseDialog = false;
  selectedCourse: Course | null = null;
  selectedSubcourse: Subcourse | null = null;
  selectedCourseId!: number;

  constructor(
    private courseService: CourseService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.courseService.getCourses().subscribe((courses) => {
      this.courses = courses;
    });
  }

  openNewCourseDialog(): void {
    this.selectedCourse = null;
    this.courseDialog = true;
  }

  openEditCourseDialog(course: Course): void {
    this.selectedCourse = { ...course };
    this.courseDialog = true;
  }

  openNewSubcourseDialog(courseId: number): void {
    this.selectedCourseId = courseId;
    this.selectedSubcourse = null;
    this.subcourseDialog = true;
  }

  openEditSubcourseDialog(subcourse: Subcourse): void {
    this.selectedCourseId = subcourse.courseId;
    this.selectedSubcourse = { ...subcourse };
    this.subcourseDialog = true;
  }

  confirmDeleteCourse(course: Course): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${course.name}?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.courseService.deleteCourse(course.id);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Course Deleted',
          life: 3000,
        });
      },
    });
  }

  confirmDeleteSubcourse(subcourse: Subcourse): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${subcourse.name}?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.courseService.deleteSubcourse(subcourse.courseId, subcourse.id);
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Subcourse Deleted',
          life: 3000,
        });
      },
    });
  }

  // Fix type checking issues - explicitly check required properties
  saveCourse(courseData: any): void {
    if (courseData.id !== undefined) {
      // It's an update
      this.courseService.updateCourse(courseData as Course);
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Course Updated',
        life: 3000,
      });
    } else {
      // It's a new course
      if (courseData.name && courseData.startDate && courseData.endDate) {
        this.courseService.addCourse({
          name: courseData.name,
          startDate: courseData.startDate,
          endDate: courseData.endDate,
        });
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Course Created',
          life: 3000,
        });
      }
    }
  }

  saveSubcourse(subcourseData: any): void {
    if (subcourseData.id !== undefined) {
      // It's an update
      this.courseService.updateSubcourse(subcourseData as Subcourse);
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Subcourse Updated',
        life: 3000,
      });
    } else {
      // It's a new subcourse
      if (
        subcourseData.name &&
        subcourseData.startDate &&
        subcourseData.endDate &&
        subcourseData.courseId
      ) {
        this.courseService.addSubcourse(subcourseData.courseId, {
          name: subcourseData.name,
          startDate: subcourseData.startDate,
          endDate: subcourseData.endDate,
        });
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Subcourse Created',
          life: 3000,
        });
      }
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
}
