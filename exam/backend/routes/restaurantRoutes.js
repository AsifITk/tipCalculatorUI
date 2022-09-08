const express = require("express");
const mongoose = require("mongoose");
const orderModel = require("../models/orderModel");
const restaurantModel = require("../models/restaurantModel")
const router = express.Router();


router.post("/", async (req, res) => {
    const { title, desc, dishes, orders, } = await req.body;
    if (!title || !desc) {
        return res.status(400).json({ msg: "Please fill all fields" });
    }

    const newRestaurant = new restaurantModel(req.body);
    console.log(newCategory);
    await newRestaurant.save((err, category) => {
        if (err) {
            console.log(err);
        } else {
            console.log(category);
        }
    });
    res.send("post");

});


router.get("/", async (req, res) => {
    const restaurants = await restaurantModel.find();
    res.send(restaurants);
}
);


router.get("/:id", async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const restaurent = await restaurantModel.findById(id + "");

    res.send(restaurent);
}
);

//add dish
router.post("/:id", async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const restaurent = await restaurantModel.findById(id + "");
    restaurent.dishes.push(req.body);
    await restaurent.save((err, restaurant) => {
        if (err) {
            console.log(err);
        } else {
            console.log(restaurant);
        }
    }


    res.send(restaurent);

})


// GET /restaurants/:id/orders: Get all orders of a restaurant, should be able to filter by passing ?status=pending etc.
router.get("/orders/:id", async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const restaurant = await restaurantModel.findById(id + "");
    const orders = restaurant.orders;

    res.send(orders);
}
);


// GET /restaurants/:id/revenue?s
