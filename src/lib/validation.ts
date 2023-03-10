import { Request, Response, NextFunction } from "express";
import {
  validationResult,
  body,
  Result,
  ValidationError,
} from "express-validator";

import xss from "xss";

export function validationCheck(
  req: Request,
  res: Response,
  next: NextFunction
): Response | void {
  const validation = validationResult(req) as Result<ValidationError>;

  if (!validation.isEmpty()) {
    const notFoundError = validation
      .array()
      .find((error: ValidationError) => error.msg === "not found");
    const serverError = validation
      .array()
      .find((error: ValidationError) => error.msg === "server error");

    // We lose the actual error object of LoginError, match with error message
    const loginError = validation
      .array()
      .find(
        (error: ValidationError) =>
          error.msg === "username or password incorrect"
      );

    let status = 400;

    if (serverError) {
      status = 500;
    } else if (notFoundError) {
      status = 404;
    } else if (loginError) {
      status = 401;
    }

    return res.status(status).json({ errors: validation.array() });
  }

  return next();
}
// Viljum keyra sér og með validation, ver gegn „self XSS“
export function xssSanitizer(textField: string) {
  return [
    body("name").customSanitizer((v) => xss(v)),
    body(textField).customSanitizer((v) => xss(v)),
  ];
}

export function sanitizationMiddleware(textField: string) {
  return [body("name").trim().escape(), body(textField).trim().escape()];
}

export function stringValidator(
  myString: string,
  valueRequired: boolean,
  maxLength: number
): boolean {
  if (valueRequired === false && !myString) {
    return true;
  }

  if (typeof myString !== "string") {
    return false;
  }

  if (maxLength !== undefined && myString.length > maxLength) {
    return false;
  }

  return true;
}

export const genericSanitizer = (stringValue: string | undefined | null) => {
  if (typeof stringValue === "string" && stringValue.trim().length > 0) {
    return stringValue.trim();
  } else {
    return null;
  }
};
export function isString(value: any): value is string {
  return typeof value === "string" || value instanceof String;
}
