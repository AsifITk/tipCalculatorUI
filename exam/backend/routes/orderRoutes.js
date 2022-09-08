const express = require("express");
const mongoose = require("mongoose");
const orderModel = require("../models/orderModel");
const userModel = require("../models/userModel");
const router = require("./userRoutes");

router.post("/", async (req, res) => {
    const { items, totalPrice, status, orderedBy } = req.body;

    if (!items || !totalPrice || !status || !orderedBy) {
        return res.status(400).json({
            msg: "Please fill all the fields",
        });
    }

    const newOrder = new orderModel({
        items: items,
        totalPrice: totalPrice,
        status: status,
        orderedBy: orderedBy,
    });

    await newOrder.save(async (err, order) => {
        if (err) {
            console.log(err);
        } else {
            console.log(order);
        }
    });

    res.send("order Created");
});

router.get("/", async (req, res) => {
    const orders = await orderModel.find();
    res.send(orders);
});

router.put("/"
async (req, res) => {
        const { id } = req.params;
        const order = await orderModel.findById(id + "");
        order.status = req.body;
        await order.save((err, order) => {
            if (err) {
                console.log(err);
                res.send(err);
            } else {
                console.log(order)
            }

        })

        res.send(order)

    }
)
router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    console.log(id);
    // delete from productModel
    let order = await orderModel.findByIdAndDelete(id);
    let seller = await orderModel.findByIdAndUpdate(product.seller, { $pull: { adds: product._id } })


    res.send("deleted");
}
);
