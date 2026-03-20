import {asyncHandler} from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { User } from '../models/user.model.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const generateAccessAndRefreshTokens = async(userId) => {
    try{
       const user = await User.findById(userId);
       const accessToken = await user.generateAccessToken();
       const refreshToken = await user.generateRefreshToken();
       
       user.refreshToken = refreshToken;
         await user.save({validateBeforeSave : false});

         return {accessToken, refreshToken};
    }
    catch(error){
        throw new ApiError(500, "Failed to generate access and refresh token");
    }

}

const registerUser = asyncHandler(async (req, res) => {
    //get user detail from frontend
    //validate user detail (user name empty to nahi hai,email valid hai ya nahi, password strong hai ya nahi etc)
    //check if user already exist : using email id or username.
    //check for images ,check for avatar
    //upload them to cloudinary and get the url , check for avatar if it is successfully uploaded or not to cloudinary
    // create user object - create entry in database
    //remove password and refresh token field from response
    //check for user creation
    //return response


    //1. get user detail from frontend
    const { username, email, password ,fullName} = req.body;

    
    // console.log(req.body);
    // console.log("email", email);

    //validate user detail (user name empty to nahi hai,email valid hai ya nahi, password strong hai ya nahi etc)
    if(
        [username, email, password, fullName].some(               
            (field) => field?.trim()==="" || field === undefined || field === null
            /*this is array method , some method checks if any of the element in the array satisfies the condition 
            provided in the callback function, here we are checking if any of the field is empty or not*/
        )
    ){
        throw new ApiError(400, "All fields are required");
    }
     //check if user already exist : using email id or username.
    const existedUser = await User.findOne({
        $or: [{ email },{ username }]
    })

    if(existedUser){
        throw new ApiError(409, "User already exist with this email or username");
    }

    // console.log("req.files", req.files);
    //upload them to cloudinary and get the url , check for avatar if it is successfully uploaded or not to cloudinary
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required");
    }

    //upload them to cloudinary and get the url , check for avatar if it is successfully uploaded or not to cloudinary
    const avatar =  await uploadToCloudinary(avatarLocalPath);
    const coverImage = await uploadToCloudinary(coverImageLocalPath);

    //check again if avatar is successfully uploaded or not to cloudinary
    if(!avatar){
        throw new ApiError(400,"Failed to upload avatar to cloudinary")
    }

    // create user object - create entry in database
    const user = await User.create({
        fullName,
        avatar : avatar.url,
        coverImage : coverImage?.url || "",
        email,
        username : username.toLowerCase(),
        password
    })

    //checking if user is successfully created or not then remove password and refresh token field from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    //check for user creation
    if(!createdUser){
        throw new ApiError(500, "Failed to create user");
    }
    
    //return response
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )
})

const loginUser = asyncHandler(async (req, res) => {
    // bring data from request body
    //check if user exist with email or username
    //if user exist then compare password
    //if password match then generate access token and refresh token & save refresh token in database
    //return response with access token and refresh token
    //send them in cookies

    const {email,username,password} = req.body;

    if(!username && !email){
        throw new ApiError(400," Email or username is required " );
    }

    if(!password){
        throw new ApiError(400," Password is required " );
    }

    //check if user exist with email or username
    const user = await User.findOne({
        $or : [{email},{username}]
    })

    if(!user){
        throw new ApiError(404,"User not found with this email or username");
    }

    //checking password
    const isPasswordValid = await user.isPasswordCorrect(password);

     if(!isPasswordValid){
        throw new ApiError(404,"invalid password");
    }

     //if password match then generate access token and refresh token
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    //optional step
    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    const option = {
        httpOnly: true,
        secure : true,
    }

    return res.status(200).cookie("accessToken", accessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json(
        new ApiResponse(
            200, //status code
             {     
                //data
                user : loggedInUser,
                accessToken,
                refreshToken,
             },
             //message
            "User logged in successfully"

        )
    )
})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set : {
                refreshToken : undefined,
            }
        },
        {
            new : true,
        }
    )

    const option = {
        httpOnly: true,
        secure : true,
    }
    return res.status(200).clearCookie("accessToken", option).clearCookie("refreshToken", option).json(
        new ApiResponse(
            200,
            {},
            "User logged out successfully"
        )
    )
})


export {registerUser, loginUser, logoutUser};