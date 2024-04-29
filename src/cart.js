import fs from 'fs';

export class CartManager {
  constructor() {
    this.path = '../carts.json';
  }

  async addCartItem(newCartItem) {
    try {
      const carts = await this.loadCarts();
      const exists = carts.some(cart => cart.id === newCartItem.id);
      if (exists) {
        console.log(`Error: el carrito con el ID ${newCartItem.id} ya existe.`);
      } else {
        carts.push(newCartItem);
        await this.saveCarts(carts);
        console.log(`Carrito con ID ${newCartItem.id} agregado correctamente.`);
      }
    } catch (error) {
      console.log(`Error al agregar el carrito: ${error.message}`);
    }
  }


  async getAllCarts(limit = 0) {
    try {
      const cartsData = await fs.promises.readFile(this.path, 'utf-8');
      const carts = JSON.parse(cartsData);
      return limit === 0 ? carts : carts.slice(0, limit);
    } catch (error) {
      throw new Error(`Error al leer los carritos: ${error.message}`);
    }
  }

  async addProductToCart(cartId, productId, quantity) {
    try {
        const carts = await this.loadCarts();
        const cartIndex = carts.findIndex(cart => cart.id === cartId);
        if (cartIndex === -1) {
            throw new Error(`El carrito con ID ${cartId} no existe.`);
        }
        const productIndex = carts[cartIndex].products.findIndex(product => product.id === productId);
        if (productIndex !== -1) {
            // Si el producto ya está en el carrito, actualizar la cantidad
            carts[cartIndex].products[productIndex].quantity += quantity;
        } else {
            // Si el producto no está en el carrito, agregarlo como un nuevo elemento
            carts[cartIndex].products.push({
                id: productId,
                quantity: quantity
            });
        }
        await this.saveCarts(carts);
        console.log(`Producto con ID ${productId} agregado al carrito con ID ${cartId} correctamente.`);
    } catch (error) {
        console.log(`Error al agregar el producto al carrito: ${error.message}`);
    }
}

  async getCartById(id) {
    try {
      const carts = await this.loadCarts();
      const cart = carts.find(c => c.id === +id);
      if (!cart) {
        throw new Error("Carrito no encontrado.");
      }
      return cart;
    } catch (error) {
      throw new Error(`Error al obtener el carrito: ${error.message}`);
    }
  }

  async updateCart(id, newData) {
    try {
      const carts = await this.loadCarts();
      const index = carts.findIndex(cart => cart.id === id);
      if (index === -1) {
        throw new Error("Carrito no encontrado.");
      }
      carts[index] = { ...carts[index], ...newData };
      await this.saveCarts(carts);
      console.log(`Carrito con ID ${id} actualizado.`);
    } catch (error) {
      console.log(`Error al actualizar el carrito: ${error.message}`);
    }
  }

  async deleteCartItemById(id) {
    try {
      let carts = await this.loadCarts();
      const index = carts.findIndex(cart => cart.id === id);
      if (index === -1) {
        throw new Error("Carrito no encontrado.");
      }
      carts = carts.filter(cart => cart.id !== id);
      await this.saveCarts(carts);
      console.log(`Carrito con ID ${id} eliminado.`);
    } catch (error) {
      console.log(`Error al eliminar el carrito: ${error.message}`);
    }
  }

  async addProductToCart(cartId, productId, quantity) {
// completar
  }

  async loadCarts() {
    try {
      const data = await fs.promises.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.log(`Error al cargar los carritos: ${error.message}`);
      return [];
    }
  }

  async saveCarts(carts) {
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(carts));
    } catch (error) {
      console.log(`Error al guardar los carritos: ${error.message}`);
    }
  }
  
}

