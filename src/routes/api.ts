import express, { Request, Response, NextFunction } from 'express';
import {
  createDepartment,
  deleteDepartment,
  getDepartment,
  listDepartments,
  updateDepartment,
} from './departments.js';
import {
  listCourse,
  createCourse,
  getCourse,
  updateCourse,
  deleteCourse,
} from './courses.js'

export const router = express.Router();

export async function index(req: Request, res: Response, next: NextFunction) {
  return res.json([
    {
      href: '/departments',
      methods: ['GET','POST'],
    },
    {
      href: '/departments/:slug',
      methods: ['GET','PATCH', 'DELETE'],
    },
    {
      href: '/department/:slug/courses',
      methods: ['GET','POST'],
    },
    {
      href: '/departments/:slug/courses/:courseId',
      methods: ['GET','PATCH', 'DELETE'],
    }
  ]);

}

// Departments
router.get('/', index);                                      // [200]DONE
router.get('/departments', listDepartments);                 // [200]DONE
router.post('/departments', createDepartment);               // [200]DONE, [400]DONE
router.get('/departments/:slug', getDepartment);             // [200]DONE, [404]DONE
router.patch('/departments/:slug', updateDepartment);        // [200]DONE, [400]DONE, [404]DONE, [500]DONE
router.delete('/departments/:slug', deleteDepartment);       // [204]DONE, [404]DONE, [500]DONE

// Courses
router.get('/departments/:slug/courses', listCourse);        // [200]DONE
router.post('/departments/:slug/courses', createCourse);     // 200],[400]
router.get('/departments/:slug/:courseId', getCourse);       // [200], [404]
router.patch('/departments/:slug/:courseId', updateCourse);  // [200], [400], [404], [500]
router.delete('/departments/:slug/:courseId', deleteCourse); // [204], [404], [500]