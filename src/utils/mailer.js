import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER, // tu email
    pass: process.env.MAIL_PASS  // tu contraseña o app password
  }
});

export const sendPasswordResetEmail = async (to, link) => {
  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to,
    subject: 'Recuperación de contraseña',
    html: `<p>Hacé click en el siguiente enlace para restablecer tu contraseña (válido por 1 hora):</p>
           <a href="${link}">${link}</a>`
  });
};