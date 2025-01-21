//Using Express
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const MONGO_URI = process.env.MONGO_URI;


//create an instance of express
const app = express();
app.use(express.json());



// Enable CORS for specific origin (change to your frontend URL)
const corsOptions = {
    origin: 'https://todo-frontend-three-theta.vercel.app', // Adjust with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Specify allowed headers
  };
  
  app.use(cors(corsOptions));  // Use the configured CORS options


//Sample in-memory storage for todo items
// let todos = [];

// connecting mongodb

if (!MONGO_URI) {
    console.error('Error: MONGO_URI is not defined. Check your .env file.');
    process.exit(1); // Exit the application
}


mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('DB Connected!'))
    .catch((err) => console.error('DB Connection Error:', err));


// mongoose.connect('mongodb://127.0.0.1:27017/mern-app')
//     .then(() => console.log('DB Connected!'))
//     .catch((err) => console.error('DB Connection Error:', err));


//creating schema
const todoSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String
    },
    description: String
})

//creating model
const todoModel = mongoose.model('Todo', todoSchema);

//Create a new todo item
app.post('/todos', async (req, res) => {
    const {title, description} = req.body;
    // const newTodo = {
    //     id: todos.length + 1,
    //     title,
    //     description
    // };
    // todos.push(newTodo);
    // console.log(todos);
    try {
        const newTodo = new todoModel({title, description});
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message});
    }
   

})

//Get all items
app.get('/todos', async (req, res) => {
    try {
        const todos = await todoModel.find();
        res.json(todos);
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message});
    }
})

// Update a todo item
app.put("/todos/:id", async (req, res) => {
    try {
        const {title, description} = req.body;
        const id = req.params.id;
        const updatedTodo = await todoModel.findByIdAndUpdate(
            id,
            { title , description},
            { new: true }
        )
    
        if (!updatedTodo) {
            return res.status(404).json({ message: "Todo not found"})
        }
        res.json(updatedTodo)
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message});
    }


})

// Delete a todo item
app.delete('/todos/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await todoModel.findByIdAndDelete(id);
        res.status(204).end();    
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message});
    }
   
})

//Start the server
const port = 8000;
app.listen(port, () => {
    console.log("Server is listening to port "+port);
})
