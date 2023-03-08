import { QueryResult } from "pg";
import { CreateOptions } from "ts-node"

/*
CREATE TABLE public.department (
    id SERIAL PRIMARY KEY,
    title VARCHAR(64) NOT NULL UNIQUE,
    slug VARCHAR(64) NOT NULL UNIQUE,
    description VARCHAR(1000) DEFAULT '',
    created TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
*/
export type Department = {
    id: number;
    title: string;
    slug: string;
    description: string;
    create: Date;
    update: Date;
};

export function mapDbDepartmentToDepartment(input: unknown): Department | null {
    const potentialDepartment = input as Partial<Department> | null;
    if (!potentialDepartment?.id ||
        !potentialDepartment?.title ||
        !potentialDepartment.slug ||
        !potentialDepartment.description ||
        !potentialDepartment.create ||
        !potentialDepartment.update
    )
    {
        return null;
    }
    const department: Department = {
        id: potentialDepartment.id,
        title:potentialDepartment.title,
        slug: potentialDepartment.slug,
        description: potentialDepartment.description,
        create: potentialDepartment.create,
        update: potentialDepartment.update,
    }
    return department;
}
export function mapDbDepartmentsToDepartments(input: QueryResult<any> | null): Array<Department> {
    if (!input) {
        return [];
    }
    const mappedDepartments = input?.rows.map(mapDbDepartmentToDepartment);
    return mappedDepartments.filter((i): i is Department => Boolean(i));
}