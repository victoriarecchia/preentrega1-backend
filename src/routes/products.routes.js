import { Router } from "express"
import { ProductManager } from "../products.js"

export const productsRoutes = Router()

const productManager = new ProductManager()
const ID = 4;

// 1.La ruta raíz GET / deberá listar todos los productos de la base. (Incluyendo la limitación ?limit)
productsRoutes.get('/', async (req, res) => {
  try {
    const limit = +req.query.limit || 0;
    const products = await productManager.getProducts(limit);
    res.status(200).send({ origin: 'server1', payload: products });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// 2. La ruta GET /:pid deberá traer sólo el producto con el id proporcionado

productsRoutes.get('/:pid', async (req, res) => {
  try {
    const productId = await productManager.getProductById(req.params.pid)
    res.status(200).send({ origin: 'server1', payload: productId })
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

// 3. La ruta raíz POST / deberá agregar un nuevo producto con los campos
// id, title: String, description: String, code: String, price: Number, status: Boolean, stock: Number, category: String
productsRoutes.post('/', async (req, res) => {
  try {
    let newProduct = {
      title: 'Producto nuevo',
      description: 'Producto agregado desde la ruta',
      code: 'A4',
      price: 1500,
      status: true,
      category: 3
    }
    productManager.addProduct(newProduct)
    res.status(200).send({ origin: 'server1', payload: newProduct })
  } catch (error) {
    res.status(500).send({ error: error.message })
  }
})

// La ruta PUT /:pid deberá tomar un producto y actualizarlo por los campos enviados desde body. NUNCA se debe actualizar o eliminar el id al momento de hacer dicha actualización
// productsRoutes.put('/:pid', (req, res) => {
// Ruta para actualizar un producto por su ID
// Ruta para actualizar un producto por su ID
productsRoutes.put('/:pid', async (req, res) => {
  try {
    // Extraer el ID del producto de los parámetros de la solicitud
    const productId = parseInt(req.params.pid);

    // Obtener el producto existente por su ID
    const existingProduct = await productManager.getProductById(productId);

    // Validar que el producto exista
    if (!existingProduct) {
      return res.status(404).json({ error: "Producto no encontrado." });
    }

    // Extraer los campos a actualizar del cuerpo de la solicitud
    const { title, description, code, price, status, stock, category } = req.body;

    // Actualizar los campos del producto existente con los valores proporcionados
    if (title !== undefined) existingProduct.title = title; 
    if (description !== undefined) existingProduct.description = description;
    if (code !== undefined) existingProduct.code = code;
    if (price !== undefined) existingProduct.price = price;
    if (status !== undefined) existingProduct.status = status;
    if (stock !== undefined) existingProduct.stock = stock;
    if (category !== undefined) existingProduct.category = category;

    // Guardar los cambios en el archivo de productos
    await productManager.updateProduct(productId, existingProduct);

    res.status(200).json(existingProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
