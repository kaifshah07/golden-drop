export const forgotPasswordTemplate = (
  name: string,
  resetLink: string
) => `
<!DOCTYPE html>

<html>

<body
style="font-family:Arial;background:#f7f7f7;padding:40px;">

<div
style="background:white;padding:30px;border-radius:8px;">

<h2>Password Reset</h2>

<p>Hello ${name},</p>

<p>

Click below to reset your password.

</p>

<p>

<a href="${resetLink}">

Reset Password

</a>

</p>

</div>

</body>

</html>
`;