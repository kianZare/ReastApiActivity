const {Router} = require("express");
const {createUser, readUsers, updateUser, deleteUser, loginUser } = require("./userController");
const {hashPass, comparePass, tokenCheck } =require("../middleware");

const userRouter = Router();

userRouter.post("/createUser", hashPass, createUser);
userRouter.post("/login",comparePass, loginUser);
userRouter.get("/readUser", readUsers);
userRouter.get("/authCheck", tokenCheck, loginUser) // endpoint for persistant login 
userRouter.put("/updateUser",hashPass, updateUser);
userRouter.delete("/deleteUser", deleteUser);



module.exports = userRouter;