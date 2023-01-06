const User = require("./userModel");
const jwt = require("jsonwebtoken");


exports.createUser = async (req , res) => {
    console.log(req.body)
    try {
        const newUser = await User.create(req.body)
        console.log(newUser)
        res.status(201).send({message: "A user has been Successfuly created"})
    } catch (error) {
        console.log(error)
        res.status(500).send({error: error.message})
    }
};

exports.readUsers = async (req, res) => {
    try {
        const users = await User.find({})
        res.status(200).send({users: users})
    } catch (error) {
        console.log(error)
        res.status(500).send({error: error.message})
    }
};


exports.updateUser = async (req, res) => {
    try {
        await User.updateOne(
            {username: req.body.username},
            {[req.body.key]: req.body.value}
        )
        res.status(200).send({message: "A user data has been updated"})
    } catch (error) {
        console.log(error)
        res.status(500).send({error: error.message})
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await User.deleteOne({username: req.body.username})
        res.status(200).send({message: "A user successfully deleted"})
    } catch (error) {
        console.log(error)
        res.status(500).send({error: error.message})
    }
};

exports.loginUser = async (req, res) => {
    console.log("middleware passed and controller has been called")
    try {
        if (req.authUser) {
            console.log("token check passed and continue to persistant login")
            res.status(200).send({username: req.authUser.username})
            return
        }
        const user = await User.findOne({username: req.body.username})
        const token = await jwt.sign({_id: user._id }, process.env.SECRET)
        res.status(200).send({username: user.username, token})
    } catch (error) {
        console.log(error)
        console.log("username not found")
        res.status(500).send({error: error.message})
    }
};

