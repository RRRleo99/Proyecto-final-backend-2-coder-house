import CartManager from '../dao/cartDBManager.js';

class CartRepository {
  constructor() {
    this.dao = new CartManager();
  }

  async getAll() {
    return await this.dao.getCarts();
  }

  async getById(id) {
    return await this.dao.getCartById(id);
  }

  async create() {
    return await this.dao.createCart();
  }

  async addProductToCart(cid, pid) {
    return await this.dao.addProductToCart(cid, pid);
  }
}

export default CartRepository;