import multer from "multer";


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname) //agar user ki same name ki files aa gayi to wo ek dosre ko overwrite kar degi 
    // but ye bohot small /minor time k liye he rehti hai server par isiliye ye problem nahi hoti hai 
    // kyunki hum us file ko cloudinary par upload karne ke baad turant delete kar dete hai server se
    //baki sabse sahi to yahi hai ki aap file ka name unique rakhne ke liye usme timestamp ya uuid add kar do taki same name ki files aane par bhi wo ek dosre ko overwrite na kar sake
  }
})

export const upload = multer(
    { 
        storage,
    }
)