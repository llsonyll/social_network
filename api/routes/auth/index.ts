import express,{  Response, Request } from "express"; 
import { User } from "../../mongoose";
import bcrypt from "bcrypt"; 

let  router = express.Router();

//------------rute register-----------------------------
router.post("/register", async (req:Request,res:Response)=>{
     try {
      let {email,password} = req.body;
     if(!email || !password){
        return res.status(400).json({message: "Please, send your email and password" })
     }
     let  user = await User.findOne({email: email});

     if(user){
        return res.status(400).json({message: "User already exists"});     
     }
      
   
     let salt = await bcrypt.genSalt(10);
     req.body.password = await bcrypt.hash(password,salt);
     
     let newUser = new User (req.body);
     
     await newUser.save();

     res.status(200).json(newUser);
     } catch (error) {
       res.json("error register")
     }
})

router.get("/hola",(req:Request,res:Response)=>{
   res.json('hola');
})

// //-------------rute login---------------------------------
// router.post("/login",)

export default router;
