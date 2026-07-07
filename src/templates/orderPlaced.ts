export const orderPlacedTemplate = (
  name: string,
  orderNumber: string
) => `
<!DOCTYPE html>

<html>

<body>

<h2>Order Placed Successfully 🎉</h2>

<p>

Hi ${name},

</p>

<p>

Your order

<b>${orderNumber}</b>

has been placed successfully.

</p>

<p>

Thank you for shopping with Golden Drop.

</p>

</body>

</html>
`;