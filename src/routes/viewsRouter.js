import { Router } from 'express';
import ProductManager from '../dao/productDBManager.js';

const router = Router();
const productManager = new ProductManager();

// Vista principal con listado de productos
router.get('/', async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render('home', { products });
  } catch (error) {
    res.status(500).send('Error al cargar la página principal');
  }
});

// Vista de carritos (puede variar según tu lógica)
router.get('/carts/:cid', async (req, res) => {
  try {
    // Si tenés un CartManager, podés importarlo y usarlo aquí
    // Ejemplo:
    // const cart = await cartManager.getCartById(req.params.cid);
    // res.render('cart', { cart });

    res.render('cart', { cartId: req.params.cid }); // Placeholder
  } catch (error) {
    res.status(500).send('Error al cargar el carrito');
  }
});

export default router;