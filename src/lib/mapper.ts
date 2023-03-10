import { QueryResult } from "pg";
import { Semester } from "../types.js";
import { Department, Course } from "../types.js";

export function valueToSemester(value: string): Semester | undefined {
  if (value === undefined) {
    return undefined;
  }
  const lowerValue = value.toLowerCase();
  if (lowerValue === 'vor') {
    return Semester.Vor;
  } else if (lowerValue === 'haust') {
    return Semester.Haust;
  } else if (lowerValue === 'sumar') {
    return Semester.Sumar;
  } else {
    return undefined;
  }
}

export function departmentMapper(input: unknown): Department | null {
    const potentialDepartment = input as Partial<Department> | null;
    if (!potentialDepartment?.id ||
        !potentialDepartment?.title ||
        !potentialDepartment.slug ||
        !potentialDepartment.description ||
        !potentialDepartment.created ||
        !potentialDepartment.updated
    )
    {
        return null;
    }
    const department: Department = {
        id: potentialDepartment.id,
        title: potentialDepartment.title,
        slug: potentialDepartment.slug,
        description: potentialDepartment.description,
        created: potentialDepartment.created,
        updated: potentialDepartment.updated
    }
    return department;
}
export function departmentsMapper(input: QueryResult<any> | null): Array<Department> {
    if (!input) {
        return [];
    }
    const mappedDepartments = input?.rows.map((d: any) => departmentMapper(d));
    return mappedDepartments.filter((d): d is Department => Boolean(d));
}

export  function courseMapper(input: unknown): Course | null {
    const potentialCourse = input as Partial<Course> | null;

    if (!potentialCourse ||
        !potentialCourse.id ||
        !potentialCourse.course_id ||
        !potentialCourse.department_id ||
        !potentialCourse.title ||
        !potentialCourse.units ||
        !potentialCourse.semester ||
        !potentialCourse.level ||
        !potentialCourse.url ||
        !potentialCourse.created ||
        !potentialCourse.updated
        )
    {
        return null;
    }
    const course: Course = {
        id: potentialCourse.id,
        course_id: potentialCourse.course_id,
        department_id: potentialCourse.department_id,
        title:potentialCourse.title,
        units: potentialCourse.units,
        semester: potentialCourse.semester,
        level: potentialCourse.level,
        url: potentialCourse.url,
        created: new Date(potentialCourse.created),
        updated: new Date(potentialCourse.updated),
    } 
    return course
}
export  function coursesMapper(input: QueryResult<any> | null): Array<Course> {
    if (!input) {
      return [];
    }
    const mappedCourses = input?.rows.map((d: any) => courseMapper(d));
    return mappedCourses.filter((d): d is Course => Boolean(d));
  }
  
  
