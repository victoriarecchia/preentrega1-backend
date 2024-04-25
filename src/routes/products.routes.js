import { Router } from "express"
import { ProductManager } from "../products.js"

export const productsRoutes = Router()
const path = '../../products.json'
const productManager = new ProductManager(path)

productsRoutes.get('/', (req, res) => {
  const limit = +req.query.limit || 0; 
  const products = productManager.getProducts(limit)
  res.status(200).send({ origin: 'server1', payload: products })
})

// productsRoutes.post('/', (req, res) => {

// })

// productsRoutes.put('/', (req, res) => {

// })

// productsRoutes.delete('/', (req, res) => {

// })
