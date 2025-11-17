import { Router } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../dao/models/user.model.js';
import UserDTO from '../dtos/user.dto.js';
import { sendPasswordResetEmail } from '../utils/mailer.js';

const router = Router();

// Registro
router.post('/register', async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;
  try {
    const exist = await UserModel.findOne({ email });
    if (exist) return res.status(400).json({ status: 'error', message: 'El usuario ya existe' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword
    });

    res.status(201).json({ status: 'success', message: 'Usuario registrado', user: new UserDTO(user) });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(400).json({ status: 'error', message: 'Usuario no encontrado' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ status: 'error', message: 'Contraseña incorrecta' });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ status: 'success', message: 'Login exitoso', token });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Ruta protegida /current usando DTO
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ status: 'success', user: new UserDTO(req.user) });
});

// Recuperación de contraseña - solicitar mail
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  const link = `http://localhost:8080/api/sessions/reset-password/${token}`;
  await sendPasswordResetEmail(email, link);

  res.json({ status: 'success', message: 'Correo de recuperación enviado' });
});

// Recuperación de contraseña - resetear
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findOne({ email: payload.email });
    if (!user) return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });

    const isSame = await bcrypt.compare(password, user.password);
    if (isSame) return res.status(400).json({ status: 'error', message: 'No podés usar la misma contraseña anterior' });

    const hashed = await bcrypt.hash(password, 10);
    user.password = hashed;
    await user.save();

    res.json({ status: 'success', message: 'Contraseña restablecida correctamente' });
  } catch (error) {
    res.status(400).json({ status: 'error', message: 'Token inválido o expirado' });
  }
});

export default router;