import passport, { use } from "passport";
import passportLocal from 'passport-local';
import jwtStrategy from 'passport-jwt';
import bcrypt from 'bcrypt';
import mongoose from "mongoose";
import express from 'express';
import {IUser} from '../../types'

export function Auth(app: express.Application, userCollection: mongoose.Model<IUser>){


    passport.use('local', new passportLocal.Strategy(
        function(username,password, done){
            userCollection.findOne({username: username}, (err:Error, user:IUser) => {
                console.log(`user ${username} tried to log in`)
                if(err) return done(err)
                else if (!user) return done(null, false)
                else if(!bcrypt.compareSync(password, user.password)) return done(null, false)
                else return done(null, user)
            })
        }
    ))

    passport.use('jwt', new jwtStrategy.Strategy(
        {
            secretOrKey: `${process.env.SECRET_TEST}`,
            jwtFromRequest: jwtStrategy.ExtractJwt.fromAuthHeaderAsBearerToken()
        },
        async (token, done) =>{
            try{
                done(null, token.user)
            }catch(err){
                done(err)
            }
        }
    ))
}

