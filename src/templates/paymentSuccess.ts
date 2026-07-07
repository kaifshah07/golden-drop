export const paymentSuccessTemplate = (
  name: string,
  orderNumber: string
) => `
<!DOCTYPE html>

<html>

<body>

<h2>Payment Successful ✅</h2>

<p>

Hi ${name},

</p>

<p>

Payment received for

<b>${orderNumber}</b>

</p>

<p>

Thank you for shopping with Golden Drop.

</p>

</body>

</html>
`;