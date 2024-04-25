// import fs from 'fs/promises';

// async function fileRead(){
//     try{
//         let res=await fs.readFile('Files/data.txt','utf-8')
//         console.log(res)
//     }
//     catch(error){
//         console.log(error)

//     }
// }
// fileRead()
// fs.readFile('Files/data.txt','utf-8',(err,res)=>{
//    console.log(res);
//    fs.readFile(`Files/${res}.txt`,'utf-8',(err1,res1)=>{
//     console.log(res1)
//     fs.readFile(`Files/append.txt`,'utf-8',(err2,res2)=>{
//         console.log(res2)
//         fs.writeFile('Files/output.txt',`${res2}\n\n ${res1}\n \n ${new Date()}`,()=>{
//             console.log("file created successfully")
//         })
//     })
//    })
// })

// import fs from 'fs'
// import express, { json } from 'express';
// let app = express();
// // app.get(['/', '/home', '/contact', '/about','/products'], (req, res) => {
// //     let path = req.url;
// //     switch (path) {
// //         case '/': case '/home': {
// //             // res.set({'Content-Type':'json' ,'my-header':"hello kiran"} )
// //             res.set('Content-Type', 'application/json');
// //             res.set('My-Header', 'heloo kiran');
// //             res.send("this is home page"); break;
// //         }
// //         case '/contact': res.send("this is contact page"); break;
// //         case '/about': res.send("this is about page"); break;
// //         case '/products':
// //             {
// //             fs.readFile('./Data/products.json','utf-8',(err,data)=>{
// //                      if(err){
// //                         res.send(err)
// //                      }
// //                      else{
// //                         res.send(data)
// //                      }
// //             })
           
            
            
// //         };
// //         break;

// //         default: res.send("couldn't get the response for the url")

// //     }
// // })
// // app.get('*', (req, res) => {
// //     res.send("Couldn't get the response for the URL");
// // });


// app.get('/get',(req,res)=>{
//     res.send("second number")
// })
// app.listen(7000, () => {
//     console.log("server running on 9000 port")
// })













//CRUD APIS WITHOUT USING DATABASE SOURCE

// import fs from 'fs'
// import express from 'express';
// let app = express();
// app.use(express.json())
// let data=JSON.parse(fs.readFileSync('./Data/products.json','utf-8'))

// app.get('/api/v1/products',(req,res)=>{
//     res.send(data)
// })

// app.post('/api/v1/products',(req,res)=>{
//     let newId=data[data.length-1].id+1;
//     let newProduct=Object.assign({id:newId},req.body)
//     data.push(newProduct)
//     fs.writeFile('./Data/products.json',JSON.stringify(data),(err)=>{
//         if(err){
//             console.log(err.message)
//         }
//         else{
//             console.log("sucessfully created")
//         }
//     })
//     res.status(201).send(data)
// })


// app.get('/api/v1/products/:id',(req,res)=>{
 
//     let check=data.find((val)=>{
//         console.log(val)
//         return val.id===Number(req.params.id)
//     })
//     console.log(check)
//     if(check){
//         res.send(check)
//     }
//     else{
//         res.status(400).json({message:"can't find the id"})
//     }
   
// })


// app.patch('/api/v1/products/:id',(req,res)=>{
//     let id=req.params.id*1
//     let productToUpdate=data.find(el=>el.id===id)
//     if(!productToUpdate){
//         return res.status(400).json({
//             status:'failed',
//             message:`can't find the ${id} id `
//         })
//     }

//     let index=data.indexOf(productToUpdate);
//     Object.assign(productToUpdate,req.body);
//     data[index]=productToUpdate;
//     fs.writeFile('./Data/products.json',JSON.stringify(data),(err)=>{
//         res.send(productToUpdate)
//     })
// })


// app.delete('/api/v1/products/:id',(req,res)=>{
//     let id=req.params.id*1
//     let productToDelete=data.find(el=>el.id===id)
//     if(!productToDelete){
//         return res.status(400).json({
//             status:'failed',
//             message:`no product id to  find the ${id} id  to delete`
//         })
//     }

//     let index=data.indexOf(productToDelete);

//     data.splice(index,1)
//     fs.writeFile('./Data/products.json',JSON.stringify(data),(err)=>{
//         res.status(204).json({message:"successful"})
//     })

// })

// app.listen(7000, () => {
//     console.log("server running on 9000 port")
// })


//MIDDDLEWARES

// import express from 'express';
// import morgan from 'morgan'
// let app = express();

// let middlewareFunction=(req,res,next)=>{
//     console.log("first execute the middleware function");
//     next()
// }

// app.use(morgan('dev'))


// app.use(middlewareFunction)

// app.use((req,res,next)=>{
//       req.date=new Date()
//      next()
// })
// app.get('/get',(req,res)=>{
//       res.status(200).json({requestedAt:req.date,message:"welcome to nodejs course"})
// })




// app.listen(7000, () => {
//     console.log("server running on 9000 port")
// })










//make the MVC structure for the above CRUD operations


import express from 'express';
import route from './Routers/productRouter.js'
import movieRoute from './Routers/movieRouter.js'
import userRouter from './Routers/userRouter.js';
import dotenv from 'dotenv';
import connectDB from './db/connectDB.js';
dotenv.config({path:'./config.env'})
let app = express();
let port=process.env.PORT||8000
// console.log(app.get('env'))
// console.log(process.env)
app.use(express.json())
app.use(express.static('./public'))
app.use('/',route)  //productRouter
app.use('/',movieRoute) //movieRouter
app.use('/',userRouter) //userRouter

app.all('*',(req,res,next)=>{
    res.status(404).json({
        status:"failed",
        message:`can't find the ${req.url} from the server`
    })
})

app.listen(port, () => {
    connectDB()
    console.log(`server running on ${port} port`)
})

