import ProductModel from '../dao/models/product.model.js';

class ProductManager {
  // Obtener todos los productos
  async getProducts() {
    return await ProductModel.find();
  }

  // Obtener un producto por ID
  async getProductById(pid) {
    return await ProductModel.findById(pid);
  }

  // Agregar un nuevo producto
  async addProduct(productData) {
    const newProduct = new ProductModel(productData);
    return await newProduct.save();
  }

  // Actualizar un producto por ID
  async updateProduct(pid, updateData) {
    return await ProductModel.findByIdAndUpdate(pid, updateData, { new: true });
  }

  // Eliminar un producto por ID
  async deleteProduct(pid) {
    return await ProductModel.findByIdAndDelete(pid);
  }
}

export default ProductManager;