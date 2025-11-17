import * as cartRepo from '../repositories/cart.repository.js';
import * as productRepo from '../repositories/product.repository.js';
import * as ticketRepo from '../repositories/ticket.repository.js';
import { v4 as uuidv4 } from 'uuid';


export const getCart = async (req, res) => {
  const { cid } = req.params;
  const cart = await cartRepo.getCartById(cid);
  if (!cart) return res.status(404).json({ status: 'error', message: 'Cart not found' });
  res.json({ status: 'success', payload: cart });
};

// -------------------------------------------------------------------
// POST /api/carts/:cid/products/:pid   (user)
// -------------------------------------------------------------------
export const addProductToCart = async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity = 1 } = req.body;
  await cartRepo.addProduct(cid, pid, quantity);
  res.json({ status: 'success', message: 'Producto agregado al carrito' });
};

export const purchaseCart = async (req, res) => {
  const { cid } = req.params;
  const userEmail = req.user.email; 

  const cart = await cartRepo.getCartById(cid);
  if (!cart) return res.status(404).json({ status: 'error', message: 'Cart not found' });

  let total = 0;
  const purchased = [];
  const notPurchased = [];

  
  for (const item of cart.products) {
    const product = await productRepo.getById(item.product._id);
    if (!product) {
      notPurchased.push({ productId: item.product._id, reason: 'Product not found' });
      continue;
    }

    if (product.stock >= item.quantity) {
    
      product.stock -= item.quantity;
      await productRepo.updateProduct(product._id, { stock: product.stock });
      total += product.price * item.quantity;
      purchased.push({ product: product._id, quantity: item.quantity });
    } else {
      notPurchased.push({
        productId: product._id,
        requested: item.quantity,
        available: product.stock
      });
    }
  }

  if (purchased.length === 0) {
    return res.status(400).json({
      status: 'error',
      message: 'No products could be purchased due to insufficient stock',
      notPurchased
    });
  }

  // crear ticket, creo que aqui tengo un problema profe
  const ticket = {
    code: `TCK-${uuidv4()}`,
    amount: total,
    purchaser: userEmail,
    products: purchased,
    status: 'completed'
  };
  const savedTicket = await ticketRepo.createTicket(ticket);

  const remaining = cart.products.filter(item =>
    notPurchased.some(np => np.productId?.toString() === item.product._id.toString())
  );
  await cartRepo.updateCart(cid, { products: remaining });

  res.json({
    status: 'success',
    message: 'Purchase completed',
    ticket: savedTicket,
    notPurchased
  });
};