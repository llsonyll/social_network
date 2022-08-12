import { Token } from './../../mongoose/index';
import passport, { use } from "passport";
import passportLocal from 'passport-local';
import jwtStrategy from 'passport-jwt';
import bcrypt from 'bcrypt';
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import express from 'express';
import {IUser} from '../../types';
import  GoogleStrategy from "passport-google-oauth20";
import FacebookStrategy from "passport-facebook"; 
import axios from "axios";

const redirect = async(refreshToken: any)=>{
    try {
        let res = await axios.post(`${process.env.URL}auth/refresh`,{refreshToken});
        return res.data;    
    } catch (err) {
       console.log(err)
    }
};

const profileArray = [
    "https://res.cloudinary.com/dnw4kirdp/image/upload/v1658694142/p1_anad93.png",
    "https://res.cloudinary.com/dnw4kirdp/image/upload/v1658694142/p2_tj88ek.png",
    "https://res.cloudinary.com/dnw4kirdp/image/upload/v1658694142/p3_dlphru.png",
    "https://res.cloudinary.com/dnw4kirdp/image/upload/v1658694142/p4_zy2yhe.png",
    "https://res.cloudinary.com/dnw4kirdp/image/upload/v1658694142/p5_i3n2nd.png",
  ];

//Auth configuration function
export function Auth(app: express.Application, userCollection: mongoose.Model<IUser>){

    //Local strategy for authentication
    passport.use('local', new passportLocal.Strategy({usernameField: 'email'},
        function(email,password, done){
            //Try to find an user with that email
            userCollection.findOne({email: email}, (err:Error, user:IUser) => {
                console.log(`user ${email} tried to log in`)
                if(err) return done(err)
                //If no user found or wrong password the authentication fails, else it executes a callback
                else if (!user) return done(null, false)
                else if(!bcrypt.compareSync(password, user.password)) return done(null, false)
                else return done(null, user)
            })
        }
    ))

     //google strategy
     passport.use(new GoogleStrategy.Strategy({
        clientID: `${process.env.GOOGLE_CLIENT_ID}`,
        clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
        callbackURL: `${process.env.URL}auth/loginGoogle`,
        scope:["email","profile"],
      },async(accessToken,RefreshToken,profile,done)=>{
         try {
            let{  _json }  = profile;
            let user: any = await userCollection.findOne({email: `${_json.email}`});    
            if(!user){
               let salt = await bcrypt.genSalt(10);
               let hash = await bcrypt.hash(`${profile.id}`, salt);     
            let newUser: any  = new userCollection({
                lastname: _json.family_name,
                firstname: _json.given_name,
                username: _json.given_name,
                email: _json.email,
                password: hash,
                profilePicture: profileArray[Math.floor(Math.random() * 5)]
            });
            await newUser.save();
            return done(null,newUser);
            }else{
               return done(null,user);     
            }
         } catch (err) {
            return done(null,false);
        }
    }));

    //facebook strategy
    passport.use("facebook",new FacebookStrategy.Strategy({
        clientID: `${process.env.FACEBOOK_APP_ID}`,
        clientSecret: `${process.env.FACEBOOK_APP_SECRET}`,
        callbackURL: `${process.env.URL}auth/loginFacebook`,
        profileFields: ['email','id', "name",'displayName', 'photos'],
      },async(accessToken,RefreshToken,profile,done)=>{
        try {
           let{  _json }  = profile;
           let user: any = await userCollection.findOne({email: `${_json.email}`});  

           if(!user){
              let salt = await bcrypt.genSalt(10);
              let hash = await bcrypt.hash(`${profile.id}`, salt);     
           let newUser: any  = new userCollection({
               lastname: _json.last_name,
               firstname: _json.first_name,
               username: _json.first_name,
               email: _json.email,
               password: hash,
               profilePicture: profileArray[Math.floor(Math.random() * 5)],
           });
           await newUser.save();
           return done(null,newUser);
           }else{
              return done(null,user);     
           }
        } catch (err) {
           return done(null,false);
       }
   }));

    //JasonWebToken strategy for auth
    passport.use('jwt', new jwtStrategy.Strategy(

        //Extracts the token
        {
            secretOrKey: `${process.env.SECRET_REFRESH}`,
            jwtFromRequest: jwtStrategy.ExtractJwt.fromAuthHeaderAsBearerToken()
        },
        //Tryes to read the user from the token, or auth fails 
        async (refreshtoken, done) =>{
            try{
                let token: any = await Token.findOne({email: refreshtoken.email});

                if(!token || !(refreshtoken.userTokenId === token._id.toString()))
                {return done(null,false)};

                token = jwt.verify(token.token,`${process.env.SECRET_TEST}`);

               return done(null, token.user);
            }catch(err:any){
                if(err.message === 'jwt expired'){
                    await redirect(refreshtoken);

                    let token: any = await Token.findOne({email: refreshtoken.email});

                    token = jwt.verify(token.token,`${process.env.SECRET_TEST}`);

                    return done(null, token.user);
                }else{
                    return done(null,false);
                }
            }
        }
    ))
}

