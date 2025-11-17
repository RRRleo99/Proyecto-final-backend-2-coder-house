import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../dao/models/user.model.js';
import UserDTO from '../dtos/user.dto.js';
import { sendPasswordResetEmail } from '../utils/mail.js';


const createHash = (pwd) => bcrypt.hashSync(pwd, bcrypt.genSaltSync(10));
const isValidPassword = (plain, hash) => bcrypt.compareSync(plain, hash);


export const register = async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;
  try {
    const exist = await UserModel.findOne({ email });
    if (exist) {
      return res
        .status(400)
        .json({ status: 'error', message: 'El usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword
    });

    res
      .status(201)
      .json({
        status: 'success',
        message: 'Usuario registrado',
        user: new UserDTO(user)
      });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ status: 'error', message: 'Usuario no encontrado' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res
        .status(401)
        .json({ status: 'error', message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '2d' } // 2 días
    );

    // DTO sin password
    const dto = new UserDTO(user);
    res.json({ status: 'success', payload: { ...dto, token } });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};


export const current = (req, res) => {
 
  const dto = new UserDTO(req.user);
  res.json({ status: 'success', payload: dto });
};


export const passwordRecovery = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ status: 'error', message: 'Usuario no encontrado' });
    }

   
    const token = jwt.sign(
      { email: user.email }, 
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    
    await sendPasswordResetEmail(email, resetLink);

    res.json({
      status: 'success',
      message: 'Correo de recuperación enviado'
    });
  } catch (err) {
    console.error('🔴 passwordRecovery error:', err);
    res.status(500).json({ status: 'error', message: 'Server error' });
  }
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body; 

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findOne({ email: payload.email });
    if (!user) {
      return res
        .status(404)
        .json({ status: 'error', message: 'Usuario no encontrado' });
    }

    
    if (isValidPassword(newPassword, user.password)) {
      return res
        .status(400)
        .json({
          status: 'error',
          message: 'No podés usar la misma contraseña anterior'
        });
    }

    const hashed = createHash(newPassword);
    user.password = hashed;
    await user.save();

    res.json({
      status: 'success',
      message: 'Contraseña restablecida correctamente'
    });
  } catch (err) {
    console.error('🔴 resetPassword error:', err);
    
    res
      .status(400)
      .json({ status: 'error', message: 'Token inválido o expirado' });
  }
};


export const logout = (req, res) => {
  
  res.json({ status: 'success', message: 'Logged out' });
};