import { Router } from "express"

export const cartsRoutes = Router()


  cartsRoutes.get('/', (req, res)  => {
    res.status(200).send({origin:'server1'})
  })
  
  cartsRoutes.post('/', (req, res) => {
    
  })

  cartsRoutes.put('/', (req, res) => {
    
  })

  cartsRoutes.delete('/', (req, res) => {
    
  })
