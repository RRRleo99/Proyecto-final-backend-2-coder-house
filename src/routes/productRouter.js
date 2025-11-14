import { Router } from 'express';
import ProductManager from '../dao/dbManagers/ProductManager.js';

const router = Router();
const productManager = new ProductManager();

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.json({ status: 'success', products });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Obtener un producto por ID
router.get('/:pid', async (req, res) => {
  try {
    const product = await productManager.getProductById(req.params.pid);
    if (!product) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    res.json({ status: 'success', product });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Crear un nuevo producto
router.post('/', async (req, res) => {
  try {
    const newProduct = await productManager.addProduct(req.body);
    res.status(201).json({ status: 'success', product: newProduct });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Actualizar un producto por ID
router.put('/:pid', async (req, res) => {
  try {
    const updatedProduct = await productManager.updateProduct(req.params.pid, req.body);
    if (!updatedProduct) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    res.json({ status: 'success', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Eliminar un producto por ID
router.delete('/:pid', async (req, res) => {
  try {
    const deletedProduct = await productManager.deleteProduct(req.params.pid);
    if (!deletedProduct) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    res.json({ status: 'success', message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;