import express from 'express';
import {getAllMovies,postMovies,checkBodyData,getMoviesById,updateMovieById,deleteAllMovies,deleteMovieById,getMovieStats,getMovieByGenres} from '../Controllers/movieController.js'
import {protect,restrict} from '../Controllers/userController.js'
let movieRoute=express.Router();

movieRoute.get('/api/v1/movies',protect,getAllMovies);
movieRoute.get('/api/v1/movies/stats',getMovieStats);
movieRoute.post('/api/v1/movies',checkBodyData,postMovies);
movieRoute.get('/api/v1/movies/genres/:genere',getMovieByGenres);
movieRoute.get('/api/v1/movies/:id',getMoviesById);
movieRoute.put('/api/v1/movies/:id',updateMovieById);
movieRoute.delete('/api/v1/movies',deleteAllMovies);
movieRoute.delete('/api/v1/movies/:id',protect,restrict('admin'),deleteMovieById);

export default movieRoute;