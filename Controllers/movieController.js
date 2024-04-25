import Movie from '../Model/movieModel.js'
import  ApiFeatures  from '../utlis/apiFeatures.js';
export const checkBodyData = async (req, res, next) => {
    if (!req.body.name || !req.body.duration) {
        res.status(400).json({ message: 'not a valid data or pass the req to the body' })
    }
    else {
        next();
    }
}
export const getAllMovies = async (req, res) => {
    try {

        const features = new ApiFeatures(Movie.find(), req.query).filter().sort().paginate().limitFields()
        
        let getMovies=await features.query

        //mongoose 6.0 or less
        // let excludeFields=['sort','page','limit']
        // let newObj={...req.query}
        //  excludeFields.forEach((el)=>{
        //     delete newObj[el]
        //  })

        //applying filter method===========

        // let queryStr=JSON.stringify(req.query)
        // queryStr=queryStr.replace(/\b(gte|gt|lte|lt)\b/g,(match)=>`$${match}`);
        // let queryObj=JSON.parse(queryStr)

        // let getMovies = await Movie.find(queryObj)

        //using mongoose query method=================

        // let getMovies = await Movie.find()
        //                 .where('duration').equals(req.query.duration)
        //                 .where('totalRating').equals(req.query.totalRating)

        //for sorting query==============

        // let query =  Movie.find()
        // if(req.query.sort){
        //     const sortBy=req.query.sort.split(',').join(' ')
        //     console.log(sortBy)
        //     query=query.sort(sortBy)

        // }
        // else{
        //     query=query.sort('-creditedAt')
        // }

        //limiting the fields========

        // let query= Movie.find()
        // if(req.query.fields){
        //     let fields=req.query.fields.split(',').join(' ')
        //     query=query.select(fields)
        // }

        //PAGINATION==========

        // let page=req.query.page*1||1;
        // let limit=req.query.limit*1||10;
        // let skip=(page-1)*limit
        // let query=Movie.find()

        // query=query.skip(skip).limit(limit)
        //  if(req.query.page){
        //     let totalMoviesCount=await Movie.countDocuments()
        //     if(skip>=totalMoviesCount){
        //           throw new Error("thia page is not find")
        //     }
        //  }
        // let getMovies=await query


        // let query = Movie.find()
        // query = query.limit(req.query.limit).sort(req.query.sort)

        // let getMovies = await query
        res.status(200).json({ records: getMovies.length, data: getMovies })
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export const postMovies = async (req, res) => {
    try {
        let newData = await Movie.create(req.body)
        res.status(201).json({ message: newData })
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export const getMoviesById = async (req, res) => {
    try {
        let id = req.params.id
        
        let getMovieById = await Movie.findById(id)
       
        if (getMovieById.id === id) {
            res.status(200).send(getMovieById)
        }
        else {
            res.status(400).json({ message: "id is not match with the movie's id" })
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
}


export const updateMovieById = async (req, res) => {
    try {
        let id = req.params.id
        let updateMovieById = await Movie.findByIdAndUpdate(id, req.body, { new: true,runValidators:true })

        res.status(200).send(updateMovieById)


    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export const deleteAllMovies = async (req, res) => {
    try {

        let deleteAllMovies = await Movie.deleteMany()
        res.status(204).json({ message: "movie deleted succesfully" })
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export const deleteMovieById = async (req, res) => {
    try {
        let id = req.params.id
        let deleteMovieById = await Movie.findByIdAndDelete(id)
        res.status(204).json({ message: "movie deleted succesfully" })
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
}


export const getMovieStats = async (req, res) => {
    try {
        let newData = await Movie.aggregate([
            {$match:{ratings:{$gte:7}}},
            {$group:{
                _id:'$releaseYear',
                minPrice:{$min:'$price'},
                avgRating:{$avg:"$ratings"},
                maxPrice:{$max:'$price'},
                sumPrice:{$sum:'$price'},
                movieCount:{$sum:1}
            }},
            {$sort:{maxPrice:1}},
            {$match:{maxPrice:{$gte:900}}}
        ])
        res.status(200).json({ records:newData.length,message: newData })
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
}


export const getMovieByGenres = async (req, res) => {
    try {
        let newData = await Movie.aggregate([
            {$unwind:'$genres'},
            {$group:{
                _id:'$genres',
                moviecount:{$sum:1},
                Movies:{$push:'$name'}
            }},
            {$addFields:{genere:'$_id'}},
            {$project:{_id:0}},
            {$sort:{moviecount:1}},
            {$limit:6},
            {$match:{genere:req.params.genere}}
        ])
        res.status(200).json({ records:newData.length,message: newData })
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
}




