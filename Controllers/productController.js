import fs from 'fs'
let data=JSON.parse(fs.readFileSync('./Data/products.json','utf-8'))
export function getAllProducts(req,res){
    res.send(data)
}

export function checkPostRequestBody(req,res,next){
  
        if(!req.body.name && !req.body.price){
            res.status(400).json({message:"please enter the body when you create a product"})
        }
        else{
            next()
        }
}

export function  createNewProduct(req,res){
    let newId=data[data.length-1].id+1;
    let newProduct=Object.assign({id:newId},req.body)
    data.push(newProduct)
    fs.writeFile('./Data/products.json',JSON.stringify(data),(err)=>{
        if(err){
            console.log(err.message)
        }
        else{
            console.log("sucessfully created")
        }
    })
    res.status(201).send(newProduct)
}


export function getProductsById(req,res){
 
    let check=data.find((val)=>{
        return val.id===Number(req.params.id)
    })
    if(check){
        res.send(check)
    }
    else{
        res.status(400).json({message:"can't find the id"})
    }
   
}


export function updateProduct(req,res){
    let id=req.params.id*1
    let productToUpdate=data.find(el=>el.id===id)
    if(!productToUpdate){
        return res.status(400).json({
            status:'failed',
            message:`can't find the ${id} id `
        })
    }

    let index=data.indexOf(productToUpdate);
    Object.assign(productToUpdate,req.body);
    data[index]=productToUpdate;
    fs.writeFile('./Data/products.json',JSON.stringify(data),(err)=>{
        res.send(productToUpdate)
    })
}

export function deleteProduct(req,res){
    let id=req.params.id*1
    let productToDelete=data.find(el=>el.id===id)
    if(!productToDelete){
        return res.status(400).json({
            status:'failed',
            message:`no product id to  find the ${id} id  to delete`
        })
    }

    let index=data.indexOf(productToDelete);

    data.splice(index,1)
    fs.writeFile('./Data/products.json',JSON.stringify(data),(err)=>{
        res.status(204).json({message:"successful"})
    })

}

