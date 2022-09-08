const express = require("express");
const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.post("/signup", async (req, res) => {
    // console.log(req.body.password);

    const { name, email, password } = req.body;
    if (!name || !password || !email) {
        return res.status(400).json({
            msg: "Please fill all the fields",
        });
    }
    const existingUser = await userModel.findOne({
        email: email,
    });
    if (existingUser) {
        return res.status(400).json({
            msg: "User already exists",
        });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword)
    console.log(password);
    // const newUser = new userModel({
    //     name: name,
    //     email: email,
    //     password: hashedPassword,
    // });
    let newUser = await userModel.create({
        name: name,
        email: email,
        password: hashedPassword,
    })

    // await newUser.save((err, user) => {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         console.log(user);
    //     }
    // });
    let sendUser = { ...newUser };
    delete sendUser._doc.password;

    res.send({
        msg: "User Created",
        user: sendUser,
    });
});


// !Login function of users

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: "Please fill all fields" });
    }

    const user = await userModel.findOne({ email: email });

    if (!user) {
        return res.status(400).json({ msg: "User does not exist" });
    }
    let payload = { email: user.email };

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({
            msg: "Invalid Credentials",
        });
    }
    let sendUser = { ...user };
    delete sendUser._doc.password;
    let accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1hr",
    });
    let refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "1hr",
    });
    res.send({
        accessToken: accessToken,
        refreshToken: refreshToken,
    });
});

// !Getting new tokens
router.get("/token", async (req, res) => {
    const refeshToken = req.body.refeshToken;

    if (!refeshToken) {
        return res.status(400).send("Please Provide Refresh Token");

    }
    try {
        let payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);//!problem
        let newPayload = payload.email;

        let newAccessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "1hr",
        });
        res.status(200).send({ accessToken: newAccessToken })
    }
    catch (err) {
        res.status(400).send({ err: err })
    }



}
)


module.exports = router;