import fs from 'fs'

export class ProductManager{
  constructor(path){
    this.path = path;
  }

  async getProducts(limit) {
    const products = await fs.promises.readFile(this.path, 'utf-8');
    const parsedProducts = await JSON.parse(products);
    this.products = parsedProducts;
    return limit === 0 ? parsedProducts : parsedProducts.slice(0, limit);
  }

  getProductById(id) {
    const products = this.loadProducts();
    const product = products.find(p => p.id === +id);
    if (!product) {
      throw new Error("Producto no encontrado.");
    }
    return product;
  }

  updateProduct(id, newData) {
    const products = this.loadProducts();
    const index = products.findIndex(product => product.id === id);
    if (index === -1) {
      throw new Error("Producto no encontrado.");
    }
    products[index] = { ...products[index], ...newData };
    this.saveProducts(products);
    console.log(`Producto con id ${id} actualizado.`);
  }

  deleteProductById(id) {
    let products = this.loadProducts();
    const index = products.findIndex(product => product.id === id);
    if (index === -1) {
      throw new Error("Producto no encontrado.");
    }
    products = products.filter(p => p.id !== id);
    this.saveProducts(products);
    console.log(`Producto con id ${id} eliminado.`);
  }

  loadProducts() {
    try {
      const data = fs.readFileSync(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  saveProducts(products) {
    try {
      fs.writeFileSync(this.path, JSON.stringify(products));
    } catch (error) {
      console.log("No se pudo guardar el archivo de productos:", error.message);
    }
  }
}
