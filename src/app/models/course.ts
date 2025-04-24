export interface Course {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
  subcourses: Subcourse[];
}
export interface Subcourse {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
  courseId: number;
}
