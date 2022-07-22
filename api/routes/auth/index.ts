import express,{  Response, Request, NextFunction } from "express"; 
import { IUser } from './../../types/index';
import { User } from "../../mongoose";
import bcrypt from "bcrypt"; 
import  passport  from 'passport';
import jwt from "jsonwebtoken";
import randToken from "rand-token";

let  router = express.Router();

//---------------function create Token--------------------
const createToken = (user:IUser)=>{
    return jwt.sign({user:{id: user._id,email:user.email}},`${process.env.SECRET_TEST}`,{
      expiresIn : 60
    });
}

const createRefreshToken = ()=>{
  return jwt.sign({},`${process.env.SECRET_TEST}`,{
    expiresIn : 60 * 5
  });
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

let refreshTokens = {
  refreshToken:"",
};

//-----------------------------retorna new token ---------------------------------
router.post("/token",passport.authenticate("jwt",{session: false, failureRedirect: "/auth/loginjwt"}) ,async(req:Request,res:Response)=>{
   try {
       let email = req.body.email;
       let refreshToken = req.body.refreshToken;

       if(refreshTokens.hasOwnProperty("refreshToken") && email === refreshTokens.refreshToken ){
          let user: any = User.findOne({email: email});
         if(!user){
           return res.status(400).json("user does not exist");
         }
           
           let newToken = createToken(user as IUser);
           let newRefreshToken = createRefreshToken(); 
           
           //await jwt.destroy(refreshToken);

          return res.status(200).json({token: newToken, refreshToken: newRefreshToken });
       }
      return res.status(401).json("error refresh token");
   } catch (err) {
     return res.status(400).json(err)
   }
})

//------------rute register----------------------------- 
router.post("/register", middlewareNewUser, passport.authenticate("local",{session: false, failureRedirect: '/auth/login'}),
async (req:Request,res:Response)=>{
   //user return of passport strategy
 try {
   let{user} = req; 
   //------------crea  token y refreshtoken----------------------------------
   if(user){
     const send:IUser = user as IUser
    
     const token = createToken(user as IUser);
     let refreshToken = createRefreshToken();
     
     refreshTokens.refreshToken = send.email;
    
     return res.status(200).json({token: token, username: send.username, _id: send._id,refreshToken});
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
router.get("/loginjwt", (req:Request, res:Response) =>{
   res.status(400).json('Token needed')
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
     const send:IUser = user as IUser
     return res.status(200).json({token: createToken(user as IUser), username: send.username, _id: send._id});
      //res.redirect()
    }
   return res.status(400).json("The user does not exists");
 } catch (error) {
   res.json(error);
 }
})

//------------------------route data user----------------------------------
router.post("/",passport.authenticate("jwt", { session: false,failureRedirect: '/auth/loginjwt'}),
   async (req:Request,res:Response)=>{
   try {

    //-------------extract Authorization from HTTP headers----------------
    const authorization: string [] | undefined = req.headers.authorization?.split(" ");

    if(!authorization || authorization.length !== 2 || authorization[0] !== "Bearer"){
     return  res.status(400).json("no token")
   }

  const token = authorization[1];

  //------------------------decode token-----------------------------------
  let verifyToken: any = jwt.verify(`${token}`,`${process.env.SECRET_TEST}`);
  
  if(!verifyToken || !verifyToken.user ){
    res.status(401).json("Invalid Token")
  }

  let  { id } = verifyToken.user;

  const user: IUser | null = await User.findById(`${id}`);
  
  if(!user){
    return res.status(400).json("Invalid Token")
  }

  let { username } = user;

  return res.status(200).json({id,username});
   } catch (err) {
    return res.status(400).json(err);
   }
  })

//-------------------------route test---------------------------------
router.get('/test', passport.authenticate('jwt', {session:false, failureRedirect: '/auth/loginjwt'}), (req:Request, res:Response)=>{
   res.json({msg: 'Todo funciona a la perfeccion'})
})


export default router;
