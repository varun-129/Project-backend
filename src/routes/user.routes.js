import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from '../middleware/multer.middleware.js';
import { loginUser } from "../controllers/user.controller.js";
import { logoutUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name : "avatar",
            maxCount : 1
        },
        {
            name : "coverImage",
            maxCount : 1
        }
    ]), //ye middleware hai jo multer se aata hai , ye file upload karne ke liye use hota hai , 
    registerUser         //registerUser is imported from user.controller.js

); 

router.route("/login").post(loginUser);


router.route("/logout").post(verifyJWT, logoutUser)





export default router;