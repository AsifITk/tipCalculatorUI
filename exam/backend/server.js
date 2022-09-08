require('dotenv').config();
const express = require("express");
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const morgan = require('morgan');
const app = express();
const userRouter = require("./routes/userRoutes");
// const orderRouter = require('./routes/orderRoutes')
// const restaurantRouter = require("./routes/restaurantRoutes")

//! mongoose connection setup
mongoose
    .connect(
        "mongodb+srv://admin:admin@cluster0.pgc5juk.mongodb.net/?retryWrites=true&w=majority",
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    )
    .then(async () => {
        console.log("Connected to MongoDB...");
    })

    .catch((err) => console.log("Could not connect to MongoDB...", err));

app.use(express.json())

app.use(cors());
app.use(morgan('dev'));
app.use(express.static('public'));
app.use("/auth", userRouter);
// app.use("/order", orderRouter);
// app.use("/restraurant", restaurantRouter);
app.listen(8000);


function authenticateRequest(req, res, next) {
    const authHeaderInfo = req.headers.authorization;

    if (!authHeaderInfo) {
        return res.status(401).json({
            msg: "No Token Provided"
        });

    }
    const token = authHeaderInfo.split(' ')[1];
    console.log(token);
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = decoded;
        next()
    }
    catch (err) {
        res.send(401).send("Invalid Token Provided")
    }
}