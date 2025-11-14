import { Router } from 'express';
import CartManager from '../dao/dbManagers/CartManager.js';

const router = Router();
const cartManager = new CartManager();

// Obtener todos los carritos
router.get('/', async (req, res) => {
  try {
    const carts = await cartManager.getCarts();
    res.json({ status: 'success', carts });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Obtener un carrito por ID
router.get('/:cid', async (req, res) => {
  try {
    const cart = await cartManager.getCartById(req.params.cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    res.json({ status: 'success', cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Crear un nuevo carrito
router.post('/', async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json({ status: 'success', cart: newCart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// Agregar producto a un carrito
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const updatedCart = await cartManager.addProductToCart(cid, pid);
    res.json({ status: 'success', cart: updatedCart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;