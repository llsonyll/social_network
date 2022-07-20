import express,{  Response, Request } from "express"; 
import { User } from "../../mongoose";
import bcrypt from "bcrypt"; 

let  router = express.Router();

//------------rute register----------------------------- 
router.post("/register", async (req:Request,res:Response)=>{
     try {
      let {email,password,firstname,lastname,username} = req.body;
     if(!email || !password || !firstname || !lastname || !username){
        return res.status(400).json({message: "Please, send your email and password" })
     }

     //search if User already exists
     let  user = await User.findOne({email: email});
    
     if(user){
        return res.status(400).json({message: "User already exists"});     
     }
     
     //password encryption
     let salt = await bcrypt.genSalt(10);
     req.body.password = await bcrypt.hash(password,salt);
     
     //create new User
     let newUser = new User (req.body);

     await newUser.save();

     res.status(200).json(newUser);
     } catch (error) {
       res.json("error register")
     }
})

export default router;
