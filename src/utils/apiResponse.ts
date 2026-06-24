import { Response } from "express";

interface ResponseOptions {
  success?: boolean;
  message?: string;
  data?: any;
  meta?: any;
  statusCode?: number;
}

export const sendResponse = (
  res: Response,
  {
    success = true,
    message = "Success",
    data = null,
    meta = null,
    statusCode = 200,
  }: ResponseOptions
) => {
  return res.status(statusCode).json({
    success,
    message,
    data,
    meta,
  });
};