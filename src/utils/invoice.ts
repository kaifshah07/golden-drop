import PDFDocument from "pdfkit";

export function generateInvoice(order: any) {
  const doc = new PDFDocument({
    margin: 40,
    size: "A4",
  });

  doc.fontSize(22);
  doc.text("Golden Drop");

  doc.moveDown();

  doc.fontSize(18);
  doc.text("INVOICE");

  doc.moveDown();

  doc.fontSize(12);

  doc.text(`Order Number : ${order.orderNumber}`);
  doc.text(`Customer : ${order.user.name}`);
  doc.text(`Email : ${order.user.email}`);

  doc.moveDown();

  doc.text("Shipping Address");

  doc.text(order.address.fullName);

  doc.text(order.address.addressLine1);

  if (order.address.addressLine2) {
    doc.text(order.address.addressLine2);
  }

  doc.text(
    `${order.address.city}, ${order.address.state}`
  );

  doc.text(order.address.country);

  doc.moveDown();

  doc.text("----------------------------------------");

  order.items.forEach((item: any) => {
    doc.text(
      `${item.productVariant.product.name}`
    );

    doc.text(
      `Qty : ${item.quantity}`
    );

    doc.text(
      `Price : ₹${item.unitPrice}`
    );

    doc.moveDown();
  });

  doc.text("----------------------------------------");

  doc.fontSize(15);

  doc.text(
    `Total : ₹${order.totalAmount}`
  );

  doc.text(
    `Payment : ${order.paymentStatus}`
  );

  doc.moveDown();

  doc.text("Thank you for shopping!");

  return doc;
}