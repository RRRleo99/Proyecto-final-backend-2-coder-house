import CartModel from '../models/cart.model.js';

class CartManager {
  // Obtener todos los carritos
  async getCarts() {
    return await CartModel.find().populate('products.product');
  }

  // Obtener un carrito por ID
  async getCartById(cid) {
    return await CartModel.findById(cid).populate('products.product');
  }

  // Crear un nuevo carrito
  async createCart() {
    const newCart = new CartModel({ products: [] });
    return await newCart.save();
  }

  // Agregar producto a un carrito
  async addProductToCart(cid, pid) {
    const cart = await CartModel.findById(cid);
    if (!cart) return null;

    const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
    if (productIndex !== -1) {
      cart.products[productIndex].quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }
    await cart.save();
    return cart;
  }
}

export default CartManager;