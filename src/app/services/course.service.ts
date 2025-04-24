import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { Course, Subcourse } from '../models/course';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private coursesSubject = new BehaviorSubject<Course[]>([]);
  courses$ = this.coursesSubject.asObservable();
  private dataUrl = 'http://localhost:3000/courses';
  private nextCourseId = 1;
  private nextSubcourseId = 1;

  constructor(private http: HttpClient) {
    this.loadCourses();
  }

  private loadCourses(): void {
    this.http
    .get<Course[]>(this.dataUrl)
    .pipe(
      tap((courses) => {
        // Convert string dates to Date objects
        const processedCourses = courses.map((course) => ({
          ...course,
          startDate: new Date(course.startDate),
          endDate: new Date(course.endDate),
          subcourses: course.subcourses.map((subcourse) => ({
            ...subcourse,
            startDate: new Date(subcourse.startDate),
            endDate: new Date(subcourse.endDate),
          })),
        }));

        this.coursesSubject.next(processedCourses);

        // Set next IDs
        this.nextCourseId = Math.max(...processedCourses.map((c) => c.id), 0) + 1;
        const allSubcourses = processedCourses.flatMap((c) => c.subcourses);
        if (allSubcourses.length > 0) {
          this.nextSubcourseId =
            Math.max(...allSubcourses.map((s) => s.id), 0) + 1;
        }
      })
    )
    .subscribe();
}

  getCourses(): Observable<Course[]> {
    return this.courses$;
  }

  // Fix type definitions here
  addCourse(courseData: {
    name: string;
    startDate: Date;
    endDate: Date;
  }): void {
    const currentCourses = this.coursesSubject.value;
    const newCourse: Course = {
      id: this.nextCourseId++,
      name: courseData.name,
      startDate: courseData.startDate,
      endDate: courseData.endDate,
      subcourses: [],
    };

    this.coursesSubject.next([...currentCourses, newCourse]);
  }

  updateCourse(course: Course): void {
    const currentCourses = this.coursesSubject.value;
    const index = currentCourses.findIndex((c) => c.id === course.id);

    if (index !== -1) {
      currentCourses[index] = { ...course };
      this.coursesSubject.next([...currentCourses]);
    }
  }

  deleteCourse(courseId: number): void {
    const currentCourses = this.coursesSubject.value;
    this.coursesSubject.next(currentCourses.filter((c) => c.id !== courseId));
  }

  // Fix type definition for subcourse
  addSubcourse(
    courseId: number,
    subcourseData: { name: string; startDate: Date; endDate: Date }
  ): void {
    const currentCourses = this.coursesSubject.value;
    const courseIndex = currentCourses.findIndex((c) => c.id === courseId);

    if (courseIndex !== -1) {
      const newSubcourse: Subcourse = {
        id: this.nextSubcourseId++,
        name: subcourseData.name,
        startDate: subcourseData.startDate,
        endDate: subcourseData.endDate,
        courseId,
      };

      const updatedCourse = {
        ...currentCourses[courseIndex],
        subcourses: [...currentCourses[courseIndex].subcourses, newSubcourse],
      };

      currentCourses[courseIndex] = updatedCourse;
      this.coursesSubject.next([...currentCourses]);
    }
  }

  updateSubcourse(subcourse: Subcourse): void {
    const currentCourses = this.coursesSubject.value;
    const courseIndex = currentCourses.findIndex(
      (c) => c.id === subcourse.courseId
    );

    if (courseIndex !== -1) {
      const subcourseIndex = currentCourses[courseIndex].subcourses.findIndex(
        (s) => s.id === subcourse.id
      );

      if (subcourseIndex !== -1) {
        const updatedSubcourses = [...currentCourses[courseIndex].subcourses];
        updatedSubcourses[subcourseIndex] = { ...subcourse };

        const updatedCourse = {
          ...currentCourses[courseIndex],
          subcourses: updatedSubcourses,
        };

        currentCourses[courseIndex] = updatedCourse;
        this.coursesSubject.next([...currentCourses]);
      }
    }
  }

  deleteSubcourse(courseId: number, subcourseId: number): void {
    const currentCourses = this.coursesSubject.value;
    const courseIndex = currentCourses.findIndex((c) => c.id === courseId);

    if (courseIndex !== -1) {
      const updatedSubcourses = currentCourses[courseIndex].subcourses.filter(
        (s) => s.id !== subcourseId
      );

      const updatedCourse = {
        ...currentCourses[courseIndex],
        subcourses: updatedSubcourses,
      };

      currentCourses[courseIndex] = updatedCourse;
      this.coursesSubject.next([...currentCourses]);
    }
  }
}
