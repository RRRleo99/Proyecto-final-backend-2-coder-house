import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export default function jwtAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ status: 'error', message: 'Missing token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // Guardamos solo lo necesario
    req.user = {
      id: payload.id,
      email: payload.email,
      role: payload.role
    };
    next();
  } catch (err) {
    res.status(401).json({ status: 'error', message: 'Invalid token' });
  }
}