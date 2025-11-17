import ProductManager from '../dao/productDBManager.js';

class ProductRepository {
  constructor() {
    this.dao = new ProductManager();
  }

  async getAll() {
    return await this.dao.getProducts();
  }

  async getById(id) {
    return await this.dao.getProductById(id);
  }

  async create(product) {
    return await this.dao.addProduct(product);
  }

  async update(id, data) {
    return await this.dao.updateProduct(id, data);
  }

  async delete(id) {
    return await this.dao.deleteProduct(id);
  }
}

export default ProductRepository;