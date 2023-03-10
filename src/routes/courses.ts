import e from "express";
import express, { Request, Response, NextFunction } from "express";
import {
  getCourseInDepartmentFromDb,
  getDepartmentBySlugFromDb,
} from "../lib/db.js";
import { Course } from "../types";

export async function listCourse(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { slug } = req.params;
  const department = await getDepartmentBySlugFromDb({ slug });
  if (!department) {
    return next();
  }

  const courseInDepartment = await getCourseInDepartmentFromDb(department.id);
  if (!courseInDepartment) {
    return next(new Error("unable to get departments"));
  }
  console.log(courseInDepartment);

  return res.json(courseInDepartment);
}
export async function createCourse(
  req: Request,
  res: Response,
  next: NextFunction
) {}
export async function getCourse(
  req: Request,
  res: Response,
  next: NextFunction
) {}
export async function updateCourse(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // const result = await conditionalUpdate('events',eventID, fields, values)
}

export async function deleteCourse(
  req: Request,
  res: Response,
  next: NextFunction
) {}
