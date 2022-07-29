import { Token } from './../../mongoose/index';
import passport, { use } from "passport";
import passportLocal from 'passport-local';
import jwtStrategy from 'passport-jwt';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import express from 'express';
import {IUser} from '../../types';
import axios from "axios";
import { finished } from "nodemailer/lib/xoauth2";

const redirect = async(refreshToken: any)=>{
    let res = await axios.post(`${process.env.URL}/auth/refresh`,{refreshToken});
    return res.data;
};

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
                
                let expiredRefreshT = new Date(refreshtoken.exp * 1000);
                
                if(expiredRefreshT < new Date()){throw new Error("logueate de nuevo!!!")};
               
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

