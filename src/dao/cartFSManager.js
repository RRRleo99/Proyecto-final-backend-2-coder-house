import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const cartsFilePath = join(__dirname, '../../files/carts.json');

class CartFSManager {
  async getCarts() {
    try {
      const data = await fs.readFile(cartsFilePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async getCartById(cid) {
    const carts = await this.getCarts();
    return carts.find(cart => cart.id === cid);
  }

  async createCart() {
    const carts = await this.getCarts();
    const newCart = {
      id: String(Date.now()),
      products: []
    };
    carts.push(newCart);
    await fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2));
    return newCart;
  }

  async addProductToCart(cid, pid) {
    const carts = await this.getCarts();
    const cart = carts.find(cart => cart.id === cid);
    if (!cart) return null;

    const productIndex = cart.products.findIndex(p => p.product === pid);
    if (productIndex !== -1) {
      cart.products[productIndex].quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }
    await fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2));
    return cart;
  }
}

export default CartFSManager;