
import UserModel from '../dao/models/user.model.js';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;


export const createUser = async (data) => {
  const hash = await bcrypt.hash(data.password, SALT_ROUNDS);
  const user = new UserModel({
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
    age: data.age,
    password: hash,
    role: data.role || 'user'       
  });
  return await user.save();
};


export const findByEmail = async (email) => {
  return await UserModel.findOne({ email });
};


export const findById = async (id) => {
  return await UserModel.findById(id);
};


export const updatePassword = async (id, newPassword) => {
  const hash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  return await UserModel.findByIdAndUpdate(
    id,
    { password: hash },
    { new: true }          
  );
};


export const getAllUsers = async () => {
  
  return await UserModel.find({}, '-password');
};