import express from 'express';
import { config } from './config.js';
import {productsRoutes} from '../src/routes/products.routes.js'
import { cartsRoutes } from './routes/carts.routes.js';
import fs from 'fs'


const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/api/carts', cartsRoutes)
app.use('/api/products', productsRoutes)
app.use('/static', express.static(`${config.DIRNAME}/public`))

app.listen(config.PORT, () => {
  console.log(`Servidor activo en el puerto ${config.PORT}`);
})
