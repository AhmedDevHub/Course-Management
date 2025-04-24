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
import { Subcourse } from '../../models/course';

@Component({
  selector: 'app-subcourse-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    CalendarModule,
    DialogModule,
    InputTextModule,
  ],
  templateUrl: './subcourse-dialog.component.html',
  styleUrls: ['./subcourse-dialog.component.css'],
})
export class SubcourseDialogComponent implements OnInit {
  @Input() visible = false;
  @Input() courseId!: number;
  @Input() subcourse: Subcourse | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<any>();

  subcourseForm!: FormGroup;
  dialogTitle = 'Add Subcourse';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.subcourseForm = this.fb.group({
      name: ['', [Validators.required]],
      startDate: [new Date(), [Validators.required]],
      endDate: [new Date(), [Validators.required]],
    });

    if (this.subcourse) {
      this.dialogTitle = 'Edit Subcourse';
      this.subcourseForm.patchValue({
        name: this.subcourse.name,
        startDate: new Date(this.subcourse.startDate),
        endDate: new Date(this.subcourse.endDate),
      });
    }
  }

  hideDialog(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  saveSubcourse(): void {
    if (this.subcourseForm.valid) {
      const subcourseData = this.subcourseForm.value;

      if (this.subcourse) {
        // For update, include id and courseId
        this.save.emit({
          id: this.subcourse.id,
          name: subcourseData.name,
          startDate: subcourseData.startDate,
          endDate: subcourseData.endDate,
          courseId: this.subcourse.courseId,
        });
      } else {
        // For new subcourse, include courseId
        this.save.emit({
          name: subcourseData.name,
          startDate: subcourseData.startDate,
          endDate: subcourseData.endDate,
          courseId: this.courseId,
        });
      }

      this.hideDialog();
    }
  }
}
