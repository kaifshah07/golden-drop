import { Request, Response } from "express";
import { AdminService } from "./admin.service";
import { exportExcel } from "../../utils/exportExcel";

export class AdminController {
  static async dashboard(
    req: Request,
    res: Response
  ) {
    try {
      const data =
        await AdminService.getDashboard();

      return res.status(200).json({
        success: true,
        data,
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  static async recentOrders(
  req: Request,
  res: Response
) {
  try {
    const orders =
      await AdminService.getRecentOrders();

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

static async lowStockProducts(
  req: Request,
  res: Response
) {
  try {
    const products =
      await AdminService.getLowStockProducts();

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}
static async topSellingProducts(
  req: Request,
  res: Response
) {
  try {
    const products =
      await AdminService.getTopSellingProducts();

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

static async monthlySales(
  req: Request,
  res: Response
) {
  try {
    const sales =
      await AdminService.getMonthlySales();

    return res.status(200).json({
      success: true,
      data: sales,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}
static async getUsers(
  req: Request,
  res: Response
) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search as string | undefined;

    const users = await AdminService.getAllUsers(
      page,
      limit,
      search
    );

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}
static async getUser(
  req: Request,
  res: Response
) {
  try {
    const user =
      await AdminService.getUserById(
        Number(req.params.id)
      );

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

static async deleteUser(
  req: Request,
  res: Response
) {
  try {
    await AdminService.deleteUser(
      Number(req.params.id)
    );

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

static async changeRole(
  req: Request,
  res: Response
) {
  try {
    const user =
      await AdminService.changeUserRole(
        Number(req.params.id),
        req.body.role
      );

    return res.status(200).json({
      success: true,
      message: "Role updated successfully",
      data: user,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}
static async getOrders(
  req: Request,
  res: Response
) {
  try {
    const orders =
      await AdminService.getAllOrders();

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

static async getOrder(
  req: Request,
  res: Response
) {
  try {
    const order =
      await AdminService.getOrder(
        Number(req.params.id)
      );

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}
static async updateOrderStatus(
  req: Request,
  res: Response
) {
  try {
    const order =
      await AdminService.updateOrderStatus(
        Number(req.params.id),
        req.body.status
      );

    return res.status(200).json({
      success: true,
      message: "Order status updated",
      data: order,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

static async updatePaymentStatus(
  req: Request,
  res: Response
) {
  try {
    const order =
      await AdminService.updatePaymentStatus(
        Number(req.params.id),
        req.body.status
      );

    return res.status(200).json({
      success: true,
      message: "Payment status updated",
      data: order,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

static async salesReport(
  req: Request,
  res: Response
) {
  try {
    const from = req.query.from as string | undefined;
    const to = req.query.to as string | undefined;

    const report =
      await AdminService.getSalesReport(
        from,
        to
      );

    return res.status(200).json({
      success: true,
      data: report,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

static async customerReport(
  req: Request,
  res: Response
) {
  try {
    const report =
      await AdminService.getCustomerReport();

    return res.status(200).json({
      success: true,
      data: report,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

static async productReport(
  req: Request,
  res: Response
) {
  try {
    const report =
      await AdminService.getProductReport();

    return res.status(200).json({
      success: true,
      data: report,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

static async exportUsers(req: Request, res: Response) {

const users = await AdminService.exportUsers();

const workbook = await exportExcel(

"Users",

[
{header:"ID",key:"id"},
{header:"Name",key:"name"},
{header:"Email",key:"email"},
{header:"Role",key:"role"},
{header:"Verified",key:"isVerified"},
],

users

);

res.setHeader(

"Content-Type",

"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

);

res.setHeader(

"Content-Disposition",

"attachment; filename=users.xlsx"

);

await workbook.xlsx.write(res);

res.end();

}

static async exportProducts(req:Request,res:Response){

const products=await AdminService.exportProducts();

const workbook=await exportExcel(

"Products",

[

{header:"ID",key:"id"},

{header:"Name",key:"name"},

{header:"Category",key:"category"},

{header:"Slug",key:"slug"},

],

products.map(p=>({

id:p.id,

name:p.name,

category:p.category.name,

slug:p.slug

}))

);

res.setHeader(

"Content-Disposition",

"attachment; filename=products.xlsx"

);

await workbook.xlsx.write(res);

res.end();

}

static async exportOrders(req:Request,res:Response){

const orders=await AdminService.exportOrders();

const workbook=await exportExcel(

"Orders",

[

{header:"Order",key:"orderNumber"},

{header:"Customer",key:"customer"},

{header:"Amount",key:"amount"},

{header:"Status",key:"status"}

],

orders.map(o=>({

orderNumber:o.orderNumber,

customer:o.user.name,

amount:o.totalAmount,

status:o.orderStatus

}))

);

res.setHeader(

"Content-Disposition",

"attachment; filename=orders.xlsx"

);

await workbook.xlsx.write(res);

res.end();

}

static async inventorySummary(
  req: Request,
  res: Response
) {
  try {
    const data =
      await AdminService.getInventorySummary();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

static async outOfStockProducts(
  req: Request,
  res: Response
) {
  try {
    const products =
      await AdminService.getOutOfStockProducts();

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

static async todayStats(
  req: Request,
  res: Response
) {
  try {
    const data =
      await AdminService.getTodayStats();

    return res.status(200).json({
      success: true,
      data,
    });

  } catch (err: any) {

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
}


}