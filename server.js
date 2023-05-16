const express = require('express');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const cors = require('cors');
const errorHandler = require("./middlewares/error");

// routes 
const userRoute = require('./routes/userRoute');
const productRoute = require('./routes/productRoute');

const app = express();

// static middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser())

const corsOptions = {
    origin: 'http://localhost:3000',
};
app.use(cors(corsOptions))

app.use("/uploads", express.static(path.join(__dirname, './uploads')));

// middleswares
app.use("/api/users", userRoute)
app.use("/api/products", productRoute)




app.use(errorHandler)

mongoose.connect(process.env.MONGO_URI).then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Conected to database and running on port ${process.env.PORT}`)
    })  
}).catch((error) => {
    console.log(error.message)
})


