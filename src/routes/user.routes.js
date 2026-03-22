import { Router } from "express";
import { registerUser,
    loginUser ,
    logoutUser ,
    refreshToken
 } from "../controllers/user.controller.js";
import { upload } from '../middleware/multer.middleware.js';
import { verifyJWT } from "../middleware/auth.middleware.js";
import { get } from "mongoose";

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

router.route("/refresh-token").post(refreshToken)

router.route("/change-password").post(verifyJWT, changePassword)

router.route("/current-user").get(verifyJWT, getCurrentUser)

router.route("/update-profile").patch(verifyJWT,updateAccountDetails)

router.route("/update-avatar").patch(verifyJWT, upload.single("avatar"), updateAvatar)

router.route("/update-cover").patch(verifyJWT, upload.single("coverImage"), updateCoverImage)

router.route("/channel/:username").get(verifyJWT,getUserChannelProfile)

router.route("/watch-history").get(verifyJWT, getWatchHistory)



export default router;