import express, { Request, Response, NextFunction } from 'express';
import { Department } from '../types';
import slugify from 'slugify';
import { 
  getDepartmentsFromDb, 
  getDepartmentBySlugFromDb,
  insertDepartmentToDb,
  conditionalUpdateInDp,
  deleteDepartmentFromDb
} from '../lib/db.js';
import { departmentMapper} from '../lib/mapper.js'

import {
  genericSanitizer,
  isString,
  //genericSanitizer,
  stringValidator,
  validationCheck,
  xssSanitizer,
} from '../lib/validation.js'
import xss from 'xss';
/*
  GET /departments skilar lista af deildum:
    200 OK skilað með gögnum.
 */
    export async function listDepartments(req: Request, res: Response, next: NextFunction) {
      const departments = await getDepartmentsFromDb();

      if (!departments) {
        return next(new Error('unable to get departments'));
      }

      return res.json(departments);
    }
    /*
      GET /departments/:slug skilar stakri deild:
        200 OK skilað með gögnum ef deild er til.
        404 Not Found skilað ef deild er ekki til.
    */
    export async function getDepartment(req: Request, res: Response, next: NextFunction) {
      const { slug } = req.params;
      const department = await getDepartmentBySlugFromDb({ slug });

      if (!department) {
        return next();
      }
      return res.json(department);
    }
    export async function departmentDoesNotExistValidator(title: string): Promise<boolean> {
      const existingDepartment = await getDepartmentBySlugFromDb({ slug: title })
    
      return !existingDepartment;
    }
    /*
      POST /departments býr til nýja deild:
        200 OK skilað ásamt upplýsingum um deild.
        400 Bad Request skilað ef gögn sem send inn eru ekki rétt 
        (vantar gögn, gögn á röngu formi eða innihald þeirra ólöglegt).
    */
    export async function createDepartment(req: Request, res: Response, next: NextFunction) {
        const { title, description } = req.body;
        if (!title || !description) {
          return res.status(400).json({ error: 'Empty title or description' });
        }
        const body = JSON.stringify(req.body);
        if (!body.includes(title) || !body.includes(description)) {
          return res.status(400).json({ error: 'Missing title or description' });
        }

        const departmentToCreate: Omit<Department, 'id'> = {
            title,
            slug: slugify(title),
            description,
            created: new Date,
            updated: new Date,
        };
        const createDepartment = await insertDepartmentToDb(departmentToCreate, false);
        if (!createDepartment) {
            return next(new Error('unable to create department'));
        }
        return res.json(departmentMapper(createDepartment));
    }

    /*
      PATCH /departments/:slug uppfærir deild:
        200 OK skilað með uppfærðri deild ef gekk.
        400 Bad Request skilað ef gögn sem send inn eru ekki rétt.
        404 Not Found skilað ef deild er ekki til.
        500 Internal Error skilað ef villa kom upp.
    */
    export async function updateDepartment(req: Request, res: Response, next: NextFunction) {
      const { title, description } = req.body;
      if (!title || !description) {
        return res.status(400).json({});
      }
      const slug = slugify(title.toLowerCase());
      const department = await getDepartmentBySlugFromDb({ slug });
      const update = new Date();
      if (!department) {
        return res.status(404).json({});
      }
      const fields = [
        isString(title) ? 'title' : null,
        isString(title) ? 'slug' : null,
        isString(description) ? 'description' : null,
        'updated'
      ];
      
      const values = [
        isString(title) ? xss(title) : '',
        isString(title) ? xss(slugify(title.toLowerCase())) : '',
        isString(description) ? xss(description) : '',
        update
      ];

    
      const result = await conditionalUpdateInDp('department', department.id, fields.filter(Boolean) as string[], values.filter((v) => v !== null) as any[]);

      if (!result) {
        return res.status(500).json({ error: 'unable to update' });
      }
    
      return res.status(200).json(result.rows[0]);
    }
    
    /*
      DELETE /departments/:slug eyðir deild:
        204 No Content skilað ef gekk.
        404 Not Found skilað ef deild er ekki til.y
        500 Internal Error skilað ef villa kom upp.
    */
    export async function deleteDepartment(req: Request, res: Response, next: NextFunction) {
      const { slug: slug } = req.params;
      const department = await getDepartmentBySlugFromDb({ slug });

      if(!department) {
        return res.status(404).json({});
      }

      const result = await deleteDepartmentFromDb(department.id);

      if (!result) {
        return res.status(500).json({ error: 'unable to delete'});
      }
      return res.status(204).json({});
    }

