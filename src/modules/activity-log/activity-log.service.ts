import { prisma } from "../../config/prisma";

interface LogInput {
  adminId: number;
  action: string;
  module: string;
  description: string;
  ipAddress?: string;
  userAgent?: string;
}

export class ActivityLogService {
  static async log(data: LogInput) {
    try {
      return await prisma.activityLog.create({
        data: {
          adminId: BigInt(data.adminId),
          action: data.action,
          module: data.module,
          description: data.description,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
        },
      });
    } catch (error) {
      // Never break main flow if logging fails
      console.error("Activity Log Error:", error);
    }
  }
}