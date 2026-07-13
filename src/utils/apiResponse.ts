import { Response } from "express";

interface ApiResponse<T = any> {
  success?: boolean;
  message?: string;
  data?: T | null;
  meta?: any;
  errors?: any;
  statusCode?: number;
}

export const sendSuccess = <T>(
  res: Response,
  {
    message = "Success",
    data = null,
    meta = null,
    statusCode = 200,
  }: ApiResponse<T>
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    meta,
  });
};

export const sendError = (
  res: Response,
  {
    message = "Something went wrong",
    errors = null,
    statusCode = 500,
  }: ApiResponse
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

export const sendPaginated = <T>(
  res: Response,
  {
    message = "Success",
    data = [],
    meta,
    statusCode = 200,
  }: ApiResponse<T[]>
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    meta,
  });
};