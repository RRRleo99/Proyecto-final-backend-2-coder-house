import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Para obtener __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const productsFilePath = join(__dirname, '../../files/products.json');

class ProductFSManager {
  async getProducts() {
    try {
      const data = await fs.readFile(productsFilePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async getProductById(pid) {
    const products = await this.getProducts();
    return products.find(product => product.id === pid);
  }

  async addProduct(productData) {
    const products = await this.getProducts();
    const newProduct = {
      id: String(Date.now()),
      ...productData
    };
    products.push(newProduct);
    await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));
    return newProduct;
  }

  async updateProduct(pid, updateData) {
    const products = await this.getProducts();
    const index = products.findIndex(product => product.id === pid);
    if (index === -1) return null;
    products[index] = { ...products[index], ...updateData };
    await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));
    return products[index];
  }

  async deleteProduct(pid) {
    let products = await this.getProducts();
    const index = products.findIndex(product => product.id === pid);
    if (index === -1) return null;
    const deleted = products.splice(index, 1)[0];
    await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));
    return deleted;
  }
}

export default ProductFSManager;