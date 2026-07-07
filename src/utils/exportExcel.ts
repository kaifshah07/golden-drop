import ExcelJS from "exceljs";

export async function exportExcel(
  sheetName: string,
  columns: any[],
  rows: any[]
) {
  const workbook = new ExcelJS.Workbook();

  const worksheet = workbook.addWorksheet(sheetName);

  worksheet.columns = columns;

  rows.forEach((row) => worksheet.addRow(row));

  worksheet.getRow(1).font = {
    bold: true,
  };

  worksheet.columns.forEach((column) => {
    column.width = 25;
  });

  return workbook;
}