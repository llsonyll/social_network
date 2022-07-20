import passport, { use } from "passport";
import passportLocal from 'passport-local';
import jwtStrategy from 'passport-jwt';
import bcrypt from 'bcrypt';
import mongoose from "mongoose";
import express from 'express';
import {IUser} from '../../types'

//Auth configuration function
export function Auth(app: express.Application, userCollection: mongoose.Model<IUser>){

    //Local strategy for authentication
    passport.use('local', new passportLocal.Strategy(
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
            secretOrKey: `${process.env.SECRET_TEST}`,
            jwtFromRequest: jwtStrategy.ExtractJwt.fromAuthHeaderAsBearerToken()
        },
        //Tryes to read the user from the token, or auth fails 
        async (token, done) =>{
            try{
                done(null, token.user)
            }catch(err){
                done(err)
            }
        }
    ))
}

