import fs from 'fs'

export class ProductManager {
  constructor() {
    this.path = '../products.json';
  }

  addProduct(newProduct) {
    const products = this.loadProducts();
    let existe = products.some(product => product.code === newProduct.code)
    if (existe) {
      console.log(`Error, no se puede agregar el producto "${newProduct.title}" porque el codigo esta repetido`);
    } else {
      newProduct.id = products.length + 1;
      products.push(newProduct);
      this.saveProducts(products);
      console.log(`Producto "${newProduct.title}" agregado correctamente.`);
    }
  }

  async getProducts(limit) {
    try {
      const productsData = await fs.promises.readFile(this.path, 'utf-8');
      const products = JSON.parse(productsData);
      return limit === 0 ? products : products.slice(0, limit);
    } catch (error) {
      throw new Error(`Error al leer el archivo de productos: ${error.message}`);
    }
  }


  getProductById(id) {
    const products = this.loadProducts();
    const product = products.find(p => p.id === +id);
    if (!product) {
      throw new Error("Producto no encontrado.");
    }
    return product;
  }

  
  async addProductToCart(cartId, productId, quantity) {
    try {
      let carts = await this.loadCarts();
      const index = carts.findIndex(cart => cart.id === cartId);
      if (index === -1) {
        throw new Error("Carrito no encontrado.");
      }

      const cart = carts[index];
      const existingProduct = cart.products.find(product => product.id === productId);

      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.products.push({ id: productId, quantity });
      }

      await this.saveCarts(carts);
    } catch (error) {
      throw new Error(`Error al agregar producto al carrito: ${error.message}`);
    }
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
