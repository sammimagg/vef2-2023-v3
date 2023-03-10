import pg from "pg";
import dotenv from 'dotenv';
import { Course, Department } from "../types.js";
import { courseMapper, coursesMapper, departmentMapper, departmentsMapper } from "./mapper.js";

dotenv.config({ path: ".env" });

const connectionString = process.env.DATABASE_URL;
const nodeEnv = process.env.NODE_ENV || 'development';

const ssl = nodeEnv === 'production' ? {rejectUnauthorized: false} : false
const pool = new pg.Pool({connectionString, ssl})

pool.on('error', (err: Error) =>{
  console.error('Villa í tengingu við gagnagrunn, forrit hættir', err);
  process.exit(-1);
})

export function getPool() {
  const pool = new pg.Pool({ connectionString, ssl });
  if (!connectionString) {
    console.error('vantar DATABASE_URL í .env');
    process.exit(-1);
  }
  pool.on("error", (err: Error) => {
    console.error("Villa í tengingu við gagnagrunn, forrit hættir", err);
    process.exit(-1);
  });
  return pool;
}

type QueryType = string | number | null;
export async function query(
  q: string,
  values: Array<QueryType> = [],
  silent = false,
) {


  let client;
  try {
    client = await pool.connect();
  } catch (e) {
    console.error('unable to get client from pool', e);
    return null;
  }
  
  try {
    const result = await client.query(q, values);
    return result;
  } catch (e) {
    if (!silent) console.error('unable to query', e);
    if (!silent) console.info(q, values);
    return null;
  } finally {
    client.release();
  }
}


export async function conditionalUpdateInDp(table:string, id:number, fields:string[] | null, values:any[]) {
  if (!fields) {
    return false;
  }

  const filteredFields = fields.filter((i) => typeof i === 'string');
  const filteredValues = values.filter(
    (i) => typeof i === 'string' || typeof i === 'number' || i instanceof Date
  );

  if (filteredFields.length === 0) {
    return false;
  }

  if (filteredFields.length !== filteredValues.length) {
    throw new Error('fields and values must be of equal length');
  }

  // id is field = 1
  const updates = filteredFields.map((field, i) => `${field} = $${i + 2}`);

  const q = `
    UPDATE ${table}
      SET ${updates.join(', ')}
    WHERE
      id = $1
    RETURNING *
    `;

  const queryValues = [id].concat(filteredValues);
  const result = await query(q, queryValues);

  return result;
}


export async function insertCourseToDb(
  course: Omit<Course, 'id'>,
  departmentId: number,
  silent = false,
): Promise<Course | null> {
  const { title, units, semester, level, url, course_id } = course;
  const result = await query(
    'INSERT INTO courses (title, units, semester, level, url, department_id, course_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', 
    [title, units||0, semester, level || '', url || '', departmentId, course_id], 
    silent,
  );
  const mapped = await courseMapper(result?.rows[0]);

  return mapped;
}
export async function poolEnd() {
  const pool = getPool();
  pool.end;
}
export async function insertDepartmentToDb(
  department: Omit<Department,'id'>,
  silent =false,
): Promise<Department | null> {
  const { title, slug, description } = department;
  const result = await query(
    'INSERT INTO department(title, slug, description) VALUES ($1,$2,$3) RETURNING *',
    [title,slug,description],
    silent,
    );

    const mapped = departmentMapper(result?.rows[0]);
    return mapped;
}

export async function getDepartmentsFromDb(): Promise<Array<Department> | null> {
  const result = await query('SELECT * FROM department');

  if (!result?.rows) {
    return null;
  }

  const departments = departmentsMapper(result);

  return departments;
}

export async function getDepartmentBySlugFromDb(
{ slug }: { slug: string; },
): Promise<Department | null> {
  const result = await query('SELECT * FROM department WHERE slug = $1', [slug,]);
  if (!result) {
    return null;
  }
  const department = departmentMapper(result.rows[0]);
  return department;
}

export async function deleteDepartmentFromDb(id: number) {
  // First all courses in department
  const deleteCoursesResult = await query(
    'DELETE FROM courses WHERE department_id = $1;',
    [id]
  );
  if (!deleteCoursesResult) {
    console.warn('unable to delete courses', id);
    return false;
  }

  // Then the department
  // BUT! If something fails here we're not doing this as an atomic action
  const deleteDepartmentResult = await query('DELETE FROM department WHERE id = $1;', [
    id,
  ]);

  if (deleteDepartmentResult && deleteDepartmentResult.rowCount === 1) {
    return true;
  }

  console.warn('unable to delete department', id);

  return false;
}
export async function getCourseInDepartmentFromDb(deparmentId:  number ) {
  const q = `
             SELECT *
             FROM courses
             WHERE department_id = $1
             `;
  const values = [deparmentId];
  const result = await query(q,values);
  const courses = coursesMapper(result);
  return courses
}