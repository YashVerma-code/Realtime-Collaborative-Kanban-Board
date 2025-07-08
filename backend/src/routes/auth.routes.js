import express from "express"
import { checkAuth, login, logout, signup, updateProfile ,fetchUsers} from "../controller/auth.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router=express.Router()

router.post("/signup",signup);
router.post("/login",login);
router.post("/logout",logout);
router.get("/",isAuthenticated,fetchUsers);
router.get("/check",isAuthenticated,checkAuth);
router.put("/update-profile", isAuthenticated, updateProfile);
export default router;