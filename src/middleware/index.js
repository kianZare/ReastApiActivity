const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../users/userModel");

exports.hashPass = async (req, res, next) => {
    try {
        req.body.password = await bcrypt.hash(req.body.password, 10)
        next()
    } catch (error) {
        console.log(error)
        res.status(500).send({error: error.message})
    }
};


exports.comparePass = async (req, res, next) => {
    try {
        req.user = await User.findOne({username: req.body.username})
        console.log("Plain text Password")
        console.log(req.body.password)
        console.log("Hashed Password")
        console.log(req.user.password)

        if(req.user && await bcrypt.compare(req.body.password, req.user.password)) {
            console.log("username exists and plain text password matches hashed password")
            next()
        } else {
            throw new Error ("incorrect username or password")
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({error : error.message})
    }
};

exports.tokenCheck = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "")
        const decodeToken = await jwt.verify(token, process.env.SECRET)
        const user = await User.findById(decodeToken)

        if(user) {
            next()
        } else{
            throw new Error ("user is not authorised")
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({error: error.message})
    }
};