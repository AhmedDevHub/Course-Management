import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Course } from '../../models/course';
@Component({
  selector: 'app-course-dialog',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    CalendarModule,
    DialogModule,
    InputTextModule,
  ],
  templateUrl: './course-dialog.component.html',
  styleUrls: ['./course-dialog.component.css'],
})
export class CourseDialogComponent {
  @Input() visible = false;
  @Input() course: Course | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<any>();

  courseForm!: FormGroup;
  dialogTitle = 'Add Course';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.courseForm = this.fb.group({
      name: ['', [Validators.required]],
      startDate: [new Date(), [Validators.required]],
      endDate: [new Date(), [Validators.required]],
    });

    if (this.course) {
      this.dialogTitle = 'Edit Course';
      this.courseForm.patchValue({
        name: this.course.name,
        startDate: new Date(this.course.startDate),
        endDate: new Date(this.course.endDate),
      });
    }
  }

  hideDialog(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  saveCourse(): void {
    if (this.courseForm.valid) {
      const courseData = this.courseForm.value;

      if (this.course) {
        // For update, include id and subcourses
        this.save.emit({
          id: this.course.id,
          name: courseData.name,
          startDate: courseData.startDate,
          endDate: courseData.endDate,
          subcourses: this.course.subcourses,
        });
      } else {
        // For new course, just emit the form data
        this.save.emit(courseData);
      }

      this.hideDialog();
    }
  }
}
