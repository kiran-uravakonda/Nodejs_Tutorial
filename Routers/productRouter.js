
import express from 'express';
import {getAllProducts,createNewProduct,getProductsById,updateProduct,deleteProduct,checkPostRequestBody} from '../Controllers/productController.js'
let route = express.Router();

// route.param('id',(req,res,next,value)=>{
//     console.log('the id is ' + value)
//     next()
// })



route.get('/api/v1/products',getAllProducts)


route.post('/api/v1/products',checkPostRequestBody,createNewProduct)


route.get('/api/v1/products/:id',getProductsById)


route.patch('/api/v1/products/:id',updateProduct)


route.delete('/api/v1/products/:id',deleteProduct)

export default route;



