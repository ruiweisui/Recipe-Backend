// reference libraries and files
import express from 'express';
import cors from 'cors';
import recipes from './api/recipes.route.js';

const app = express(); // middleware from express app

app.use(cors()); // cross origin resource sharing
app.use(express.json());

app.use(cors()); 
app.use(express.json());

app.use("/api/v1/recipes", recipes);
app.use('*', (req, res) => {
    res.status(404).json({error: "not found"});
})
export default app;