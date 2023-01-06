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

// exports.tokenCheck = async (req, res, next) => {
//     try {
//         const token = req.header("Authorization").replace("Bearer ", "")
//         const decodeToken = await jwt.verify(token, process.env.SECRET)
//         const user = await User.findById(decodeToken)

//         if(user) {
//             req.authUser = user 
//             next()
//         } else{
//             throw new Error ("user is not authorised")
//         }
//     } catch (error) {
//         console.log(error)
//         res.status(500).send({error: error.message})
//     }
// };


exports.tokenCheck = async (req, res, next) => {
    try {
        //get the token thats passed in the headers 
        const token = req.header("Authorization").replace("Bearer ", "")

        //throw an error if no token is passed in the request
        // if (!token) {
        //     console.log("no token passed")
        //     throw new Error ("No token passed")
        // }

        // decode the token using the jwt verify method. we pass the method two parameters.
        //encoded token that we got on line  51 and the secret password we encoded in the token when we generated it 
        const decodedToken = await jwt.verify(token, process.env.SECRET)
        // console.log(decodedToken)
        // console.log(decodedToken._id)
        
        //decodedToken is an object containing the users unique id. 
        //we can then use that unique id to find our user in our database =
        const user = await User.findById(decodedToken._id)
        // console.log("find by ID")
        // console.log(user)
        //if user is not null. move onto the controller
        //else throw a new error that user is not authorised or doesn't exist in our database
        console.log(user)
        if(user) {
            req.authUser = user
            next()
        } else {
            throw new Error ("user is not authorised")
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({error : error.message})
    }
}