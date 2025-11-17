// src/utils/mailer.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// ---------------------------------------------------------------
// CARGAR .env  (esto debe ejecutarse **antes** de usar process.env)
// ---------------------------------------------------------------
dotenv.config();   // <-- carga .env una sola vez

// ---------------------------------------------------------------
// CONFIGURACIÓN DEL TRANSPORTADOR
// ---------------------------------------------------------------
// Si usas Gmail (requiere App‑Password) → service: 'gmail'
// Si prefieres Mailtrap (ideal para pruebas) cambia a la configuración de abajo
// ---------------------------------------------------------------
const transporter = nodemailer.createTransport({
  service: 'gmail',               // <-- cambiar a 'Mailtrap' si lo usas
  auth: {
    user: process.env.MAIL_USER, // <-- se lee del .env
    pass: process.env.MAIL_PASS  // <-- se lee del .env
  }
});

/**
 * Envía el email de recuperación de contraseña.
 * @param {string} to   Dirección del destinatario
 * @param {string} link Enlace que contiene el token
 */
export const sendPasswordResetEmail = async (to, link) => {
  // -------------------  DEBUG (opcional) -------------------
  console.log('📧 Enviando email a:', to);
  console.log('🔐 MAIL_USER =', process.env.MAIL_USER);
  console.log('🔐 MAIL_PASS =', process.env.MAIL_PASS ? '***' : undefined);
  // -------------------------------------------------------

  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to,
    subject: 'Recuperación de contraseña',
    // Puedes usar `text` o `html`. Aquí usamos HTML para que el link sea clickeable.
    html: `
      <p>Hacé click en el siguiente enlace para restablecer tu contraseña (válido 1 h):</p>
      <a href="${link}">${link}</a>
      <p>Si no solicitaste este cambio, podés ignorar este mensaje.</p>
    `
  });
};