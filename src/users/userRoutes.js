const {Router} = require("express");
const {createUser, readUsers, updateUser, deleteUser, loginUser } = require("./userController");
const {hashPass, comparePass, tokenCheck } =require("../middleware");

const userRouter = Router();

userRouter.post("/createUser", hashPass, createUser);
userRouter.post("/login",comparePass, loginUser);
userRouter.get("/readUser",tokenCheck, readUsers);
userRouter.put("/updateUser", updateUser);
userRouter.delete("/deleteUser", deleteUser);



module.exports = userRouter;