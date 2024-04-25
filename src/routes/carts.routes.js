import { Router } from "express"
import { CartManager } from '../cart.js'

export const cartsRoutes = Router()

const cartManager = new CartManager();

// Ruta raíz POST para crear un nuevo carrito
cartsRoutes.post('/', (req, res) => {
  try {
    const newCart = {
      id: generateUniqueId(), // Generar un ID único para el carrito
      products: [
        {
          "title": "Producto nuevo",
          "description": "Producto agregado desde el POST",
          "code": "A4",
          "price": 1500,
          "status": true,
          "category": 3,
          "id": 4
        }
      ]
    };
    cartManager.addCartItem(newCart);
    res.status(200).json(newCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta GET para listar los productos de un carrito específico
cartsRoutes.get('/:cid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartManager.getCartById(cartId);
    res.status(200).json(cart.products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta POST para agregar un producto al carrito
cartsRoutes.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = parseInt(req.body.quantity) || 1; // Si no se proporciona, se agrega un producto por defecto

    await cartManager.addProductToCart(cartId, productId, quantity);
    res.status(200).json({ message: 'Producto agregado al carrito correctamente.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function generateUniqueId() {
  return Math.floor(Math.random() * 1000000) + 1;
}

export default cartsRoutes;
