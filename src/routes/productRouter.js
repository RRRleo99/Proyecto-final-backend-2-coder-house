import { Router } from 'express';
import ProductRepository from '../repositories/product.repository.js';
import { authorizeRole } from '../middlewares/authorization.js';

const router = Router();
const productRepo = new ProductRepository();

router.get('/', async (req, res) => {
  try {
    const products = await productRepo.getAll();
    res.json({ status: 'success', products });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});


router.get('/:pid', async (req, res) => {
  try {
    const product = await productRepo.getById(req.params.pid);
    if (!product) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    res.json({ status: 'success', product });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});


router.post('/', authorizeRole('admin'), async (req, res) => {
  try {
    const newProduct = await productRepo.create(req.body);
    res.status(201).json({ status: 'success', product: newProduct });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});


router.put('/:pid', authorizeRole('admin'), async (req, res) => {
  try {
    const updatedProduct = await productRepo.update(req.params.pid, req.body);
    if (!updatedProduct) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    res.json({ status: 'success', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});


router.delete('/:pid', authorizeRole('admin'), async (req, res) => {
  try {
    const deletedProduct = await productRepo.delete(req.params.pid);
    if (!deletedProduct) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    res.json({ status: 'success', message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;