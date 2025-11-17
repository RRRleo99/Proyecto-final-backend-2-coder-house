import { Router } from 'express';
import CartRepository from '../repositories/cart.repository.js';
import ProductRepository from '../repositories/product.repository.js';
import TicketRepository from '../repositories/ticket.repository.js';
import { authorizeRole } from '../middlewares/authorization.js';
import { v4 as uuidv4 } from 'uuid';

const router = Router();
const cartRepo = new CartRepository();
const productRepo = new ProductRepository();
const ticketRepo = new TicketRepository();


router.get('/', async (req, res) => {
  try {
    const carts = await cartRepo.getAll();
    res.json({ status: 'success', carts });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});


router.get('/:cid', async (req, res) => {
  try {
    const cart = await cartRepo.getById(req.params.cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    res.json({ status: 'success', cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const newCart = await cartRepo.create();
    res.status(201).json({ status: 'success', cart: newCart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});


router.post('/:cid/product/:pid', authorizeRole('user'), async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const updatedCart = await cartRepo.addProductToCart(cid, pid);
    res.json({ status: 'success', cart: updatedCart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

router.post('/:cid/purchase', authorizeRole('user'), async (req, res) => {
  const { cid } = req.params;
  const cart = await cartRepo.getById(cid);
  if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

  let total = 0;
  let productsNoStock = [];

  for (const item of cart.products) {
    const product = await productRepo.getById(item.product._id);
    if (product && product.stock >= item.quantity) {
      total += product.price * item.quantity;
      await productRepo.update(product._id, { stock: product.stock - item.quantity });
    } else {
      productsNoStock.push(item.product._id);
    }
  }

  if (total > 0) {
    const ticket = await ticketRepo.create({
      code: uuidv4(),
      amount: total,
      purchaser: req.user.email 
    });
    res.json({ status: 'success', ticket, productsNoStock });
  } else {
    res.status(400).json({ status: 'error', message: 'No hay productos con stock suficiente', productsNoStock });
  }
});

export default router;