import * as productRepo from '../repositories/product.repository.js';

export const getAllProducts = async (req, res) => {
  const products = await productRepo.getAll();
  res.json({ status: 'success', payload: products });
};

export const getProductById = async (req, res) => {
  const { pid } = req.params;
  const product = await productRepo.getById(pid);
  if (!product) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
  res.json({ status: 'success', payload: product });
};


export const createProduct = async (req, res) => {
  const product = await productRepo.createProduct(req.body);
  res.status(201).json({ status: 'success', payload: product });
};

export const updateProduct = async (req, res) => {
  const { pid } = req.params;
  const updated = await productRepo.updateProduct(pid, req.body);
  if (!updated) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
  res.json({ status: 'success', payload: updated });
};


export const deleteProduct = async (req, res) => {
  const { pid } = req.params;
  const deleted = await productRepo.deleteProduct(pid);
  if (!deleted) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
  res.json({ status: 'success', message: 'Producto eliminado' });
};