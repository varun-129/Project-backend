import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from '../middleware/multer.middleware.js';

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
    registerUser
); 
//registerUser is imported from user.controller.js



export default router;