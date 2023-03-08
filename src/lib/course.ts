import { QueryResult } from "pg";
import { create } from "ts-node";
import { parseTag } from "xss";
/**
CREATE TABLE public.courses (
    id SERIAL PRIMARY KEY,
    course_id VARCHAR(16) NOT NULL UNIQUE,
    department_id INTEGER NOT NULL,
    title VARCHAR(64) NOT NULL UNIQUE,
    units REAL NOT NULL CONSTRAINT units_check CHECK (units > 0),
    semester semester NOT NULL,
    level VARCHAR(128) DEFAULT NULL,
    url VARCHAR(256) DEFAULT NULL,
    created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_department_id FOREIGN KEY (department_id) REFERENCES department(id)
);
 */
export  enum Semester {
    Vor = 'Vor',
    Sumar = 'Sumar',
    Vetur = 'Vetur', 
    Haust = 'Haust',
};
export type Course = {
    id: number;
    course_id: string;
    department_id: number;
    title: string;
    units: number;
    semester: Semester;
    level: string;
    url: string;
    created: Date;
    updated: Date;
}
export function mapDbCourseToCourse(input: unknown): Course | null {
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
export function mapDbCoursesToCourses(input: QueryResult<any> | null): Array<Course> {
    if (!input) {
        return [];
    }
    const mappedCourses = input?.rows.map(mapDbCourseToCourse);
    return mappedCourses.filter((i): i is Course => Boolean(i));
}