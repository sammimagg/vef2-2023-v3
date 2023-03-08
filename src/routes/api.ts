import express, { Request, Response, NextFunction } from 'express';
import { mapDbCoursesToCourses } from '../lib/course.js';
import { query } from '../lib/db.js';


export const router = express.Router();

export async function index(req: Request, res: Response, next: NextFunction) {
  const coursesResult = await query('SELECT * FROM courses;');
  const course = mapDbCoursesToCourses(coursesResult)
  res.json(course);

}
export async function departmentsListGet() {

}
export async function departmentGet() {}
export async function departmentPost() {}
export async function departmentsPatch() {}
export async function departmentDelete() {}

router.get('/', index);

/*
  GET /departments skilar lista af deildum:
    200 OK skilað með gögnum.
 */
router.get('/departments',departmentsListGet);

/*
  GET /departments/:slug skilar stakri deild:
    200 OK skilað með gögnum ef deild er til.
    404 Not Found skilað ef deild er ekki til.
*/
router.get('/departments/:slug',departmentGet);
/*
  POST /departments býr til nýja deild:
    200 OK skilað ásamt upplýsingum um deild.
    400 Bad Request skilað ef gögn sem send inn eru ekki rétt 
    (vantar gögn, gögn á röngu formi eða innihald þeirra ólöglegt).
*/
router.post('/departments',departmentPost);
/*
  PATCH /departments/:slug uppfærir deild:
    200 OK skilað með uppfærðri deild ef gekk.
    400 Bad Request skilað ef gögn sem send inn eru ekki rétt.
    404 Not Found skilað ef deild er ekki til.
    500 Internal Error skilað ef villa kom upp.
*/
router.patch('departments/:slug',departmentsPatch);
/*
  DELETE /departments/:slug eyðir deild:
    204 No Content skilað ef gekk.
    404 Not Found skilað ef deild er ekki til.
    500 Internal Error skilað ef villa kom upp.
*/
router.delete('/departments/:slug',departmentDelete);
