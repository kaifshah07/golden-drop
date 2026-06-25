export const sendEmail = async (
  to: string,
  subject: string,
  message: string
) => {
  // For now just log (we will upgrade to nodemailer later)
  console.log("📧 EMAIL SENT");
  console.log("To:", to);
  console.log("Subject:", subject);
  console.log("Message:", message);

  return true;
};