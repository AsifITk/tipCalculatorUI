const mongoose = require("mongoose");

const Schema = new mongoose.Schema({

    title: { type: String, required: true },
    desc: { type: String, required: true },
    dishes: [],
    orders: [{ type: mongoose.Schema.Types.ObjectId }, ref: "Order"]
    createdBy: [{ type: mongoose.Schema.Types.ObjectId }, ref: "User"]
});

const restaurantModel = mongoose.model("Restaurant", Schema);
module.exports = restaurantModel;