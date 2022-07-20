import express,{  Response, Request, NextFunction } from "express"; 
import { IUser } from './../../types/index';
import { User } from "../../mongoose";
import bcrypt from "bcrypt"; 
import  passport  from 'passport';
import jwt from "jsonwebtoken";

let  router = express.Router();

//---------------function create Token--------------------
const createToken = (user:IUser)=>{
    return jwt.sign({user:{id: user._id,email:user.email}},`${process.env.SECRET_TEST}`);
}

//---------------middleware new User-----------------------------
const middlewareNewUser = async (req:Request,res:Response,next:NextFunction)=>{
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
   let hash = await bcrypt.hash(password,salt);
   
   //create new User
   let newUser = new User ({...req.body,password:hash});

   await newUser.save();

   //res.status(201).json(newUser);
   next();
 } catch (error) {
     res.json(error)
   }
}

//------------rute register----------------------------- 
router.post("/register", middlewareNewUser, passport.authenticate("local",{session: false, failureRedirect: '/auth/login'}),
async (req:Request,res:Response)=>{
   //user return of passport strategy
 try {
   let{user} = req; 
   if(user){
     return res.status(200).json({token: createToken(user as IUser)});
      //res.redirect()
    }
   return res.status(400).json("The user does not exists");
 } catch (error) {
   res.json(error);
 }
}) 

//route error login 
router.get("/login",(req:Request,res:Response)=>{
   res.status(400).json('Incorrect email or password.');
})

//-----------------------------login user -----------------------------
/*
  strategy passport local, verify user in database if error redirect route error login
*/ 
router.post("/login",passport.authenticate("local", { session: false,failureRedirect: '/auth/login'}), 
async (req:Request,res:Response)=>{
   //user return of passport strategy
 try {
   let{user} = req; 
   if(user){
     return res.status(200).json({token: createToken(user as IUser)});
      //res.redirect()
    }
   return res.status(400).json("The user does not exists");
 } catch (error) {
   res.json(error);
 }
})


export default router;